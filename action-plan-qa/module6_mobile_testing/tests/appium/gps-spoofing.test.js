const { expect } = require('chai');

describe('GPS Spoofing', () => {
  it('should mock device location', async () => {
    await driver.setLocation({ latitude: 37.7749, longitude: -122.4194 });
    const locationElement = await $('~locationDisplay');
    const text = await locationElement.getText();
    expect(text).to.include('San Francisco');
  });
});
