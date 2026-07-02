// Custom command to measure execution time of a callback
Cypress.Commands.add('measureTime', { prevSubject: false }, (callback, iterations = 100) => {
  const times = [];
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    callback();
    times.push(performance.now() - start);
  }
  const avg = times.reduce((a, b) => a + b, 0) / iterations;
  return avg;
});

// Custom command to get a DOM snapshot with testid/id locators
Cypress.Commands.add('getDOMSnapshot', () => {
  cy.document().then((doc) => {
    const elements = Array.from(doc.querySelectorAll('[data-testid], [id]'));
    const snapshot = elements.map(el => ({
      tag: el.tagName,
      testId: el.getAttribute('data-testid'),
      id: el.id,
      className: el.className,
      text: el.innerText?.slice(0, 60),
    }));
    return snapshot;
  });
});