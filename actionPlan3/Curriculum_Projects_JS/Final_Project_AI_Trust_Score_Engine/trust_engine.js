require('dotenv').config({ path: '../.env' });
const fs = require('fs');
const path = require('path');
const { evaluateFaithfulness } = require('../Module_01_RAG_Evaluation_Triad/rag_faithfulness_eval');
const { evaluateHallucination } = require('../Module_02_Hallucination_Detection/hallucination_scanner');

// Module 3: Security Scanner (simplified, local)
class SecurityScanner {
  static scan(inputText) {
    const maliciousPatterns = ['ignore previous', 'system prompt', 'reveal'];
    for (const pattern of maliciousPatterns) {
      if (inputText.toLowerCase().includes(pattern)) {
        return { injectionDetected: true, pattern };
      }
    }
    return { injectionDetected: false };
  }
}

class TrustScoreEngine {
  async computeCompositeScore(question, answer, context) {
    // 1. Measure Faithfulness (Module 1 - Ollama)
    const faithfulness = await evaluateFaithfulness(question, answer, context);

    // 2. Measure Hallucination (Module 2 - Ollama, invert so higher is better)
    const hallucinationScore = await evaluateHallucination(question, answer, context);
    const antiHallucination = 1 - hallucinationScore;

    // 3. Security Scan (Module 3 - local)
    const secCheck = SecurityScanner.scan(question);
    const securityScore = secCheck.injectionDetected ? 0 : 1;

    // 4. Composite Trust Score (Weighted)
    const composite = faithfulness * 0.4 + antiHallucination * 0.3 + securityScore * 0.3;

    return {
      faithfulness: Math.round(faithfulness * 1000) / 1000,
      antiHallucination: Math.round(antiHallucination * 1000) / 1000,
      securityScore: Math.round(securityScore * 1000) / 1000,
      compositeScore: Math.round(composite * 1000) / 1000,
      securityWarning: secCheck,
    };
  }

  async batchEvaluate(datasetPath = 'full_golden_dataset.json') {
    const fullPath = path.join(__dirname, datasetPath);
    const data = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));

    const results = [];
    for (const item of data) {
      const result = await this.computeCompositeScore(item.question, item.expected_output, item.context);
      results.push({ question: item.question, ...result });
    }
    return results;
  }

  generateReport(results, outputPath = 'final_report.json') {
    const avgF = results.reduce((s, r) => s + r.faithfulness, 0) / results.length;
    const avgA = results.reduce((s, r) => s + r.antiHallucination, 0) / results.length;
    const avgS = results.reduce((s, r) => s + r.securityScore, 0) / results.length;
    const avgC = results.reduce((s, r) => s + r.compositeScore, 0) / results.length;

    const report = {
      summary: {
        averageFaithfulness: Math.round(avgF * 1000) / 1000,
        averageAntiHallucination: Math.round(avgA * 1000) / 1000,
        averageSecurity: Math.round(avgS * 1000) / 1000,
        overallTrustScore: Math.round(avgC * 1000) / 1000,
        totalSamples: results.length,
      },
      failedClaims: results.filter((r) => r.compositeScore < 0.5),
      detailedResults: results,
    };

    const reportPath = path.join(__dirname, outputPath);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`--- Report Generated: ${reportPath} ---`);
    console.log(JSON.stringify(report.summary, null, 2));
    return report;
  }
}

async function main() {
  const engine = new TrustScoreEngine();
  const results = await engine.batchEvaluate();
  engine.generateReport(results);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { TrustScoreEngine };