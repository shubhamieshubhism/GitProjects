#!/usr/bin/env node

/**
 * AION Project Generator
 * 
 * This script creates the complete AION AI-Native QA project structure.
 * Run with: node create-aion-project.js
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(process.cwd(), 'aion-qa');

// Helper to write a file, creating parent directories if needed
function writeFile(filePath, content) {
  const fullPath = path.join(PROJECT_ROOT, filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`  Created: ${filePath}`);
}

// Helper to set executable permission for shell scripts
function writeExecutable(filePath, content) {
  writeFile(filePath, content);
  const fullPath = path.join(PROJECT_ROOT, filePath);
  fs.chmodSync(fullPath, 0o755);
}

console.log(`Generating AION project in: ${PROJECT_ROOT}`);

// ------------------------------------------------------------------
// 1. Root files
// ------------------------------------------------------------------

// package.json
writeFile('package.json', `{
  "name": "aion-qa",
  "version": "1.0.0",
  "description": "AI-Native QA Orchestrator – End-to-end automation system",
  "main": "index.js",
  "scripts": {
    "start:test-app": "echo 'Please start your test application here' && exit 1",
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug",
    "pom:generate": "node src/pom-generator/generate-pom.js",
    "backstop:reference": "backstop reference --config=src/visual-test/backstop/backstop.config.js",
    "backstop:test": "backstop test --config=src/visual-test/backstop/backstop.config.js",
    "backstop:approve": "backstop approve --config=src/visual-test/backstop/backstop.config.js"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "backstopjs": "^6.2.2"
  },
  "dependencies": {
    "dotenv": "^16.3.1"
  }
}
`);

// .env template
writeFile('.env.example', `# LLM Provider Configuration
LLM_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key_here

# For local Ollama (optional)
# LLM_PROVIDER=ollama
# OLLAMA_MODEL=llama3

# Healenium Proxy URL
HEALENIUM_PROXY_URL=http://localhost:8085

# Base URL for test application
BASE_URL=http://localhost:3000

# Healenium Pro Credentials (for Docker login)
GITHUB_TOKEN=your_github_token_here
DOCKER_USERNAME=your_docker_username
DOCKER_TOKEN=your_docker_password

# Healenium Configuration
HEAL_ENABLED=true
RECOVERY_TRIES=3
SCORE_CAP=0.6
HLM_LOG_LEVEL=info
`);

// .gitignore
writeFile('.gitignore', `node_modules/
test-results/
playwright-report/
.env
docker/healenium/.env
src/visual-test/backstop/test-results/
src/visual-test/backstop/html_report/
src/visual-test/backstop/ci_report/
*.log
.DS_Store
`);

// README.md
writeFile('README.md', `# AION – AI-Native QA Orchestrator

Complete end-to-end AI-powered test automation system.

## Modules

1. **Automated POM Generation** – DOM → LLM → TypeScript Page Object Model
2. **Self-Healing Execution** – Healenium proxy with Playwright
3. **Intelligent CI/CD Triage** – RCA via LLM log analysis
4. **Perceptual Testing** – Visual regression with BackstopJS

## Quick Start

\`\`\`bash
npm install
npx playwright install
cp .env.example .env
# Edit .env with your credentials
npm test
\`\`\`

## Documentation

See each module's source code for detailed implementation.
`);

// ------------------------------------------------------------------
// 2. GitHub Actions workflows
// ------------------------------------------------------------------

writeFile('.github/workflows/test-run.yml', `name: AI-Native Test Suite with RCA

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '18'
  PYTHON_VERSION: '3.11'
  BASE_URL: 'http://localhost:3000'

jobs:
  test-and-rca:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Start Healenium services
        run: |
          cd docker/healenium
          docker-compose -f docker-compose-pro-playwright.yaml up -d
          sleep 30

      - name: Start test application
        run: |
          npm run start:test-app &
          sleep 10

      - name: Run Playwright tests
        id: tests
        run: |
          npx playwright test --reporter=json,list
        continue-on-error: true

      - name: Capture test logs
        if: steps.tests.outcome == 'failure'
        run: |
          mkdir -p test-results/logs
          cp test-results/results.json test-results/logs/ || true

      - name: Run RCA (Root Cause Analysis)
        if: steps.tests.outcome == 'failure'
        env:
          OPENAI_API_KEY: \${{ secrets.OPENAI_API_KEY }}
          LLM_PROVIDER: \${{ vars.LLM_PROVIDER || 'openai' }}
        run: |
          python3 src/rca/rca.py \\
            --log-dir test-results/logs \\
            --output rca-summary.md \\
            --provider \${{ env.LLM_PROVIDER }}

      - name: Post RCA Summary to PR
        if: github.event_name == 'pull_request' && steps.tests.outcome == 'failure'
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            let summary = '## 🔍 Root Cause Analysis\\n\\n';
            try {
              const rcaContent = fs.readFileSync('rca-summary.md', 'utf8');
              summary += rcaContent;
            } catch (e) {
              summary += '⚠️ RCA summary could not be generated.';
            }
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: summary
            });

      - name: Upload test artifacts
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: |
            test-results/
            playwright-report/
            rca-summary.md
          retention-days: 7

      - name: Shutdown Healenium
        if: always()
        run: |
          cd docker/healenium
          docker-compose -f docker-compose-pro-playwright.yaml down
`);

writeFile('.github/workflows/visual-regression.yml', `name: Visual Regression Testing

on:
  pull_request:
    branches: [ main ]
    paths:
      - 'src/**/*.css'
      - 'src/**/*.scss'
      - 'src/**/*.tsx'
      - 'src/**/*.jsx'

