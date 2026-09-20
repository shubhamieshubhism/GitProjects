# Country Quiz

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
