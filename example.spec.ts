import { test, expect } from '@playwright/test';

const targetUrl = 'http://localhost:5173/'

test('values are in sync via local storage', async ({ page, context }) => {
  await page.goto(targetUrl);

  await page.locator('#input').type('hello world')
  await expect(page.locator('#output')).toHaveText('hello world')

  const newPage = await context.newPage()
  await newPage.goto(targetUrl)
  await expect(newPage.locator('#output')).toHaveText('hello world')


  await page.locator('#input').type('SECOND ATTEMPT')
  await expect(newPage.locator('#output')).toHaveText('SECOND ATTEMPT')

});