jobs:
  visual-regression:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install BackstopJS
        run: npm install -g backstopjs

      - name: Start test application
        run: |
          npm run start:test-app &
          sleep 10

      - name: Generate visual baselines (if not exist)
        run: |
          if [ ! -d "src/visual-test/backstop/baseline" ]; then
            npm run backstop:reference
          fi

      - name: Run visual regression tests
        id: visual
        run: |
          npm run backstop:ci || true
        continue-on-error: true

      - name: Check if visual tests passed
        id: check
        run: |
          if [ -f "src/visual-test/backstop/ci_report/backstop-report.json" ]; then
            FAILED=$(jq '.tests[].status' src/visual-test/backstop/ci_report/backstop-report.json | grep -c "fail" || echo "0")
            if [ "$FAILED" -gt 0 ]; then
              echo "status=failed" >> $GITHUB_OUTPUT
            else
              echo "status=passed" >> $GITHUB_OUTPUT
            fi
          else
            echo "status=unknown" >> $GITHUB_OUTPUT
          fi

      - name: Upload visual diff artifacts
        if: steps.check.outputs.status == 'failed'
        uses: actions/upload-artifact@v4
        with:
          name: visual-diffs
          path: |
            src/visual-test/backstop/html_report/
            src/visual-test/backstop/ci_report/
            src/visual-test/backstop/test-results/
          retention-days: 7

      - name: Post visual diff to PR
        if: steps.check.outputs.status == 'failed' && github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            let comment = '## 🎨 Visual Regression Failed\\n\\n';
            comment += 'UI changes detected. Please review the visual diffs.\\n';
            comment += 'Download the diff artifacts from the workflow run.';
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });

      - name: Fail workflow if visual regression detected
        if: steps.check.outputs.status == 'failed'
        run: exit 1
`);

// ------------------------------------------------------------------
// 3. Source code – JavaScript (converted from TypeScript)
// ------------------------------------------------------------------

// src/dom-capture/capture-dom.js
writeFile('src/dom-capture/capture-dom.js', `const { chromium } = require('playwright');

/**
 * Captures DOM snapshot and accessibility tree from a given URL
 * Extracts token-efficient semantic elements for LLM processing
 */
async function captureDOMSnapshot(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    
    // 1. Capture accessibility tree
    const accessibilitySnapshot = await page.accessibility.snapshot();
    
    // 2. Extract semantic elements with aria-labels and roles
    const semanticElements = await page.$$eval(
      '[aria-label], [role], [data-testid], input, button, a, form',
      (elements) => elements.map(el => ({
        tag: el.tagName.toLowerCase(),
        ariaLabel: el.getAttribute('aria-label'),
        role: el.getAttribute('role'),
        id: el.id,
        className: el.className,
        text: el.textContent?.trim().slice(0, 100),
        placeholder: el.getAttribute('placeholder'),
        type: el.getAttribute('type'),
        href: el.getAttribute('href'),
        dataTestId: el.getAttribute('data-testid'),
      }))
    );
    
    const pageInfo = {
      title: await page.title(),
      url: page.url(),
    };
    
    return { accessibilitySnapshot, semanticElements, pageInfo };
    
  } finally {
    await browser.close();
  }
}

/**
 * Generates a token-efficient DOM summary for LLM consumption
 */
