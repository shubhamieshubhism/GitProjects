/* ==========================================================================
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
