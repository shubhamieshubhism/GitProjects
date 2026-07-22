require('dotenv').config({ path: '../.env' });

// Ollama API configuration
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3';

/**
 * Call Ollama Chat API
 */
async function callOllama(prompt) {
  const response = await fetch(`${OLLAMA_HOST}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages: [{ role: 'user', content: prompt }],
      stream: false,
      options: { temperature: 0 }, // Deterministic output for evaluation
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.message.content.trim();
}

/**
 * LLM-as-a-Judge: Evaluate Faithfulness
 */
async function evaluateFaithfulness(question, answer, context) {
  const prompt = `
You are an expert evaluator for RAG systems. 
Given the "Context" and the "Answer" provided to a user's "Question", determine how FAITHFUL the Answer is to the Context.

Definition of Faithfulness: All factual claims in the Answer must be directly supported or implied by the Context. If the Answer introduces facts not present in the Context, it is NOT faithful.

Question: "${question}"
Context: "${context}"
Answer: "${answer}"

Instructions:
- Analyze each claim in the Answer.
- Return ONLY a numeric score between 0.0 and 1.0.
- Score 1.0: The Answer is entirely faithful and grounded in the Context.
- Score 0.5: The Answer has some unsupported claims.
- Score 0.0: The Answer is mostly or entirely unsupported.

Return ONLY the number (e.g., 0.85). Do not include any other text.
  `;

  const result = await callOllama(prompt);
  const score = parseFloat(result);
  return isNaN(score) ? 0 : Math.min(Math.max(score, 0), 1);
}

async function runFaithfulnessTest() {
  const retrievedContext = [
    'Albert Einstein was born in Germany in 1879.',
    'He developed the theory of relativity, which revolutionized physics.',
    'Einstein received the Nobel Prize in Physics in 1921 for his work on the photoelectric effect.',
  ].join(' ');

  const userQuestion = "Tell me about Einstein's birth and achievements.";
  const generatedAnswer =
    'Albert Einstein was born in 1879 in Germany. He is famous for the theory of relativity, and he won a Nobel Prize.';

  console.log('--- Running RAG Faithfulness Evaluation (Ollama as Judge) ---');
  console.log(`Using Model: ${OLLAMA_MODEL}`);
  const score = await evaluateFaithfulness(userQuestion, generatedAnswer, retrievedContext);

  const passed = score >= 0.7;
  console.log(`Faithfulness Score: ${score.toFixed(3)}`);
  console.log(`Passed (>= 0.7): ${passed}`);
}

if (require.main === module) {
  runFaithfulnessTest().catch(console.error);
}

module.exports = { evaluateFaithfulness };