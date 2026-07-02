export const axeConfig = {
  rules: {
    'image-alt': { enabled: true },
    'button-name': { enabled: true },
    'color-contrast': { enabled: true, options: { noScroll: true } },
    'aria-roles': { enabled: true },
    'landmark-one-main': { enabled: false }
  },
  runOnly: {
    type: 'tag',
    values: ['wcag2a', 'wcag2aa', 'wcag22aa']
  }
};
