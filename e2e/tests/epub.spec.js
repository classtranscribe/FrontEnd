const { test, expect } = require('@playwright/test');

// EPub (I-Note / "Video to Book") — two-step navigation:
//   Step 1: /media-settings/:mediaId/epub  → CTEPubListScreen (I-Note books list for the media)
//   Step 2: click a list item              → /epub/:epubId (the actual EPub editor)
//
// EPub editor views (ViewDropdown — #ct-epb-view-dropdown-btn):
//   "Edit I-Note"             → default on load (EditINote)
//   "View or Download I-Note" → EpbReadOnly → shows DownloadOptions with 4 CTFileButton items
//
// Download formats (DownloadOptions):
//   {filename}.epub         → EPubFileBuilder
//   {filename}.zip          → HTMLFileBuilder (HTML + CSS + images)
//   {filename}.pdf          → PDFFileBuilder
//   {filename}.zip          → LatexFileBuilder
//
// Downloads are triggered client-side via js-file-download (Blob URL + anchor click).
// Playwright intercepts them with page.waitForEvent('download').

// Discover (mediaId, epubUrl) from staging:
// - mediaId: extracted from the first video URL found via the instructor playlist
// - epubUrl: href of the first I-Note item in the media's I-Note list (/epub/:epubId)
async function discoverEPubUrls(browser) {
  const context = await browser.newContext({ storageState: 'e2e/.auth/user.json' });
  const page = await context.newPage();

  // --- Step A: get a mediaId via instructor playlist ---
  await page.goto('/');
  const courseCard = page.locator('a.ct-course-card').first();
  await courseCard.waitFor({ timeout: 20000 });
  const courseHref = await courseCard.getAttribute('href');

  await page.goto(courseHref);
  await page.waitForURL(/\/offering\//, { timeout: 10000 });

  const playlistLink = page.locator('#cp-pls-view .pl-item a').first();
  await playlistLink.waitFor({ timeout: 15000 });
  const playlistHref = await playlistLink.getAttribute('href');
  await playlistLink.click();

  let watchHref;
  if (playlistHref && playlistHref.startsWith('#')) {
    const mediaCard = page.locator('.ct-media-card').first();
    await mediaCard.waitFor({ timeout: 20000 });
    watchHref = await mediaCard.getAttribute('href');
  } else {
    await page.waitForURL(/\/playlist\//, { timeout: 10000 });
    await page.locator('.media-item').first().waitFor({ timeout: 20000 });
    watchHref = await page.locator('a[href*="/video"]').first().getAttribute('href');
  }

  const mediaId = new URLSearchParams(watchHref.split('?')[1]).get('id');

  // --- Step B: open I-Note list for that media, get first epub URL ---
  await page.goto(`/media-settings/${mediaId}/epub`);

  // List items are EPubCTListItem: ButtonBase with component=Link renders as
  // <a class="ct-listitem-con" role="listitem" href="/epub/:id">
  const firstItem = page.locator('.ct-listitem-con[role="listitem"]').first();
  await firstItem.waitFor({ timeout: 15000 });
  const epubUrl = await firstItem.getAttribute('href');

  await context.close();
  return { mediaId, epubUrl };
}

test.describe('EPub (Video to Book) - I-Note List', () => {
  let mediaId;
  let epubUrl;

  test.beforeAll(async ({ browser }) => {
    ({ mediaId, epubUrl } = await discoverEPubUrls(browser));
  });

  test('discovers valid mediaId and epub URL from staging', async () => {
    expect(mediaId).toBeTruthy();
    expect(epubUrl).toBeTruthy();
    expect(epubUrl).toMatch(/\/epub\//);
  });

  test('I-Note list page loads at /media-settings/:id/epub', async ({ page }) => {
    await page.goto(`/media-settings/${mediaId}/epub`);
    await expect(page.getByText('I-Note Books', { exact: true })).toBeVisible({ timeout: 15000 });
    await expect(page.locator('.ct-listitem-con[role="listitem"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('clicking an I-Note item navigates to the EPub editor', async ({ page }) => {
    await page.goto(`/media-settings/${mediaId}/epub`);
    await page.locator('.ct-listitem-con[role="listitem"]').first().waitFor({ timeout: 15000 });

    // EPub list items have target="_blank" → click opens a new tab (popup)
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page'),
      page.locator('.ct-listitem-con[role="listitem"]').first().click(),
    ]);
    await newPage.waitForURL(/\/epub\//, { timeout: 10000 });
    await expect(newPage.locator('#ct-epb-main')).toBeVisible({ timeout: 20000 });
  });

  test('I-Note list items show non-empty titles', async ({ page }) => {
    await page.goto(`/media-settings/${mediaId}/epub`);
    const firstItem = page.locator('.ct-listitem-con[role="listitem"]').first();
    await firstItem.waitFor({ timeout: 15000 });
    const title = await firstItem.textContent();
    expect(title?.trim().length).toBeGreaterThan(0);
  });
});

test.describe('EPub (Video to Book) - Editor & Download', () => {
  let epubUrl;

  test.beforeAll(async ({ browser }) => {
    ({ epubUrl } = await discoverEPubUrls(browser));
  });

  test('EPub editor loads with view dropdown', async ({ page }) => {
    await page.goto(epubUrl);
    await expect(page.locator('#ct-epb-main')).toBeVisible({ timeout: 20000 });
    // View dropdown renders only when !loading (epub data fetched from staging API)
    await expect(page.locator('#ct-epb-view-dropdown-btn')).toBeVisible({ timeout: 20000 });
  });

  test('switching to View or Download mode shows download panel', async ({ page }) => {
    await page.goto(epubUrl);
    await expect(page.locator('#ct-epb-view-dropdown-btn')).toBeVisible({ timeout: 20000 });

    await page.locator('#ct-epb-view-dropdown-btn').click();
    const viewOption = page.getByText('View or Download I-Note');
    await expect(viewOption).toBeVisible({ timeout: 5000 });
    await viewOption.click();

    await expect(page.getByText('Download').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.ct-file-btn').first()).toBeVisible({ timeout: 5000 });
  });

  test('download panel shows all 4 file format buttons', async ({ page }) => {
    await page.goto(epubUrl);
    await expect(page.locator('#ct-epb-view-dropdown-btn')).toBeVisible({ timeout: 20000 });

    await page.locator('#ct-epb-view-dropdown-btn').click();
    await page.getByText('View or Download I-Note').click();

    await expect(page.locator('.ct-file-btn')).toHaveCount(4, { timeout: 10000 });
    await expect(page.locator('.ct-file-btn-name .name').filter({ hasText: /\.epub$/ }).first()).toBeVisible();
    await expect(page.locator('.ct-file-btn-name .name').filter({ hasText: /\.zip$/ }).first()).toBeVisible();
    await expect(page.locator('.ct-file-btn-name .name').filter({ hasText: /\.pdf$/ }).first()).toBeVisible();
  });

  test('clicking .epub download triggers file download', async ({ page }) => {
    await page.goto(epubUrl);
    await expect(page.locator('#ct-epb-view-dropdown-btn')).toBeVisible({ timeout: 20000 });

    await page.locator('#ct-epb-view-dropdown-btn').click();
    await page.getByText('View or Download I-Note').click();

    const epubBtn = page.locator('.ct-file-btn').filter({ hasText: /\.epub/ }).first();
    await epubBtn.waitFor({ timeout: 10000 });

    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 60000 }),
      epubBtn.click(),
    ]);

    expect(download.suggestedFilename()).toMatch(/\.epub$/);
  });

  test('clicking .zip (HTML) download triggers file download', async ({ page }) => {
    await page.goto(epubUrl);
    await expect(page.locator('#ct-epb-view-dropdown-btn')).toBeVisible({ timeout: 20000 });

    await page.locator('#ct-epb-view-dropdown-btn').click();
    await page.getByText('View or Download I-Note').click();

    // HTMLFileBuilder button: description "Save as HTML files with CSS styles and images"
    const zipBtn = page.locator('.ct-file-btn').filter({ hasText: 'Save as HTML files' });
    await zipBtn.waitFor({ timeout: 10000 });

    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 60000 }),
      zipBtn.click(),
    ]);

    expect(download.suggestedFilename()).toMatch(/\.zip$/);
  });

  test('clicking .pdf download triggers file download', async ({ page }) => {
    await page.goto(epubUrl);
    await expect(page.locator('#ct-epb-view-dropdown-btn')).toBeVisible({ timeout: 20000 });

    await page.locator('#ct-epb-view-dropdown-btn').click();
    await page.getByText('View or Download I-Note').click();

    // PDFFileBuilder button: description "Print/Save as PDF file"
    const pdfBtn = page.locator('.ct-file-btn').filter({ hasText: 'Print/Save as PDF file' });
    await pdfBtn.waitFor({ timeout: 10000 });

    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 60000 }),
      pdfBtn.click(),
    ]);

    expect(download.suggestedFilename()).toMatch(/\.pdf$/);
  });

  test('clicking latex download triggers file download', async ({ page }) => {
    await page.goto(epubUrl);
    await expect(page.locator('#ct-epb-view-dropdown-btn')).toBeVisible({ timeout: 20000 });

    await page.locator('#ct-epb-view-dropdown-btn').click();
    await page.getByText('View or Download I-Note').click();

    // LatexFileBuilder button: description "Save as .tex file with bundled images"
    const latexBtn = page.locator('.ct-file-btn').filter({ hasText: 'Save as .tex file' });
    await latexBtn.waitFor({ timeout: 10000 });

    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 60000 }),
      latexBtn.click(),
    ]);

    expect(download.suggestedFilename()).toMatch(/\.zip$/);
  });

  test('default view on load is Edit I-Note (chapter editor visible, no download buttons)', async ({ page }) => {
    await page.goto(epubUrl);
    await expect(page.locator('#ct-epb-view-dropdown-btn')).toBeVisible({ timeout: 20000 });

    // EditINote renders the chapter list; DownloadOptions is NOT rendered in this view
    await expect(page.locator('ul.ct-inote-editor')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.ct-file-btn')).toHaveCount(0);
  });

  test('switching back to Edit I-Note mode hides the download panel', async ({ page }) => {
    await page.goto(epubUrl);
    await expect(page.locator('#ct-epb-view-dropdown-btn')).toBeVisible({ timeout: 20000 });

    // Switch to View mode
    await page.locator('#ct-epb-view-dropdown-btn').click();
    await page.getByText('View or Download I-Note').click();
    await expect(page.locator('.ct-file-btn').first()).toBeVisible({ timeout: 10000 });

    // Switch back to Edit mode
    await page.locator('#ct-epb-view-dropdown-btn').click();
    await page.getByText('Edit I-Note').click();

    await expect(page.locator('.ct-file-btn')).toHaveCount(0, { timeout: 5000 });
    await expect(page.locator('ul.ct-inote-editor')).toBeVisible({ timeout: 10000 });
  });
});
