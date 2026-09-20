#!/usr/bin/env node
'use strict';

/* =========================================================================
   create-country-quiz.js
   Generates a complete "Country Quiz" project (dark mode, flags,
   confetti animations) into ./country-quiz
   Run:  node create-country-quiz.js
   ========================================================================= */

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(process.cwd(), 'country-quiz');

/* ------------------------------------------------------------------ */
/* 1. index.html                                                       */
/* ------------------------------------------------------------------ */
const INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#0b1120" />
  <title>Country Quiz - Capitals and Currencies</title>

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>

  <div class="app">
    <header class="brand">
      <div class="brand-badge" aria-hidden="true">🌍</div>
      <div class="brand-text">
        Country Quiz
        <span>Capitals &amp; Currencies</span>
      </div>
    </header>

    <main>

      <!-- ============ SCREEN 1: MODE SELECT ============ -->
      <section id="screen-start" class="screen is-active" aria-label="Mode selection">
        <div class="card hero-card">
          <p class="eyebrow">Geography Quiz</p>
          <h1 class="hero-title">How well do you know the world?</h1>
          <p class="hero-sub">
            10 questions, 4 options each, a flag for every country.
            Pick a mode to begin.
          </p>

          <div class="mode-grid">
            <button id="btn-mode-capital" class="mode-btn" type="button">
              <span class="mode-icon" aria-hidden="true">🏛️</span>
              <span class="mode-name">Capital Quiz</span>
              <span class="mode-desc">Guess the capital city of each country</span>
            </button>

            <button id="btn-mode-currency" class="mode-btn" type="button">
              <span class="mode-icon" aria-hidden="true">💰</span>
              <span class="mode-name">Currency Quiz</span>
              <span class="mode-desc">Guess the currency used in each country</span>
            </button>
          </div>

          <p class="hint">Tip: press <kbd>1</kbd>-<kbd>4</kbd> to answer, <kbd>Enter</kbd> for the next question.</p>
        </div>
      </section>

      <!-- ============ SCREEN 2: QUIZ ============ -->
      <section id="screen-quiz" class="screen" aria-label="Quiz">

        <div class="hud">
          <div class="hud-item">
            <span class="hud-label">Score</span>
            <span id="hud-score" class="hud-value">0 / 10</span>
          </div>
          <div class="hud-item">
            <span class="hud-label">Question</span>
            <span id="hud-progress" class="hud-value">1 of 10</span>
          </div>
          <div class="hud-item">
            <span class="hud-label">Mode</span>
            <span id="hud-mode" class="hud-value">Capitals</span>
          </div>
        </div>

        <div class="progress-track" role="presentation">
          <div id="progress-bar" class="progress-bar"></div>
        </div>

        <div id="question-card" class="card question-card">

          <div class="flag-wrap">
            <img id="flag-img" class="flag" src="" alt="" />
            <div id="flag-fallback" class="flag-fallback" hidden></div>
          </div>

          <p id="question-text" class="question-text"></p>

          <div id="options" class="options" role="group" aria-label="Answer options"></div>

          <p id="feedback" class="feedback" aria-live="polite"></p>

          <div class="actions">
            <button id="btn-next" class="btn btn-primary" type="button">Next Question</button>
          </div>
        </div>
      </section>

      <!-- ============ SCREEN 3: RESULTS ============ -->
      <section id="screen-results" class="screen" aria-label="Results">
        <div class="card results-card">
          <div id="results-emoji" class="results-emoji" aria-hidden="true">🎉</div>
          <h2 id="results-title" class="results-title">Nice work!</h2>
          <p id="results-score" class="results-score">0 / 10</p>
          <p id="results-message" class="results-message"></p>

          <div class="actions actions-row">
            <button id="btn-again" class="btn btn-primary" type="button">Play Again</button>
            <button id="btn-change-mode" class="btn btn-ghost" type="button">Change Mode</button>
          </div>
        </div>
      </section>

    </main>
  </div>

  <div id="fx-layer" class="fx-layer" aria-hidden="true"></div>

  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>
  <script src="data.js"></script>
  <script src="app.js"></script>
</body>
</html>
`;

/* ------------------------------------------------------------------ */
/* 2. styles.css                                                       */
/* ------------------------------------------------------------------ */
const STYLES_CSS = `/* ==========================================================================
   Country Quiz - dark theme
   ========================================================================== */

:root {
  --bg:          #0b1120;
  --bg-2:        #0f172a;
  --surface:     #1e293b;
  --surface-2:   #273449;
  --border:      #334155;
  --text:        #e2e8f0;
  --muted:       #94a3b8;
  --accent:      #6366f1;
  --accent-2:    #a855f7;
  --accent-3:    #22d3ee;
  --correct:     #22c55e;
  --correct-dim: rgba(34, 197, 94, 0.18);
  --wrong:       #ef4444;
  --wrong-dim:   rgba(239, 68, 68, 0.18);
  --radius:      18px;
  --radius-sm:   12px;
  --shadow:      0 18px 45px rgba(0, 0, 0, 0.45);
}

