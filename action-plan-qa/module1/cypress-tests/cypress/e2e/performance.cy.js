describe('Performance benchmarking of selector methods', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.get('.product-card').first().as('firstCard');
    });
  
    const measureSelector = (name, getElementFn, iterations = 100) => {
      let totalTime = 0;
      for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        getElementFn();
        totalTime += performance.now() - start;
      }
      const avg = totalTime / iterations;
      cy.log(`${name}: avg ${avg.toFixed(3)} ms`);
      return avg;
    };
  
    it('benchmarks different selector strategies', () => {
      cy.get('@firstCard').then($card => {
        const productId = $card.attr('data-product-id');
        const productName = $card.find('.product-name').text();
  
        // CSS selector
        measureSelector('CSS selector', () => {
          cy.get(`.product-card[data-product-id="${productId}"]`);
        });
  
        // XPath (Cypress doesn't support XPath natively, but we can use a plugin or just simulate)
        // Here we'll use a CSS fallback; for real XPath you'd need cypress-xpath.
        cy.log('XPath not natively supported – using CSS equivalent');
  
        // data-testid of add-to-cart button
        measureSelector('data-testid', () => {
          cy.get(`[data-testid="add-to-cart-${productId}"]`);
        });
  
        // getByText (using contains)
        measureSelector('getByText (product name)', () => {
          cy.contains('.product-name', productName);
        });
  
        // getByRole (button with text)
        measureSelector('getByRole (button "Add to cart")', () => {
          cy.contains('button', 'Add to cart');
        });
      });
    });
  });