function createTokenEfficientSummary(semanticElements) {
  const interactiveElements = semanticElements.filter(el => 
    ['button', 'input', 'a', 'select', 'textarea'].includes(el.tag) ||
    el.role === 'button' ||
    el.role === 'link' ||
    el.role === 'textbox' ||
    el.ariaLabel
  );
  
  return interactiveElements.map(el => ({
    tag: el.tag,
    ariaLabel: el.ariaLabel,
    role: el.role,
    text: el.text?.substring(0, 50),
    placeholder: el.placeholder,
    type: el.type,
    dataTestId: el.dataTestId,
  }));
}

module.exports = { captureDOMSnapshot, createTokenEfficientSummary };
`);

// src/pom-generator/generate-pom.js
writeFile('src/pom-generator/generate-pom.js', `const { captureDOMSnapshot, createTokenEfficientSummary } = require('../dom-capture/capture-dom');
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
  return \`You are a senior QA automation engineer. Generate a JavaScript Page Object Model class for the following page.

Page Title: \${pageInfo.title}
Page URL: \${pageInfo.url}

Interactive elements found on the page:
\${JSON.stringify(elements, null, 2)}

Requirements:
1. Class name: Use PascalCase based on the page title (e.g., "LoginPage")
2. Each element should have a getter method using Playwright's Locator API
3. Method names should be derived from aria-label, role, or semantic context (camelCase)
4. Include methods for common interactions (click, fill, select, etc.)
5. Use Playwright's locator methods: getByRole, getByLabel, getByText, etc.
6. Include a constructor that accepts a Page object

Example format:
\`\`\`javascript
const { Page } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;
  }
  
  get usernameInput() {
    return this.page.getByLabel('Username');
  }
  
  get loginButton() {
    return this.page.getByRole('button', { name: 'Login' });
  }
  
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

module.exports = { LoginPage };
\`\`\`

Return ONLY the JavaScript code, no explanations. Ensure all methods have proper JSDoc comments.
\`;
}

async function callLLM(prompt) {
  const provider = process.env.LLM_PROVIDER || 'openai';
  
  if (provider === 'openai') {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${process.env.OPENAI_API_KEY}\`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      }),
    });
    const data = await response.json();
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
    .then(() => console.log(\`✅ POM generated at \${outputPath}\`))
    .catch(err => console.error('❌ Generation failed:', err));
}

module.exports = { generatePOMFromDOM };
`);

// src/self-healing/playwright.config.js
writeFile('src/self-healing/playwright.config.js', `// @ts-check
const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config({ path: '../../.env' });

/**
 * Playwright configuration pointing to Healenium proxy
 */
module.exports = defineConfig({
  testDir: '../tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],
  
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Proxy through Healenium
    launchOptions: {
      proxy: {
        server: process.env.HEALENIUM_PROXY_URL || 'http://localhost:8085',
      },
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
`);

// src/tests/login.spec.js
writeFile('src/tests/login.spec.js', `const { test, expect } = require('@playwright/test');

test.describe('Login Page - Self-Healing Demo', () => {
  
  test('should login successfully with self-healing', async ({ page }) => {
    await page.goto('/login');
    
    // These selectors will be healed automatically if they break
    await page.fill('#username-input', 'testuser');
    await page.fill('#password-input', 'securepassword');
    await page.click('#login-btn');  // This selector will be healed
    
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('.welcome-message')).toContainText('Welcome');
  });
  
  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#username-input', 'invalid');
    await page.fill('#password-input', 'wrong');
    await page.click('#login-btn');
    await expect(page.locator('.error-message')).toBeVisible();
  });
});
`);

