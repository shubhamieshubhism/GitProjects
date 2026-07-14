// const { chromium } = require('playwright');

// /**
//  * Captures DOM snapshot and accessibility tree from a given URL
//  * Extracts token-efficient semantic elements for LLM processing
//  */
// async function captureDOMSnapshot(url) {
//   const browser = await chromium.launch({ headless: true });
//   const page = await browser.newPage();
  
//   try {
//     await page.goto(url, { waitUntil: 'networkidle' });
    
//     // 1. Capture accessibility tree
//     const accessibilitySnapshot = await page.accessibility.snapshot();
    
//     // 2. Extract semantic elements with aria-labels and roles
//     const semanticElements = await page.$$eval(
//       '[aria-label], [role], [data-testid], input, button, a, form',
//       (elements) => elements.map(el => ({
//         tag: el.tagName.toLowerCase(),
//         ariaLabel: el.getAttribute('aria-label'),
//         role: el.getAttribute('role'),
//         id: el.id,
//         className: el.className,
//         text: el.textContent?.trim().slice(0, 100),
//         placeholder: el.getAttribute('placeholder'),
//         type: el.getAttribute('type'),
//         href: el.getAttribute('href'),
//         dataTestId: el.getAttribute('data-testid'),
//       }))
//     );
    
//     const pageInfo = {
//       title: await page.title(),
//       url: page.url(),
//     };
    
//     return { accessibilitySnapshot, semanticElements, pageInfo };
    
//   } finally {
//     await browser.close();
//   }
// }

// /**
//  * Generates a token-efficient DOM summary for LLM consumption
//  */
// function createTokenEfficientSummary(semanticElements) {
//   const interactiveElements = semanticElements.filter(el => 
//     ['button', 'input', 'a', 'select', 'textarea'].includes(el.tag) ||
//     el.role === 'button' ||
//     el.role === 'link' ||
//     el.role === 'textbox' ||
//     el.ariaLabel
//   );
  
//   return interactiveElements.map(el => ({
//     tag: el.tag,
//     ariaLabel: el.ariaLabel,
//     role: el.role,
//     text: el.text?.substring(0, 50),
//     placeholder: el.placeholder,
//     type: el.type,
//     dataTestId: el.dataTestId,
//   }));
// }

// module.exports = { captureDOMSnapshot, createTokenEfficientSummary };
const { chromium } = require('playwright');

/**
 * Captures DOM snapshot and accessibility tree from a given URL
 * Uses the new locator.aria_snapshot() API (Playwright v1.49+)
 */
async function captureDOMSnapshot(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    
    // 1. Use the new aria_snapshot() API on the body element
    // This returns a YAML representation of the accessibility tree
    const bodyLocator = page.locator('body');
    const accessibilitySnapshot = await bodyLocator.ariaSnapshot();
    
    // 2. Extract semantic elements with aria-labels and roles
    const semanticElements = await page.$$eval(
      '[aria-label], [role], [data-testid], input, button, a, form',
      (elements) => elements.map(el => ({
        tag: el.tagName.toLowerCase(),
        ariaLabel: el.getAttribute('aria-label'),
        role: el.getAttribute('role'),
        id: el.id,
        className: el.className,
        text: el.textContent?.trim().slice(0, 100),
        placeholder: el.getAttribute('placeholder'),
        type: el.getAttribute('type'),
        href: el.getAttribute('href'),
        dataTestId: el.getAttribute('data-testid'),
      }))
    );
    
    const pageInfo = {
      title: await page.title(),
      url: page.url(),
    };
    
    return { accessibilitySnapshot, semanticElements, pageInfo };
    
  } finally {
    await browser.close();
  }
}

/**
 * Generates a token-efficient DOM summary for LLM consumption
 */
function createTokenEfficientSummary(semanticElements) {
  const interactiveElements = semanticElements.filter(el => 
    ['button', 'input', 'a', 'select', 'textarea'].includes(el.tag) ||
    el.role === 'button' ||
    el.role === 'link' ||
    el.role === 'textbox' ||
    el.ariaLabel
  );
  
  return interactiveElements.map(el => ({
    tag: el.tag,
    ariaLabel: el.ariaLabel,
    role: el.role,
    text: el.text?.substring(0, 50),
    placeholder: el.placeholder,
    type: el.type,
    dataTestId: el.dataTestId,
  }));
}

module.exports = { captureDOMSnapshot, createTokenEfficientSummary };