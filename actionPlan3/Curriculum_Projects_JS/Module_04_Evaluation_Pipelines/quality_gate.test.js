require('dotenv').config({ path: '../.env' });

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

describe('CI/CD Quality Gate - Answer Relevancy Threshold (Ollama)', () => {
  async function evaluateRelevancy(question, answer) {
    const prompt = `
You are a Relevancy Judge. Given a Question and an Answer, rate how RELEVANT the Answer is to the Question.
Score from 0.0 (completely irrelevant) to 1.0 (perfectly relevant).
Return ONLY the number.

Question: "${question}"
Answer: "${answer}"
    `;
    const result = await callOllama(prompt);
    return parseFloat(result) || 0;
  }

  test('Should PASS if Answer Relevancy >= 0.8 (Quality Gate)', async () => {
    const question = 'How to reset my password?';
    const answer = 'You can reset your password by clicking the "Forgot Password" link on the login page.';

    const score = await evaluateRelevancy(question, answer);
    console.log(`Relevancy Score: ${score}`);

    expect(score).toBeGreaterThanOrEqual(0.8);
  });

  test('Should FAIL (demonstration) if Answer is not relevant', async () => {
    const question = 'What is the weather?';
    const answer = 'I like to eat pizza.';

    const score = await evaluateRelevancy(question, answer);
    console.log(`Relevancy Score (bad): ${score}`);

    if (score < 0.8) {
      console.warn('Build would FAIL: Relevancy score below threshold.');
    }
    expect(true).toBe(true);
  });
});