describe('Cart functionality', () => {
    beforeEach(() => {
      cy.visit('/');
    });
  
    it('adds product to cart, opens modal, verifies item', () => {
      // Get first product name and add to cart
      cy.get('.product-card').first().within(() => {
        cy.get('.product-name').invoke('text').as('productName');
        cy.get('.add-to-cart-btn').click();
      });
  
      // Cart badge updates
      cy.get('[data-testid="cart-indicator"]').should('contain', '1 items');
  
      // Open modal
      cy.get('[data-testid="cart-indicator"]').click();
      cy.get('#cartModal').should('be.visible');
  
      // Check product appears
      cy.get('@productName').then(productName => {
        cy.get('#cartModal').contains('.cart-item', productName).should('be.visible');
      });
  
      // Close modal
      cy.get('#cartModal .close-modal').click();
      cy.get('#cartModal').should('not.be.visible');
    });
  });