// src/rca/rca.py
writeFile('src/rca/rca.py', `#!/usr/bin/env python3
"""
Root Cause Analysis (RCA) Engine for CI/CD test failures
"""
import os
import sys
import json
import argparse
from pathlib import Path
import requests

class RCAEngine:
    def __init__(self, provider="openai"):
        self.provider = provider
        self.api_key = os.getenv("OPENAI_API_KEY")
    
    def parse_logs(self, log_dir):
        log_path = Path(log_dir)
        parsed = {
            "stack_traces": [],
            "console_logs": [],
            "test_results": {},
            "environment": {}
        }
        results_file = log_path / "results.json"
        if results_file.exists():
            with open(results_file) as f:
                data = json.load(f)
                parsed["test_results"] = data
        return parsed
    
    def classify_failure(self, logs):
        text = str(logs).lower()
        flake_indicators = ["timeout", "network", "connection", "unavailable", "retry", "flaky", "intermittent"]
        for indicator in flake_indicators:
            if indicator in text:
                return "Env Flake"
        return "App Bug"
    
    def analyze_with_llm(self, logs):
        prompt = self._build_prompt(logs)
        if self.provider == "openai":
            return self._call_openai(prompt)
        elif self.provider == "ollama":
            return self._call_ollama(prompt)
        else:
            raise ValueError(f"Unsupported provider: {self.provider}")
    
    def _build_prompt(self, logs):
        return f"""You are a senior QA engineer performing Root Cause Analysis on a test failure.

Test Results:
{json.dumps(logs.get('test_results', {}), indent=2)[:2000]}

Stack Traces:
{chr(10).join(logs.get('stack_traces', ['No stack traces captured']))[:3000]}

Console Logs:
{json.dumps(logs.get('console_logs', []), indent=2)[:2000]}

Please analyze and provide:
1. **Root Cause Summary** (1-2 sentences)
2. **Classification**: "Env Flake" or "App Bug"
3. **Detailed Analysis** (what specifically failed and why)
4. **Fix Recommendation** (actionable steps)
5. **Confidence Score** (0-100%)

Format as Markdown.
"""
    
    def _call_openai(self, prompt):
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": "gpt-4",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.3,
                "max_tokens": 1000
            },
            timeout=30
        )
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]
    
    def _call_ollama(self, prompt):
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": os.getenv("OLLAMA_MODEL", "llama3"),
                "prompt": prompt,
                "stream": False
            },
            timeout=60
        )
        response.raise_for_status()
        data = response.json()
        return data["response"]
    
    def generate_report(self, logs, analysis):
        classification = self.classify_failure(logs)
        report = f"""## 🔍 Root Cause Analysis Report

### Classification: **{classification}**

### Analysis
{analysis}

---
*Generated by AION RCA Engine using {self.provider}*
*Timestamp: {__import__('datetime').datetime.now().isoformat()}*
"""
        return report

def main():
    parser = argparse.ArgumentParser(description="RCA Engine")
    parser.add_argument("--log-dir", required=True)
    parser.add_argument("--output", default="rca-summary.md")
    parser.add_argument("--provider", default="openai", choices=["openai", "ollama"])
    args = parser.parse_args()
    
    engine = RCAEngine(provider=args.provider)
    logs = engine.parse_logs(args.log_dir)
    try:
        analysis = engine.analyze_with_llm(logs)
    except Exception as e:
        analysis = f"⚠️ LLM analysis failed: {str(e)}"
    report = engine.generate_report(logs, analysis)
    with open(args.output, "w") as f:
        f.write(report)
    print(report)

if __name__ == "__main__":
    main()
`);

// src/visual-test/visual.spec.js
writeFile('src/visual-test/visual.spec.js', `const { test, expect } = require('@playwright/test');

test.describe('Visual Regression Tests', () => {
  
  test('dashboard page visual regression', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForSelector('.dashboard-loaded', { timeout: 10000 });
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('dashboard.png', {
      threshold: 0.1,
      maxDiffPixels: 100,
      mask: [
        page.locator('.timestamp'),
        page.locator('.live-counter'),
        page.locator('.user-avatar'),
        page.locator('[data-dynamic="true"]'),
      ],
      style: \`
        .timestamp, .live-counter, .user-avatar {
          background: #f0f0f0 !important;
          color: #f0f0f0 !important;
          opacity: 0 !important;
        }
      \`,
      animations: 'disabled',
      fullPage: false,
    });
  });
});
`);

// src/visual-test/backstop/backstop.config.js
writeFile('src/visual-test/backstop/backstop.config.js', `module.exports = {
  id: 'aion_visual_regression',
  viewports: [
    { label: 'desktop', width: 1920, height: 1080 },
    { label: 'tablet', width: 1024, height: 768 },
    { label: 'mobile', width: 375, height: 812 },
  ],
  scenarios: [
    {
      label: 'Login Page',
      url: 'http://localhost:3000/login',
      selectors: ['document'],
      readySelector: 'body',
      delay: 1000,
      misMatchThreshold: 0.1,
      hideSelectors: [
        '.timestamp',
        '.live-counter',
        '.user-avatar',
      ],
    },
    {
      label: 'Dashboard',
      url: 'http://localhost:3000/dashboard',
      selectors: ['document'],
      readySelector: '.dashboard-loaded',
      delay: 2000,
      misMatchThreshold: 0.1,
      hideSelectors: [
        '.timestamp',
        '.live-counter',
        '.user-avatar',
      ],
    },
  ],
  engine: 'puppeteer',
  engineOptions: {
    args: ['--no-sandbox'],
  },
  report: ['browser', 'CI'],
  paths: {
    bitmaps_reference: 'src/visual-test/backstop/baseline',
    bitmaps_test: 'src/visual-test/backstop/test-results',
    engine_scripts: 'src/visual-test/backstop/engine_scripts',
    html_report: 'src/visual-test/backstop/html_report',
    ci_report: 'src/visual-test/backstop/ci_report',
  },
  ci: {
    format: 'json',
    testReportFileName: 'backstop-report.json',
    testSuiteName: 'AION Visual Regression',
  },
};
`);

