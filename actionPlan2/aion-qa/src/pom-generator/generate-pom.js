// const { captureDOMSnapshot, createTokenEfficientSummary } = require('../dom-capture/capture-dom');
// const fs = require('fs');
// const path = require('path');
// require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// /**
//  * Generates a JavaScript Page Object Model class using an LLM
//  */
// async function generatePOMFromDOM(url, outputPath) {
//   const { semanticElements, pageInfo } = await captureDOMSnapshot(url);
//   const summary = createTokenEfficientSummary(semanticElements);
//   const prompt = buildPOMPrompt(summary, pageInfo);
//   const generatedCode = await callLLM(prompt);
//   fs.writeFileSync(outputPath, generatedCode, 'utf-8');
//   return generatedCode;
// }

// function buildPOMPrompt(elements, pageInfo) {
//   return `You are a senior QA automation engineer. Generate a JavaScript Page Object Model class for the following page.

// Page Title: ${pageInfo.title}
// Page URL: ${pageInfo.url}

// Interactive elements found on the page:
// ${JSON.stringify(elements, null, 2)}

// Requirements:
// 1. Class name: Use PascalCase based on the page title (e.g., "LoginPage")
// 2. Each element should have a getter method using Playwright's Locator API
// 3. Method names should be derived from aria-label, role, or semantic context (camelCase)
// 4. Include methods for common interactions (click, fill, select, etc.)
// 5. Use Playwright's locator methods: getByRole, getByLabel, getByText, etc.
// 6. Include a constructor that accepts a Page object

// Example format:
// ```javascript
// const { Page } = require('@playwright/test');

// class LoginPage {
//   constructor(page) {
//     this.page = page;
//   }
  
//   get usernameInput() {
//     return this.page.getByLabel('Username');
//   }
  
//   get loginButton() {
//     return this.page.getByRole('button', { name: 'Login' });
//   }
  
//   async login(username, password) {
//     await this.usernameInput.fill(username);
//     await this.passwordInput.fill(password);
//     await this.loginButton.click();
//   }
// }

// module.exports = { LoginPage };
// ```

// Return ONLY the JavaScript code, no explanations. Ensure all methods have proper JSDoc comments.
// `;
// }

// async function callLLM(prompt) {
//   const provider = process.env.LLM_PROVIDER || 'openai';
  
//   if (provider === 'openai') {
//     const response = await fetch('https://api.openai.com/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: 'gpt-4',
//         messages: [{ role: 'user', content: prompt }],
//         temperature: 0.3,
//       }),
//     });
//     const data = await response.json();
//     return data.choices[0].message.content;
//   } else if (provider === 'ollama') {
//     const response = await fetch('http://localhost:11434/api/generate', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         model: process.env.OLLAMA_MODEL || 'llama3',
//         prompt: prompt,
//         stream: false,
//       }),
//     });
//     const data = await response.json();
//     return data.response;
//   }
//   throw new Error('Unsupported LLM provider');
// }

// // CLI usage: node src/pom-generator/generate-pom.js <url> <outputPath>
// if (require.main === module) {
//   const url = process.argv[2] || 'http://localhost:3000/login';
//   const outputPath = process.argv[3] || './src/tests/pages/LoginPage.js';
//   generatePOMFromDOM(url, outputPath)
//     .then(() => console.log(`✅ POM generated at ${outputPath}`))
//     .catch(err => console.error('❌ Generation failed:', err));
// }

// module.exports = { generatePOMFromDOM };
const { captureDOMSnapshot, createTokenEfficientSummary } = require('../dom-capture/capture-dom');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

/**
 * Generates a JavaScript Page Object Model class using an LLM
 */
async function generatePOMFromDOM(url, outputPath) {
  const { semanticElements, pageInfo } = await captureDOMSnapshot(url);
  const summary = createTokenEfficientSummary(semanticElements);
  const prompt = buildPOMPrompt(summary, pageInfo);
  const generatedCode = await callLLM(prompt);
  fs.writeFileSync(outputPath, generatedCode, 'utf-8');
  return generatedCode;
}

function buildPOMPrompt(elements, pageInfo) {
  // Using plain string concatenation to avoid backtick escaping issues
  return (
    "You are a senior QA automation engineer. Generate a JavaScript Page Object Model class for the following page.\n\n" +
    "Page Title: " + pageInfo.title + "\n" +
    "Page URL: " + pageInfo.url + "\n\n" +
    "Interactive elements found on the page:\n" +
    JSON.stringify(elements, null, 2) + "\n\n" +
    "Requirements:\n" +
    "1. Class name: Use PascalCase based on the page title (e.g., \"LoginPage\")\n" +
    "2. Each element should have a getter method using Playwright's Locator API\n" +
    "3. Method names should be derived from aria-label, role, or semantic context (camelCase)\n" +
    "4. Include methods for common interactions (click, fill, select, etc.)\n" +
    "5. Use Playwright's locator methods: getByRole, getByLabel, getByText, etc.\n" +
    "6. Include a constructor that accepts a Page object\n\n" +
    "Example format:\n" +
    "```javascript\n" +
    "const { Page } = require('@playwright/test');\n\n" +
    "class LoginPage {\n" +
    "  constructor(page) {\n" +
    "    this.page = page;\n" +
    "  }\n\n" +
    "  get usernameInput() {\n" +
    "    return this.page.getByLabel('Username');\n" +
    "  }\n\n" +
    "  get loginButton() {\n" +
    "    return this.page.getByRole('button', { name: 'Login' });\n" +
    "  }\n\n" +
    "  async login(username, password) {\n" +
    "    await this.usernameInput.fill(username);\n" +
    "    await this.passwordInput.fill(password);\n" +
    "    await this.loginButton.click();\n" +
    "  }\n" +
    "}\n\n" +
    "module.exports = { LoginPage };\n" +
    "```\n\n" +
    "Return ONLY the JavaScript code, no explanations. Ensure all methods have proper JSDoc comments."
  );
}

async function callLLM(prompt) {
  const provider = process.env.LLM_PROVIDER || 'openai';
  
  if (provider === 'openai') {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      }),
    });
    const data = await response.json();
    console.log('LLM API response:', JSON.stringify(data, null, 2));
    return data.choices[0].message.content;
  } else if (provider === 'ollama') {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL || 'llama3',
        prompt: prompt,
        stream: false,
      }),
    });
    const data = await response.json();
    return data.response;
  }
  throw new Error('Unsupported LLM provider');
}

// CLI usage: node src/pom-generator/generate-pom.js <url> <outputPath>
if (require.main === module) {
  const url = process.argv[2] || 'http://localhost:3000/login';
  const outputPath = process.argv[3] || './src/tests/pages/LoginPage.js';
  generatePOMFromDOM(url, outputPath)
    .then(() => console.log(`✅ POM generated at ${outputPath}`))
    .catch(err => console.error('❌ Generation failed:', err));
}

module.exports = { generatePOMFromDOM };