* { box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  margin: 0;
  min-height: 100vh;
  color: var(--text);
  font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
  background-color: var(--bg);
  background-image:
    radial-gradient(900px 520px at 10% -12%, rgba(99, 102, 241, 0.30), transparent 62%),
    radial-gradient(820px 520px at 95% -4%, rgba(168, 85, 247, 0.22), transparent 58%),
    radial-gradient(760px 620px at 50% 118%, rgba(34, 211, 238, 0.15), transparent 62%);
  background-attachment: fixed;
}

kbd {
  display: inline-block;
  padding: 1px 6px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--bg-2);
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text);
}

/* ---------- Layout ---------- */

.app {
  width: 100%;
  max-width: 840px;
  margin: 0 auto;
  padding: 26px 18px 64px;
}

.brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 26px;
}

.brand-badge {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  font-size: 23px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  box-shadow: 0 12px 28px rgba(99, 102, 241, 0.45);
}

.brand-text {
  font-weight: 800;
  font-size: 1.08rem;
  letter-spacing: 0.2px;
}

.brand-text span {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
}

/* ---------- Screens ---------- */

.screen { display: none; }

.screen.is-active {
  display: block;
  animation: fadeUp 0.45s cubic-bezier(0.22, 0.8, 0.24, 1) both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ---------- Cards ---------- */

.card {
  position: relative;
  background: linear-gradient(180deg, rgba(30, 41, 59, 0.96), rgba(23, 33, 50, 0.96));
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 26px;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 2px;
  background: linear-gradient(90deg, var(--accent), var(--accent-2), var(--accent-3));
  opacity: 0.9;
}

/* ---------- Hero / start screen ---------- */

.hero-card { text-align: center; padding: 34px 26px 30px; }

.eyebrow {
  margin: 0 0 10px;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent-3);
}

.hero-title {
  margin: 0 0 12px;
  font-size: clamp(1.6rem, 4.4vw, 2.15rem);
  font-weight: 800;
  line-height: 1.2;
  background: linear-gradient(120deg, #ffffff, #c7d2fe 45%, #a5f3fc);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-sub {
  margin: 0 auto 26px;
  max-width: 46ch;
  color: var(--muted);
  font-size: 0.96rem;
}

.mode-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 22px;
}

.mode-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 26px 16px;
  cursor: pointer;
  color: var(--text);
  font-family: inherit;
  text-align: center;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: linear-gradient(180deg, var(--surface), var(--surface-2));
  transition: transform 0.22s cubic-bezier(0.22, 0.8, 0.24, 1),
              border-color 0.22s ease,
              box-shadow 0.22s ease,
              background 0.22s ease;
}

.mode-btn:hover,
.mode-btn:focus-visible {
  transform: translateY(-5px) scale(1.015);
  border-color: rgba(129, 140, 248, 0.75);
  box-shadow: 0 20px 42px rgba(99, 102, 241, 0.30);
  background: linear-gradient(180deg, #2a3a55, #223047);
  outline: none;
}

.mode-btn:active { transform: translateY(-2px) scale(0.99); }

.mode-icon { font-size: 2rem; line-height: 1; }

.mode-name { font-size: 1.08rem; font-weight: 700; }

.mode-desc {
  font-size: 0.82rem;
  color: var(--muted);
  max-width: 22ch;
}

.hint {
  margin: 0;
  font-size: 0.82rem;
  color: var(--muted);
}

/* ---------- HUD ---------- */

.hud {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 14px;
}

.hud-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px 14px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: rgba(30, 41, 59, 0.72);
  backdrop-filter: blur(6px);
}

.hud-label {
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
}

.hud-value {
  font-size: 1rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.progress-track {
  height: 8px;
  border-radius: 999px;
  background: rgba(51, 65, 85, 0.75);
  overflow: hidden;
  margin-bottom: 20px;
}

.progress-bar {
  height: 100%;
  width: 0%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--accent), var(--accent-2), var(--accent-3));
  transition: width 0.45s cubic-bezier(0.22, 0.8, 0.24, 1);
}

/* ---------- Question card ---------- */

.question-card { padding: 26px 26px 22px; }

.question-card.flash-correct {
  animation: flashCorrect 0.85s ease-out;
}

.question-card.flash-wrong {
  animation: flashWrong 0.6s ease-out;
}

@keyframes flashCorrect {
  0%   { box-shadow: var(--shadow), 0 0 0 0 rgba(34, 197, 94, 0.55); border-color: var(--correct); }
  60%  { box-shadow: var(--shadow), 0 0 0 16px rgba(34, 197, 94, 0.0); border-color: var(--correct); }
  100% { box-shadow: var(--shadow), 0 0 0 0 rgba(34, 197, 94, 0.0); }
}

@keyframes flashWrong {
  0%   { box-shadow: var(--shadow), 0 0 0 0 rgba(239, 68, 68, 0.55); border-color: var(--wrong); }
  60%  { box-shadow: var(--shadow), 0 0 0 14px rgba(239, 68, 68, 0.0); border-color: var(--wrong); }
  100% { box-shadow: var(--shadow), 0 0 0 0 rgba(239, 68, 68, 0.0); }
}

