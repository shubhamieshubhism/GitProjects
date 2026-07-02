describe('Micro‑frontend widgets', () => {
    beforeEach(() => {
      cy.visit('/');
      // Ensure recently viewed widget gets content (add a product)
      cy.get('.add-to-cart-btn').first().click();
    });
  
    it('Recommended widget toggles independently', () => {
      cy.get('[data-testid="widget-recommended"]').within(() => {
        cy.get('.widget-content').should('be.visible');
        cy.get('[data-testid="toggle-recommended"]').click();
        cy.get('.widget-content').should('not.be.visible');
        cy.get('[data-testid="toggle-recommended"]').click();
        cy.get('.widget-content').should('be.visible');
      });
    });
  
    it('Recently viewed widget toggles independently', () => {
      cy.get('[data-testid="widget-recently-viewed"]').within(() => {
        cy.get('.widget-content').should('be.visible');
        cy.get('[data-testid="toggle-recently-viewed"]').click();
        cy.get('.widget-content').should('not.be.visible');
        cy.get('[data-testid="toggle-recently-viewed"]').click();
        cy.get('.widget-content').should('be.visible');
      });
    });
  
    it('Toggling one widget does not affect the other', () => {
      const recContent = () => cy.get('[data-testid="widget-recommended"] .widget-content');
      const recToggle = () => cy.get('[data-testid="widget-recommended"] [data-testid="toggle-recommended"]');
      const recentContent = () => cy.get('[data-testid="widget-recently-viewed"] .widget-content');
  
      recToggle().click();
      recContent().should('not.be.visible');
      recentContent().should('be.visible');
  
      recToggle().click();
      recContent().should('be.visible');
      recentContent().should('be.visible');
    });
  });