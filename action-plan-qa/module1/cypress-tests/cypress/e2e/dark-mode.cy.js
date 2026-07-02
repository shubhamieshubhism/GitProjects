// describe('Dark Mode', () => {
//     beforeEach(() => {
//       cy.visit('/', { timeout: 30000 });
//     });
  
//     it('toggles dark mode and persists after reload', () => {
//       // Ensure no dark class initially
//       cy.get('body').should('not.have.class', 'dark');
  
//       // Use invoke to trigger the click (more reliable)
//       cy.get('[data-testid="dark-mode-toggle"]').invoke('click');
  
//       // Wait for class to appear with retry (Cypress will poll for 10 seconds)
//       cy.get('body', { timeout: 10000 }).should('have.class', 'dark');
  
//       // Reload and verify persistence
//       cy.reload();
//       cy.get('body').should('have.class', 'dark');
//     });
//   });

describe('Dark Mode', () => {
  beforeEach(() => {
    cy.visit('/');
    // Reset theme to light mode
    cy.window().then(win => {
      win.localStorage.setItem('theme', 'light');
    });
    // Reload to apply light mode
    cy.reload();
    // Ensure body does not have dark class
    cy.get('body').should('not.have.class', 'dark');
  });

  it('toggles dark mode and persists after reload', () => {
    // Click the toggle button
    cy.get('[data-testid="dark-mode-toggle"]').click();
    cy.get('body').should('have.class', 'dark');
    cy.reload();
    cy.get('body').should('have.class', 'dark');
  });
});