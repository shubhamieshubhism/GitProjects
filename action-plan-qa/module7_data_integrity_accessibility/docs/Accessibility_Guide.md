# Accessibility Testing Guide (WCAG 2.2)

## What is WCAG?
The Web Content Accessibility Guidelines (WCAG) define how to make web content more accessible to people with disabilities.

## How We Test Accessibility

### Automated Tests (Axe)
- Runs static analysis on the DOM.
- Checks for violations of WCAG rules (e.g., missing alt text, low contrast).
- **Code**: `tests/accessibility/axe-audit.test.js`

### Lighthouse Audits
- Provides a performance and accessibility score.
- **Code**: `tests/accessibility/lighthouse-audit.js`

### Keyboard Navigation
- Verifies tab order and focus indicators.
- Documents edge cases (e.g., missing aria labels).
- **Code**: `tests/accessibility/keyboard-navigation.test.js`

## Common Violations
1. Missing `alt` text on images.
2. Low colour contrast.
3. Missing `aria-label` on interactive elements.
4. No visible focus indicator.
5. Missing form labels.

## Running These Tests
```bash
npm run test:a11y
```

## Reports
- HTML: `reports/axe-report.html`
- JSON: `reports/lighthouse-report.json`
- Logs: `reports/keyboard-nav.log`, `reports/edge-cases.log`