/* ---------- Flag ---------- */

.flag-wrap {
  display: grid;
  place-items: center;
  margin-bottom: 20px;
}

.flag {
  display: block;
  width: auto;
  max-width: 240px;
  max-height: 150px;
  border-radius: 12px;
  border: 1px solid var(--border);
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.5);
  background: var(--bg-2);
  animation: flagIn 0.5s cubic-bezier(0.22, 0.8, 0.24, 1) both;
}

@keyframes flagIn {
  from { opacity: 0; transform: scale(0.9) translateY(10px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

.flag-fallback {
  display: grid;
  place-items: center;
  width: 200px;
  height: 120px;
  border-radius: 12px;
  border: 1px dashed var(--border);
  background: var(--bg-2);
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  color: var(--muted);
}

/* ---------- Question text ---------- */

.question-text {
  margin: 0 0 20px;
  text-align: center;
  font-size: clamp(1.08rem, 2.8vw, 1.32rem);
  font-weight: 700;
  line-height: 1.4;
}

.question-text strong {
  background: linear-gradient(120deg, #a5b4fc, #a5f3fc);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* ---------- Options ---------- */

.options {
  display: grid;
  gap: 11px;
  margin-bottom: 16px;
}

.option {
  display: flex;
  align-items: center;
  gap: 13px;
  width: 100%;
  padding: 14px 16px;
  cursor: pointer;
  text-align: left;
  color: var(--text);
  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: linear-gradient(180deg, var(--surface), rgba(30, 41, 59, 0.7));
  transition: transform 0.18s ease, border-color 0.18s ease,
              background 0.18s ease, box-shadow 0.18s ease, opacity 0.25s ease;
}

.option:hover:not(:disabled),
.option:focus-visible:not(:disabled) {
  transform: translateX(5px);
  border-color: rgba(129, 140, 248, 0.8);
  background: linear-gradient(180deg, #2b3c58, #24334b);
  box-shadow: 0 12px 26px rgba(99, 102, 241, 0.22);
  outline: none;
}

.option:disabled { cursor: default; }

.option-key {
  flex: 0 0 auto;
  width: 26px;
  height: 26px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: rgba(15, 23, 42, 0.75);
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--muted);
}

.option-label { flex: 1 1 auto; }

.option.is-correct {
  border-color: var(--correct);
  background: linear-gradient(180deg, rgba(34, 197, 94, 0.22), rgba(34, 197, 94, 0.08));
  box-shadow: 0 0 0 1px rgba(34, 197, 94, 0.4), 0 14px 30px rgba(34, 197, 94, 0.22);
}

.option.is-correct .option-key {
  border-color: var(--correct);
  background: var(--correct);
  color: #04240f;
}

.option.is-wrong {
  border-color: var(--wrong);
  background: linear-gradient(180deg, rgba(239, 68, 68, 0.22), rgba(239, 68, 68, 0.08));
  box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.4), 0 14px 30px rgba(239, 68, 68, 0.2);
}

.option.is-wrong .option-key {
  border-color: var(--wrong);
  background: var(--wrong);
  color: #2a0505;
}

.option.is-dim { opacity: 0.42; }

.option.pop { animation: pop 0.5s cubic-bezier(0.22, 0.8, 0.24, 1); }

@keyframes pop {
  0%   { transform: scale(1); }
  35%  { transform: scale(1.06); }
  60%  { transform: scale(0.985); }
  100% { transform: scale(1); }
}

.option.shake { animation: shake 0.45s cubic-bezier(0.36, 0.07, 0.19, 0.97); }

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  15%      { transform: translateX(-9px); }
  30%      { transform: translateX(8px); }
  45%      { transform: translateX(-6px); }
  60%      { transform: translateX(5px); }
  80%      { transform: translateX(-2px); }
}

/* ---------- Feedback ---------- */

.feedback {
  min-height: 24px;
  margin: 0 0 4px;
  text-align: center;
  font-size: 0.92rem;
  font-weight: 700;
}

.feedback.is-correct { color: var(--correct); }
.feedback.is-wrong   { color: var(--wrong); }

/* ---------- Buttons ---------- */

.actions { display: flex; justify-content: center; }

.actions-row { flex-wrap: wrap; gap: 12px; }

.btn {
  padding: 13px 26px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.98rem;
  font-weight: 700;
  color: #ffffff;
  border: 1px solid transparent;
  border-radius: 999px;
  transition: transform 0.18s ease, box-shadow 0.18s ease,
              background 0.18s ease, border-color 0.18s ease;
}

.btn-primary {
  background: linear-gradient(120deg, var(--accent), var(--accent-2));
  box-shadow: 0 14px 32px rgba(99, 102, 241, 0.42);
}

.btn-primary:hover,
.btn-primary:focus-visible {
  transform: translateY(-3px);
  box-shadow: 0 20px 42px rgba(99, 102, 241, 0.55);
  outline: none;
}

.btn-primary:active { transform: translateY(0) scale(0.98); }

.btn-ghost {
  background: transparent;
  border-color: var(--border);
  color: var(--text);
}

.btn-ghost:hover,
.btn-ghost:focus-visible {
  transform: translateY(-3px);
  border-color: rgba(129, 140, 248, 0.8);
  background: rgba(99, 102, 241, 0.14);
  outline: none;
}

/* ---------- Results ---------- */

.results-card { text-align: center; padding: 38px 26px 32px; }

.results-emoji {
  font-size: 3.4rem;
  line-height: 1;
  margin-bottom: 10px;
  animation: pop 0.65s cubic-bezier(0.22, 0.8, 0.24, 1);
}

.results-title {
  margin: 0 0 6px;
  font-size: clamp(1.5rem, 4vw, 1.95rem);
  font-weight: 800;
}

.results-score {
  margin: 0 0 10px;
  font-size: 2.4rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  background: linear-gradient(120deg, #a5b4fc, #a5f3fc);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.results-message {
  margin: 0 auto 26px;
  max-width: 44ch;
  color: var(--muted);
}

/* ---------- Floating feedback labels ---------- */

.fx-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
}

.float-label {
  position: absolute;
  transform: translate(-50%, -50%);
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 800;
  white-space: nowrap;
  color: #ffffff;
  background: linear-gradient(120deg, var(--accent), var(--accent-2));
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.45);
  animation: floatUp 1.05s cubic-bezier(0.22, 0.8, 0.24, 1) forwards;
}

.float-label.wrong {
  background: linear-gradient(120deg, #ef4444, #f97316);
}

@keyframes floatUp {
  0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.7); }
  22%  { opacity: 1; transform: translate(-50%, -85%) scale(1.08); }
  60%  { opacity: 1; transform: translate(-50%, -130%) scale(1); }
  100% { opacity: 0; transform: translate(-50%, -190%) scale(0.94); }
}

/* ---------- Responsive ---------- */

@media (max-width: 620px) {
  .app { padding: 18px 13px 48px; }
  .card { padding: 20px 17px; }
  .hero-card { padding: 26px 17px 24px; }
  .mode-grid { grid-template-columns: 1fr; }
  .hud { grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .hud-item { padding: 9px 10px; }
  .hud-value { font-size: 0.9rem; }
  .flag { max-width: 190px; }
  .option { font-size: 0.94rem; padding: 12px 13px; }
  .btn { width: 100%; }
  .actions-row { flex-direction: column; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
`;

/* ------------------------------------------------------------------ */
/* 3. data.js                                                          */
/* ------------------------------------------------------------------ */
const DATA_JS = `/* ==========================================================================
   Country Quiz - dataset
   74 countries with ISO alpha-2 code, capital city and currency.
   Exposed as a global so app.js can read it without a build step.
   ========================================================================== */

var COUNTRIES = [
  { name: 'Japan',                     code: 'jp', capital: 'Tokyo',          currency: 'Japanese yen' },
  { name: 'France',                    code: 'fr', capital: 'Paris',          currency: 'Euro' },
  { name: 'Germany',                   code: 'de', capital: 'Berlin',         currency: 'Euro' },
  { name: 'Italy',                     code: 'it', capital: 'Rome',           currency: 'Euro' },
  { name: 'Spain',                     code: 'es', capital: 'Madrid',         currency: 'Euro' },
  { name: 'Portugal',                  code: 'pt', capital: 'Lisbon',         currency: 'Euro' },
  { name: 'United Kingdom',            code: 'gb', capital: 'London',         currency: 'Pound sterling' },
  { name: 'Ireland',                   code: 'ie', capital: 'Dublin',         currency: 'Euro' },
  { name: 'Netherlands',               code: 'nl', capital: 'Amsterdam',      currency: 'Euro' },
  { name: 'Belgium',                   code: 'be', capital: 'Brussels',       currency: 'Euro' },
  { name: 'Switzerland',               code: 'ch', capital: 'Bern',           currency: 'Swiss franc' },
  { name: 'Austria',                   code: 'at', capital: 'Vienna',         currency: 'Euro' },
  { name: 'Sweden',                    code: 'se', capital: 'Stockholm',      currency: 'Swedish krona' },
  { name: 'Norway',                    code: 'no', capital: 'Oslo',           currency: 'Norwegian krone' },
  { name: 'Denmark',                   code: 'dk', capital: 'Copenhagen',     currency: 'Danish krone' },
  { name: 'Finland',                   code: 'fi', capital: 'Helsinki',       currency: 'Euro' },
  { name: 'Poland',                    code: 'pl', capital: 'Warsaw',         currency: 'Polish zloty' },
  { name: 'Czech Republic',            code: 'cz', capital: 'Prague',         currency: 'Czech koruna' },
  { name: 'Hungary',                   code: 'hu', capital: 'Budapest',       currency: 'Hungarian forint' },
  { name: 'Greece',                    code: 'gr', capital: 'Athens',         currency: 'Euro' },
  { name: 'Turkey',                    code: 'tr', capital: 'Ankara',         currency: 'Turkish lira' },
  { name: 'Russia',                    code: 'ru', capital: 'Moscow',         currency: 'Russian ruble' },
  { name: 'Ukraine',                   code: 'ua', capital: 'Kyiv',           currency: 'Ukrainian hryvnia' },
  { name: 'Iceland',                   code: 'is', capital: 'Reykjavik',      currency: 'Icelandic krona' },
  { name: 'Croatia',                   code: 'hr', capital: 'Zagreb',         currency: 'Euro' },
  { name: 'Romania',                   code: 'ro', capital: 'Bucharest',      currency: 'Romanian leu' },
  { name: 'Bulgaria',                  code: 'bg', capital: 'Sofia',          currency: 'Bulgarian lev' },
  { name: 'Serbia',                    code: 'rs', capital: 'Belgrade',       currency: 'Serbian dinar' },
  { name: 'Slovakia',                  code: 'sk', capital: 'Bratislava',     currency: 'Euro' },
  { name: 'Slovenia',                  code: 'si', capital: 'Ljubljana',      currency: 'Euro' },

  { name: 'United States',             code: 'us', capital: 'Washington, D.C.', currency: 'US dollar' },
  { name: 'Canada',                    code: 'ca', capital: 'Ottawa',         currency: 'Canadian dollar' },
  { name: 'Mexico',                    code: 'mx', capital: 'Mexico City',    currency: 'Mexican peso' },
  { name: 'Cuba',                      code: 'cu', capital: 'Havana',         currency: 'Cuban peso' },
  { name: 'Jamaica',                   code: 'jm', capital: 'Kingston',       currency: 'Jamaican dollar' },

  { name: 'Brazil',                    code: 'br', capital: 'Brasilia',       currency: 'Brazilian real' },
  { name: 'Argentina',                 code: 'ar', capital: 'Buenos Aires',   currency: 'Argentine peso' },
  { name: 'Chile',                     code: 'cl', capital: 'Santiago',       currency: 'Chilean peso' },
  { name: 'Peru',                      code: 'pe', capital: 'Lima',           currency: 'Peruvian sol' },
  { name: 'Colombia',                  code: 'co', capital: 'Bogota',         currency: 'Colombian peso' },
  { name: 'Venezuela',                 code: 've', capital: 'Caracas',        currency: 'Venezuelan bolivar' },
  { name: 'Ecuador',                   code: 'ec', capital: 'Quito',          currency: 'US dollar' },

  { name: 'China',                     code: 'cn', capital: 'Beijing',        currency: 'Chinese yuan' },
  { name: 'India',                     code: 'in', capital: 'New Delhi',      currency: 'Indian rupee' },
  { name: 'Pakistan',                  code: 'pk', capital: 'Islamabad',      currency: 'Pakistani rupee' },
  { name: 'Bangladesh',                code: 'bd', capital: 'Dhaka',          currency: 'Bangladeshi taka' },
  { name: 'Sri Lanka',                 code: 'lk', capital: 'Colombo',        currency: 'Sri Lankan rupee' },
  { name: 'Nepal',                     code: 'np', capital: 'Kathmandu',      currency: 'Nepalese rupee' },
  { name: 'Thailand',                  code: 'th', capital: 'Bangkok',        currency: 'Thai baht' },
  { name: 'Vietnam',                   code: 'vn', capital: 'Hanoi',          currency: 'Vietnamese dong' },
  { name: 'Malaysia',                  code: 'my', capital: 'Kuala Lumpur',   currency: 'Malaysian ringgit' },
  { name: 'Singapore',                 code: 'sg', capital: 'Singapore',      currency: 'Singapore dollar' },
  { name: 'Indonesia',                 code: 'id', capital: 'Jakarta',        currency: 'Indonesian rupiah' },
  { name: 'Philippines',               code: 'ph', capital: 'Manila',         currency: 'Philippine peso' },
  { name: 'South Korea',               code: 'kr', capital: 'Seoul',          currency: 'South Korean won' },
  { name: 'North Korea',               code: 'kp', capital: 'Pyongyang',      currency: 'North Korean won' },
  { name: 'Mongolia',                  code: 'mn', capital: 'Ulaanbaatar',    currency: 'Mongolian tugrik' },
  { name: 'Kazakhstan',                code: 'kz', capital: 'Astana',         currency: 'Kazakhstani tenge' },

  { name: 'Saudi Arabia',              code: 'sa', capital: 'Riyadh',         currency: 'Saudi riyal' },
  { name: 'United Arab Emirates',      code: 'ae', capital: 'Abu Dhabi',      currency: 'UAE dirham' },
  { name: 'Qatar',                     code: 'qa', capital: 'Doha',           currency: 'Qatari riyal' },
  { name: 'Israel',                    code: 'il', capital: 'Jerusalem',      currency: 'Israeli new shekel' },
  { name: 'Iran',                      code: 'ir', capital: 'Tehran',         currency: 'Iranian rial' },
  { name: 'Iraq',                      code: 'iq', capital: 'Baghdad',        currency: 'Iraqi dinar' },

  { name: 'Egypt',                     code: 'eg', capital: 'Cairo',          currency: 'Egyptian pound' },
  { name: 'Morocco',                   code: 'ma', capital: 'Rabat',          currency: 'Moroccan dirham' },
  { name: 'Nigeria',                   code: 'ng', capital: 'Abuja',          currency: 'Nigerian naira' },
  { name: 'Kenya',                     code: 'ke', capital: 'Nairobi',        currency: 'Kenyan shilling' },
  { name: 'Ethiopia',                  code: 'et', capital: 'Addis Ababa',    currency: 'Ethiopian birr' },
  { name: 'Ghana',                     code: 'gh', capital: 'Accra',          currency: 'Ghanaian cedi' },
  { name: 'South Africa',              code: 'za', capital: 'Pretoria',       currency: 'South African rand' },

  { name: 'Australia',                 code: 'au', capital: 'Canberra',       currency: 'Australian dollar' },
  { name: 'New Zealand',               code: 'nz', capital: 'Wellington',     currency: 'New Zealand dollar' },
  { name: 'Fiji',                      code: 'fj', capital: 'Suva',           currency: 'Fijian dollar' }
];
`;

/* ------------------------------------------------------------------ */
/* 4. app.js                                                           */
/* ------------------------------------------------------------------ */
const APP_JS = `/* ==========================================================================
   Country Quiz - game logic
   Vanilla JS, no frameworks, no build step.
   ========================================================================== */

(function () {
  'use strict';

  var QUESTIONS_PER_ROUND = 10;
  var OPTION_COUNT = 4;

  /* ---------- State ---------- */

  var state = {
    mode: null,          // 'capital' | 'currency'
    pool: [],            // the 10 countries for this round
    index: 0,            // current question index
    score: 0,
    answered: false,
    current: null,
    correctAnswer: '',
    options: []
  };

  /* ---------- DOM references ---------- */

  var el = {};

  function cacheDom() {
    el.screens = {
      start: document.getElementById('screen-start'),
      quiz: document.getElementById('screen-quiz'),
      results: document.getElementById('screen-results')
    };
    el.hudScore = document.getElementById('hud-score');
    el.hudProgress = document.getElementById('hud-progress');
    el.hudMode = document.getElementById('hud-mode');
    el.progressBar = document.getElementById('progress-bar');
    el.card = document.getElementById('question-card');
    el.flag = document.getElementById('flag-img');
    el.flagFallback = document.getElementById('flag-fallback');
    el.questionText = document.getElementById('question-text');
    el.options = document.getElementById('options');
    el.feedback = document.getElementById('feedback');
    el.btnNext = document.getElementById('btn-next');
    el.btnAgain = document.getElementById('btn-again');
    el.btnChangeMode = document.getElementById('btn-change-mode');
    el.resultsEmoji = document.getElementById('results-emoji');
    el.resultsTitle = document.getElementById('results-title');
    el.resultsScore = document.getElementById('results-score');
    el.resultsMessage = document.getElementById('results-message');
    el.fx = document.getElementById('fx-layer');
  }

  /* ---------- Helpers ---------- */

  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  function fieldFor(mode) {
    return mode === 'capital' ? 'capital' : 'currency';
  }

  function modeLabel(mode) {
    return mode === 'capital' ? 'Capitals' : 'Currencies';
  }

  function showScreen(name) {
    Object.keys(el.screens).forEach(function (key) {
      el.screens[key].classList.toggle('is-active', key === name);
    });
    window.scrollTo(0, 0);
  }

  /* ---------- Game flow ---------- */

  function startGame(mode) {
    state.mode = mode || 'capital';
    state.pool = shuffle(COUNTRIES).slice(0, QUESTIONS_PER_ROUND);
    state.index = 0;
    state.score = 0;
    state.answered = false;
    showScreen('quiz');
    renderQuestion();
  }

  function buildOptions(country, mode) {
    var field = fieldFor(mode);
    var correct = country[field];
    var seen = {};
    seen[String(correct).toLowerCase()] = true;

    var distractors = [];
    var candidates = shuffle(COUNTRIES);

    for (var i = 0; i < candidates.length && distractors.length < OPTION_COUNT - 1; i++) {
      var c = candidates[i];
      if (c.code === country.code) continue;
      var value = c[field];
      if (!value) continue;
      var key = String(value).toLowerCase();
      if (seen[key]) continue;
      seen[key] = true;
      distractors.push(value);
    }

    return shuffle([correct].concat(distractors));
  }

  function renderQuestion() {
    state.answered = false;
    state.current = state.pool[state.index];

    var country = state.current;
    var field = fieldFor(state.mode);
    state.correctAnswer = country[field];
    state.options = buildOptions(country, state.mode);

    /* HUD */
    el.hudScore.textContent = state.score + ' / ' + QUESTIONS_PER_ROUND;
    el.hudProgress.textContent = (state.index + 1) + ' of ' + QUESTIONS_PER_ROUND;
    el.hudMode.textContent = modeLabel(state.mode);
    el.progressBar.style.width = (state.index / QUESTIONS_PER_ROUND * 100) + '%';

    /* Flag */
    setFlag(country);

    /* Question text */
    var prompt = state.mode === 'capital'
      ? 'What is the capital of '
      : 'What is the currency of ';
    el.questionText.innerHTML = '';
    el.questionText.appendChild(document.createTextNode(prompt));
    var strong = document.createElement('strong');
    strong.textContent = country.name;
    el.questionText.appendChild(strong);
    el.questionText.appendChild(document.createTextNode('?'));

    /* Options */
    el.options.innerHTML = '';
    state.options.forEach(function (option, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option';
      btn.setAttribute('data-value', option);
      btn.setAttribute('aria-label', 'Option ' + (i + 1) + ': ' + option);

      var key = document.createElement('span');
      key.className = 'option-key';
      key.textContent = String(i + 1);

      var label = document.createElement('span');
      label.className = 'option-label';
      label.textContent = option;

      btn.appendChild(key);
      btn.appendChild(label);
      btn.addEventListener('click', function () { selectOption(btn, option); });
      el.options.appendChild(btn);
    });

    /* Reset feedback + card state */
    el.feedback.textContent = '';
    el.feedback.className = 'feedback';
    el.card.classList.remove('flash-correct', 'flash-wrong');

    el.btnNext.textContent = state.index === QUESTIONS_PER_ROUND - 1
      ? 'See Results'
      : 'Next Question';
  }

  function setFlag(country) {
    var img = el.flag;

    el.flagFallback.hidden = true;
    el.flagFallback.textContent = '';
    img.hidden = false;
    img.alt = 'Flag of ' + country.name;
    img.dataset.code = country.code;
    img.dataset.stage = '0';

    img.onerror = function () {
      if (img.dataset.stage === '0') {
        img.dataset.stage = '1';
        img.src = 'https://flagcdn.com/w80/' + img.dataset.code + '.png';
        return;
      }
      img.onerror = null;
      img.hidden = true;
      el.flagFallback.hidden = false;
      el.flagFallback.textContent = country.code.toUpperCase();
    };

    img.src = 'https://flagcdn.com/w320/' + country.code + '.png';
  }

  /* ---------- Answering ---------- */

  function selectOption(btn, value) {
    if (state.answered) return;
    state.answered = true;

    var isCorrect = value === state.correctAnswer;
    var buttons = el.options.querySelectorAll('.option');

    Array.prototype.forEach.call(buttons, function (b) {
      b.disabled = true;
      if (b.getAttribute('data-value') === state.correctAnswer) {
        b.classList.add('is-correct');
      } else if (b === btn) {
        b.classList.add('is-wrong');
      } else {
        b.classList.add('is-dim');
      }
    });

    if (isCorrect) {
      state.score++;
      el.hudScore.textContent = state.score + ' / ' + QUESTIONS_PER_ROUND;
      btn.classList.add('pop');
      el.card.classList.add('flash-correct');
      el.feedback.textContent = 'Correct!';
      el.feedback.className = 'feedback is-correct';
      floatLabel('+1  Correct!', btn, false);
      partyPopper();
    } else {
      btn.classList.add('shake');
      el.card.classList.add('flash-wrong');
      el.feedback.textContent = 'Oops! The answer is ' + state.correctAnswer + '.';
      el.feedback.className = 'feedback is-wrong';
      floatLabel('Oops!', btn, true);
    }
  }

  function nextQuestion() {
    if (state.index >= QUESTIONS_PER_ROUND - 1) {
      showResults();
      return;
    }
    state.index++;
    renderQuestion();
  }

  /* ---------- Effects ---------- */

  function floatLabel(text, anchor, isWrong) {
    var rect = anchor.getBoundingClientRect();
    var node = document.createElement('div');
    node.className = 'float-label' + (isWrong ? ' wrong' : '');
    node.textContent = text;
    node.style.left = (rect.left + rect.width / 2) + 'px';
    node.style.top = (rect.top + rect.height / 2) + 'px';
    el.fx.appendChild(node);
    setTimeout(function () {
      if (node.parentNode) node.parentNode.removeChild(node);
    }, 1100);
  }

  function partyPopper() {
    if (typeof confetti !== 'function') return;

    var colors = ['#818cf8', '#22d3ee', '#f472b6', '#facc15', '#4ade80', '#a855f7'];

    confetti({
      particleCount: 70,
      spread: 65,
      angle: 60,
      origin: { x: 0.15, y: 0.72 },
      colors: colors,
      scalar: 1.1,
      disableForReducedMotion: true
    });

    confetti({
      particleCount: 70,
      spread: 65,
      angle: 120,
      origin: { x: 0.85, y: 0.72 },
      colors: colors,
      scalar: 1.1,
      disableForReducedMotion: true
    });

    setTimeout(function () {
      confetti({
        particleCount: 120,
        spread: 110,
        startVelocity: 42,
        origin: { x: 0.5, y: 0.45 },
        colors: colors,
        disableForReducedMotion: true
      });
    }, 170);

    setTimeout(function () {
      confetti({
        particleCount: 55,
        spread: 130,
        startVelocity: 30,
        shapes: ['circle'],
        origin: { x: 0.5, y: 0.3 },
        colors: colors,
        disableForReducedMotion: true
      });
    }, 400);
  }

  /* ---------- Results ---------- */

  function showResults() {
    showScreen('results');

    var total = QUESTIONS_PER_ROUND;
    var ratio = state.score / total;
    var title, message, emoji;

    if (ratio === 1) {
      title = 'Perfect score!';
      message = 'Flawless run - you are a genuine geography champion.';
      emoji = '🏆';
    } else if (ratio >= 0.8) {
      title = 'Excellent!';
      message = 'So close to perfect. Outstanding work.';
      emoji = '🎉';
    } else if (ratio >= 0.5) {
      title = 'Nice work!';
      message = 'A solid effort - a little more practice and you will ace it.';
      emoji = '👍';
    } else {
      title = 'Keep going!';
      message = 'Every round makes you sharper. Try again!';
      emoji = '💪';
    }

    el.resultsEmoji.textContent = emoji;
    el.resultsTitle.textContent = title;
    el.resultsScore.textContent = state.score + ' / ' + total;
    el.resultsMessage.textContent =
      message + ' Mode played: ' + modeLabel(state.mode) + '.';

    if (ratio >= 0.8) {
      setTimeout(partyPopper, 220);
    }
  }

  /* ---------- Keyboard support ---------- */

  function onKeyDown(e) {
    if (!el.screens.quiz.classList.contains('is-active')) return;

    if (e.key >= '1' && e.key <= '4') {
      var idx = parseInt(e.key, 10) - 1;
      var buttons = el.options.querySelectorAll('.option');
      if (buttons[idx] && !buttons[idx].disabled) {
        e.preventDefault();
        buttons[idx].click();
      }
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      el.btnNext.click();
    }
  }

  /* ---------- Init ---------- */

  function init() {
    cacheDom();

    document.getElementById('btn-mode-capital')
      .addEventListener('click', function () { startGame('capital'); });

    document.getElementById('btn-mode-currency')
      .addEventListener('click', function () { startGame('currency'); });

    el.btnNext.addEventListener('click', nextQuestion);

    el.btnAgain.addEventListener('click', function () {
      startGame(state.mode || 'capital');
    });

    el.btnChangeMode.addEventListener('click', function () {
      showScreen('start');
    });

    document.addEventListener('keydown', onKeyDown);

    showScreen('start');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
`;

/* ------------------------------------------------------------------ */
/* 5. README.md                                                        */
/* ------------------------------------------------------------------ */
const README_MD = `# Country Quiz

A dark-mode, single-page geography quiz about country capitals and currencies.
Every question shows the country flag, four answer options and instant
animated feedback.

## Running the game

No build step, no dependencies to install.

1. Open the folder named country-quiz
2. Double-click index.html (or drag it into any modern browser)

Optional: serve it over HTTP instead of the file system

    cd country-quiz
    npx serve .

An internet connection is needed the first time so the browser can load
the Google Font, the flag images from flagcdn.com and the confetti library
from jsDelivr.

## How to play

1. Pick a mode on the start screen: Capital Quiz or Currency Quiz
2. Read the question and look at the flag
3. Choose one of the four answers
4. Press Next Question (or Enter) to continue - you can skip at any time
5. After 10 questions you get a score screen with Play Again and Change Mode

## Keyboard shortcuts

- 1 to 4  ->  select an answer
- Enter   ->  go to the next question

## Features

- Two game modes: capitals and currencies
- 74 countries across every continent
- Country flag displayed for every question (with a graceful fallback)
- Four shuffled options per question, distractors never duplicate the answer
- Correct answers trigger a confetti party-popper burst, a pop animation,
  a green card flash and a floating "+1 Correct!" label
- Wrong answers trigger a horizontal shake, a red highlight on the chosen
  option, a green highlight on the correct one, a red card flash and a
  floating "Oops!" label
- Next Question is always available, even without answering
- Live score, question counter and animated progress bar
- Fully responsive dark UI with accessible buttons and aria labels
- Respects the prefers-reduced-motion setting

## Files

    country-quiz/
      index.html    markup and screen structure
      styles.css    dark theme, layout and animations
      app.js        game logic, state machine and effects
      data.js       country dataset (name, code, capital, currency)
      README.md     this file
`;

/* ------------------------------------------------------------------ */
/* Writer                                                              */
/* ------------------------------------------------------------------ */
const FILES = {
  'index.html': INDEX_HTML,
  'styles.css': STYLES_CSS,
  'app.js': APP_JS,
  'data.js': DATA_JS,
  'README.md': README_MD
};

function writeProject() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  console.log('');
  console.log('  Generating Country Quiz project...');
  console.log('  Target: ' + OUT_DIR);
  console.log('');

  Object.keys(FILES).forEach(function (name) {
    var target = path.join(OUT_DIR, name);
    fs.writeFileSync(target, FILES[name], 'utf8');
    console.log('    + ' + name);
  });

  console.log('');
  console.log('  Done! 5 files written.');
  console.log('');
  console.log('  How to play:');
  console.log('    1) cd ' + path.relative(process.cwd(), OUT_DIR));
  console.log('    2) open index.html   (or drag it into your browser)');
  console.log('');
  console.log('  Prefer a local server?');
  console.log('    cd ' + path.relative(process.cwd(), OUT_DIR) + ' && npx serve .');
  console.log('');
}

writeProject();