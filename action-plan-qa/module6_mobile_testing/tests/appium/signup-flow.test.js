const { expect } = require('chai');

describe('Sign-up Flow', () => {
  it('should complete the sign-up process', async () => {
    const usernameField = await $('~usernameInput');
    const passwordField = await $('~passwordInput');
    const signUpButton = await $('~signUpButton');
    const successMessage = await $('~welcomeMessage');

    await usernameField.waitForDisplayed({ timeout: 10000 });
    await usernameField.setValue('testuser');
    await passwordField.setValue('securePass123');
    await signUpButton.click();

    await successMessage.waitForDisplayed({ timeout: 10000 });
    const message = await successMessage.getText();
    expect(message).to.include('Welcome, testuser');
  });
});
