import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login';
import { log } from 'node:console';

test('test', async ({ page }) => {

  const login = new LoginPage(page)
  await login.gotoLoginPage()
  await login.login('tomsmith','SuperSecretPassword')

});