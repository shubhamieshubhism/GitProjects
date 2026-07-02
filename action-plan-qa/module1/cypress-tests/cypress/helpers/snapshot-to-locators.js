// Helper to generate recommended locators from a DOM snapshot
export function generateLocatorsFromSnapshot(snapshot) {
  const locators = [];
  for (const el of snapshot) {
    if (el.testId) {
      locators.push(`cy.get('[data-testid="${el.testId}"]')`);
    } else if (el.id) {
      locators.push(`cy.get('#${el.id}')`);
    }
  }
  return locators;
}