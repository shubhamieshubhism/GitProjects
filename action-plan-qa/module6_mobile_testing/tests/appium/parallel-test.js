const { expect } = require('chai');

describe('Cross-device sign-up', () => {
  it('should sign up on different devices', async () => {
    const usernameField = await $('~usernameInput');
    const passwordField = await $('~passwordInput');
    const signUpButton = await $('~signUpButton');

    await usernameField.setValue('parallelUser');
    await passwordField.setValue('parallelPass');
    await signUpButton.click();

    const success = await $('~welcomeMessage');
    await expect(success).toBeDisplayed();
  });
});