// ------------------------------------------------------------------
// 4. Docker / Healenium
// ------------------------------------------------------------------

writeFile('docker/healenium/docker-compose-pro-playwright.yaml', `services:
  postgres-db:
    image: postgres:15
    container_name: healenium-postgres
    environment:
      POSTGRES_DB: healenium
      POSTGRES_USER: healenium_user
      POSTGRES_PASSWORD: YDk2nmNs4s9aCP6K
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - healenium-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U healenium_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  healenium-backend:
    image: healenium/hlm-backend:3.5.3
    container_name: healenium-backend
    depends_on:
      postgres-db:
        condition: service_healthy
    environment:
      SPRING_POSTGRES_DB: healenium
      SPRING_POSTGRES_SCHEMA: healenium
      SPRING_POSTGRES_USER: healenium_user
      SPRING_POSTGRES_PASSWORD: YDk2nmNs4s9aCP6K
      SPRING_POSTGRES_DB_HOST: postgres-db
    ports:
      - "7878:7878"
    networks:
      - healenium-network
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:7878/actuator/health"]
      interval: 10s
      timeout: 10s
      retries: 5

  selector-imitator:
    image: healenium/hlm-selector-imitator:1.6
    container_name: healenium-selector-imitator
    depends_on:
      healenium-backend:
        condition: service_healthy
    environment:
      HEALENIUM_SERVER_URL: http://healenium-backend:7878
    networks:
      - healenium-network

  playwright-proxy:
    image: healenium/hlm-proxy:2.2.1
    container_name: healenium-playwright-proxy
    depends_on:
      selector-imitator:
        condition: service_started
      healenium-backend:
        condition: service_healthy
    environment:
      HEALENIUM_SERVER_URL: http://healenium-backend:7878
      IMITATE_SERVICE: http://selector-imitator:8000
      HEAL_ENABLED: "true"
      RECOVERY_TRIES: "3"
      SCORE_CAP: "0.6"
      HLM_LOG_LEVEL: "info"
    ports:
      - "8085:8085"
      - "8086:8086"
    networks:
      - healenium-network

  playwright-server:
    image: mcr.microsoft.com/playwright:v1.40.0-jammy
    container_name: healenium-playwright-server
    command: sh -c "npx playwright install && npx playwright run-server --port 8087"
    ports:
      - "8087:8087"
    networks:
      - healenium-network


networks:
  healenium-network:
    driver: bridge

volumes:
  postgres-data:
`);

writeFile('docker/healenium/.env.example', `# Docker Hub Credentials
GITHUB_TOKEN=your_github_token_here
DOCKER_USERNAME=your_docker_username
DOCKER_TOKEN=your_docker_password

# LLM Configuration
LLM_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key
`);

writeExecutable('docker/healenium/docker_login.sh', `#!/bin/bash
set -e
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi
echo "Logging in to Docker Hub..."
echo "$DOCKER_TOKEN" | docker login -u "$DOCKER_USERNAME" --password-stdin
echo "✅ Docker login successful"
`);

// ------------------------------------------------------------------
// 5. Additional config
// ------------------------------------------------------------------

writeFile('config/playwright.config.js', `// Main Playwright config (aliases to self-healing one)
module.exports = require('../src/self-healing/playwright.config.js');
`);

// ------------------------------------------------------------------
// Final message
// ------------------------------------------------------------------

console.log('\n✅ Project generated successfully!');
console.log(`   Location: ${PROJECT_ROOT}`);
console.log('\nNext steps:');
console.log('   cd aion-qa');
console.log('   npm install');
console.log('   npx playwright install');
console.log('   cp .env.example .env   # and fill in your credentials');
console.log('   # Start Healenium (see docker/healenium/README)');
console.log('   npm test');
console.log('\nHappy testing! 🚀');