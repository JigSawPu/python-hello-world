import { expect, test, type Page } from '@playwright/test';

const BLOCK_HASH = 'b'.repeat(64);

async function mockTip(page: Page) {
  await page.route('**/blocks/tip/height', async (route) => {
    await route.fulfill({ status: 200, contentType: 'text/plain', body: '900000' });
  });
}

test('homepage loads and network choice persists', async ({ page }) => {
  await mockTip(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Bitcoin Explorer' })).toBeVisible();
  await page.getByLabel('Bitcoin network').selectOption('testnet');
  await page.reload();
  await expect(page.getByLabel('Bitcoin network')).toHaveValue('testnet');
});

test('block-height search resolves and navigates', async ({ page }) => {
  await mockTip(page);
  await page.route('**/block-height/840000', async (route) => {
    await route.fulfill({ status: 200, contentType: 'text/plain', body: BLOCK_HASH });
  });
  await page.goto('/');
  await page.getByLabel('Search blocks, transactions, or addresses').fill('840000');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page).toHaveURL(new RegExp(`/block/${BLOCK_HASH}$`));
  await expect(page.getByRole('heading', { name: 'Block' })).toBeVisible();
});

test('direct transaction route renders the application shell', async ({ page }) => {
  await mockTip(page);
  await page.goto(`/tx/${'a'.repeat(64)}`);
  await expect(page.getByRole('heading', { name: 'Transaction' })).toBeVisible();
});
