const { test, expect } = require('../fixtures');

// Mock data IDs are fixed (see e2e/mocks/data/):
//   media.json      → id: "mock-media-001"
//   epub-list.json  → id: "mock-epub-001", sourceId: "mock-media-001"
const MEDIA_ID = 'mock-media-001';
const EPUB_URL = '/epub/mock-epub-001';
const EPUB_LIST_URL = `/media-settings/${MEDIA_ID}/epub`;

test.describe('EPub (Video to Book) - I-Note List', () => {
  test('I-Note list page loads at /media-settings/:id/epub', async ({ page }) => {
    await page.goto(EPUB_LIST_URL);
    await expect(page.getByText('I-Note Books', { exact: true })).toBeVisible();
    await expect(page.locator('.ct-listitem-con[role="listitem"]').first()).toBeVisible();
  });

  test('clicking an I-Note item navigates to the EPub editor', async ({ page }) => {
    await page.goto(EPUB_LIST_URL);
    await page.locator('.ct-listitem-con[role="listitem"]').first().waitFor();

    // EPub list items have target="_blank" → click opens a new tab (popup)
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page'),
      page.locator('.ct-listitem-con[role="listitem"]').first().click(),
    ]);
    await newPage.waitForURL(/\/epub\//, { timeout: 10000 });
    await expect(newPage.locator('#ct-epb-main')).toBeVisible();
  });

  test('I-Note list items show non-empty titles', async ({ page }) => {
    await page.goto(EPUB_LIST_URL);
    const firstItem = page.locator('.ct-listitem-con[role="listitem"]').first();
    await firstItem.waitFor();
    const title = await firstItem.textContent();
    expect(title?.trim().length).toBeGreaterThan(0);
  });
});

test.describe('EPub (Video to Book) - Editor & Download', () => {
  test('EPub editor loads with view dropdown', async ({ page }) => {
    await page.goto(EPUB_URL);
    await expect(page.locator('#ct-epb-main')).toBeVisible();
    await expect(page.locator('#ct-epb-view-dropdown-btn')).toBeVisible();
  });

  test('switching to View or Download mode shows download panel', async ({ page }) => {
    await page.goto(EPUB_URL);
    await expect(page.locator('#ct-epb-view-dropdown-btn')).toBeVisible();

    await page.locator('#ct-epb-view-dropdown-btn').click();
    const viewOption = page.getByText('View or Download I-Note');
    await expect(viewOption).toBeVisible();
    await viewOption.click();

    await expect(page.getByText('Download').first()).toBeVisible();
    await expect(page.locator('.ct-file-btn').first()).toBeVisible();
  });

  test('download panel shows all 4 file format buttons', async ({ page }) => {
    await page.goto(EPUB_URL);
    await expect(page.locator('#ct-epb-view-dropdown-btn')).toBeVisible();

    await page.locator('#ct-epb-view-dropdown-btn').click();
    await page.getByText('View or Download I-Note').click();

    await expect(page.locator('.ct-file-btn')).toHaveCount(4);
    await expect(page.locator('.ct-file-btn-name .name').filter({ hasText: /\.epub$/ }).first()).toBeVisible();
    await expect(page.locator('.ct-file-btn-name .name').filter({ hasText: /\.zip$/ }).first()).toBeVisible();
    await expect(page.locator('.ct-file-btn-name .name').filter({ hasText: /\.pdf$/ }).first()).toBeVisible();
  });

  test('clicking .epub download triggers file download', async ({ page }) => {
    await page.goto(EPUB_URL);
    await expect(page.locator('#ct-epb-view-dropdown-btn')).toBeVisible();

    await page.locator('#ct-epb-view-dropdown-btn').click();
    await page.getByText('View or Download I-Note').click();

    const epubBtn = page.locator('.ct-file-btn').filter({ hasText: /\.epub/ }).first();
    await epubBtn.waitFor();

    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 60000 }),
      epubBtn.click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/\.epub$/);
  });

  test('clicking .zip (HTML) download triggers file download', async ({ page }) => {
    await page.goto(EPUB_URL);
    await expect(page.locator('#ct-epb-view-dropdown-btn')).toBeVisible();

    await page.locator('#ct-epb-view-dropdown-btn').click();
    await page.getByText('View or Download I-Note').click();

    const zipBtn = page.locator('.ct-file-btn').filter({ hasText: 'Save as HTML files' });
    await zipBtn.waitFor();

    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 60000 }),
      zipBtn.click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/\.zip$/);
  });

  test('clicking .pdf download triggers file download', async ({ page }) => {
    await page.goto(EPUB_URL);
    await expect(page.locator('#ct-epb-view-dropdown-btn')).toBeVisible();

    await page.locator('#ct-epb-view-dropdown-btn').click();
    await page.getByText('View or Download I-Note').click();

    const pdfBtn = page.locator('.ct-file-btn').filter({ hasText: 'Print/Save as PDF file' });
    await pdfBtn.waitFor();

    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 60000 }),
      pdfBtn.click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/\.pdf$/);
  });

  test('clicking latex download triggers file download', async ({ page }) => {
    await page.goto(EPUB_URL);
    await expect(page.locator('#ct-epb-view-dropdown-btn')).toBeVisible();

    await page.locator('#ct-epb-view-dropdown-btn').click();
    await page.getByText('View or Download I-Note').click();

    const latexBtn = page.locator('.ct-file-btn').filter({ hasText: 'Save as .tex file' });
    await latexBtn.waitFor();

    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 60000 }),
      latexBtn.click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/\.zip$/);
  });

  test('default view on load is Edit I-Note (chapter editor visible, no download buttons)', async ({ page }) => {
    await page.goto(EPUB_URL);
    await expect(page.locator('#ct-epb-view-dropdown-btn')).toBeVisible();

    await expect(page.locator('ul.ct-inote-editor')).toBeVisible();
    await expect(page.locator('.ct-file-btn')).toHaveCount(0);
  });

  test('switching back to Edit I-Note mode hides the download panel', async ({ page }) => {
    await page.goto(EPUB_URL);
    await expect(page.locator('#ct-epb-view-dropdown-btn')).toBeVisible();

    await page.locator('#ct-epb-view-dropdown-btn').click();
    await page.getByText('View or Download I-Note').click();
    await expect(page.locator('.ct-file-btn').first()).toBeVisible();

    await page.locator('#ct-epb-view-dropdown-btn').click();
    await page.getByText('Edit I-Note').click();

    await expect(page.locator('.ct-file-btn')).toHaveCount(0);
    await expect(page.locator('ul.ct-inote-editor')).toBeVisible();
  });
});
