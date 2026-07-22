require('dotenv').config({ path: '../.env' });
const fs = require('fs');
const path = require('path');

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3';

async function callOllama(prompt) {
  const response = await fetch(`${OLLAMA_HOST}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages: [{ role: 'user', content: prompt }],
      stream: false,
      options: { temperature: 0 },
    }),
  });
  if (!response.ok) throw new Error(`Ollama error: ${response.status}`);
  const data = await response.json();
  return data.message.content.trim();
}

/**
 * Hallucination detection: Lower score = less hallucination (better).
 */
async function evaluateHallucination(question, answer, context) {
  const prompt = `
You are an expert hallucination detector for AI systems.
Given a "Context" (source of truth) and an "Answer" to a "Question", determine if the Answer contains any hallucinated claims.

Definition of Hallucination: A statement in the Answer that contradicts, misinterprets, or adds unsupported facts not present in the Context.

Question: "${question}"
Context: "${context}"
Answer: "${answer}"

Instructions:
- Return ONLY a numeric score between 0.0 and 1.0.
- Score 0.0: The Answer is fully consistent with the Context (No hallucination).
- Score 0.5: The Answer contains minor or ambiguous unsupported facts.
- Score 1.0: The Answer directly contradicts the Context or invents facts.

Return ONLY the number.
  `;

  const result = await callOllama(prompt);
  const score = parseFloat(result);
  return isNaN(score) ? 0 : Math.min(Math.max(score, 0), 1);
}

async function runHallucinationScan() {
  const datasetPath = path.join(__dirname, 'golden_dataset.json');
  const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf-8'));

  console.log('--- Running Hallucination Scan on Golden Dataset (Ollama) ---');
  console.log(`Using Model: ${OLLAMA_MODEL}`);
  let totalScore = 0;

  for (const item of dataset) {
    const score = await evaluateHallucination(item.question, item.expected_output, item.context);
    totalScore += score;
    console.log(`Q: ${item.question} | Hallucination Score: ${score.toFixed(3)} (Lower is better)`);
  }

  const avgScore = totalScore / dataset.length;
  console.log(`\n--- Average Hallucination Rate: ${avgScore.toFixed(3)} (Lower is better) ---`);
}

if (require.main === module) {
  runHallucinationScan().catch(console.error);
}

module.exports = { evaluateHallucination };