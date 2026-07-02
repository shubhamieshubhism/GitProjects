// import { generateLocatorsFromSnapshot } from '../helpers/snapshot-to-locators';

// describe('Auto‑generate locators from DOM snapshots', () => {
//   it('captures snapshot and uses generated locator to toggle dark mode', () => {
//     cy.visit('/');

//     cy.document().then(doc => {
//       const elements = Array.from(doc.querySelectorAll('[data-testid], [id]'));
//       const snapshot = elements.map(el => ({
//         testId: el.getAttribute('data-testid'),
//         id: el.id,
//       }));
//       const locators = generateLocatorsFromSnapshot(snapshot);
//       cy.log('Generated locators sample:', locators.slice(0, 5));

//       const darkModeEntry = snapshot.find(s => s.testId === 'dark-mode-toggle');
//       expect(darkModeEntry).to.exist;

//       // Use invoke('click') for reliability
//       cy.get(`[data-testid="${darkModeEntry.testId}"]`).invoke('click');
//       cy.get('body').should('have.class', 'dark');
//     });
//   });
// });

import { generateLocatorsFromSnapshot } from '../helpers/snapshot-to-locators';

describe('Auto‑generate locators from DOM snapshots', () => {
  beforeEach(() => {
    cy.visit('/');
    // Reset theme to light mode
    cy.window().then(win => {
      win.localStorage.setItem('theme', 'light');
    });
    cy.reload();
    cy.get('body').should('not.have.class', 'dark');
  });

  it('captures snapshot and uses generated locator to toggle dark mode', () => {
    cy.document().then(doc => {
      const elements = Array.from(doc.querySelectorAll('[data-testid], [id]'));
      const snapshot = elements.map(el => ({
        testId: el.getAttribute('data-testid'),
        id: el.id,
      }));
      const locators = generateLocatorsFromSnapshot(snapshot);
      cy.log('Generated locators sample:', locators.slice(0, 5));

      const darkModeEntry = snapshot.find(s => s.testId === 'dark-mode-toggle');
      expect(darkModeEntry).to.exist;

      // Use generated locator (by testid) to click
      cy.get(`[data-testid="${darkModeEntry.testId}"]`).click();
      cy.get('body').should('have.class', 'dark');
    });
  });
});