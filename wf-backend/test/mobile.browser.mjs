import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import worker from '../src/index.js';
import { fixture } from './fixtures.js';

const browser = await chromium.launch({
  executablePath: process.env.WF_TEST_CHROMIUM,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--disable-software-rasterizer'],
});
try {
  for (const width of [320, 390, 768]) {
    const context = await browser.newContext({ viewport: { width, height: 844 }, isMobile: true, hasTouch: true });
    await context.addInitScript(() => delete Object.getPrototypeOf(navigator).serviceWorker);
    const { env } = fixture();
    await context.route('https://mo.elasrag.com/**', async route => {
      const req = route.request();
      const response = await worker.fetch(new Request(req.url(), {
        method: req.method(), headers: { ...req.headers(), origin: 'https://mo.elasrag.com' },
        ...(req.postData() ? { body: req.postData() } : {}),
      }), env);
      await route.fulfill({ status: response.status, headers: Object.fromEntries(response.headers), body: Buffer.from(await response.arrayBuffer()) });
    });
    const page = await context.newPage(); const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('https://mo.elasrag.com/');
    await page.locator('#home.active').waitFor();
    await page.waitForTimeout(50);
    assert.ok(await page.evaluate(() => scrollY <= 5));
    const noOverflow = async () => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow at ${width}px`);
    await noOverflow();
    await page.locator('header [data-lang="en"]').click();
    await noOverflow();
    await page.locator('#accountBtn').click();
    assert.ok(await page.locator('#passInput').evaluate(el => parseFloat(getComputedStyle(el).fontSize) >= 16));
    await page.locator('#passInput').fill('fixture-password-only');
    await page.locator('#unlockBtn').click();
    await page.locator('#details.active').waitFor();
    await noOverflow();
    await page.locator('[data-edit-profile]').click();
    assert.ok(await page.locator('#profileDialog').evaluate(el => el.getBoundingClientRect().width <= innerWidth));
    await page.locator('#cancelProfile').click();
    await page.locator('nav [data-page="training"]').click();
    await page.locator('#courseList .course-row').first().waitFor();
    await noOverflow();
    await page.locator('header [data-page="fire"]').click();
    await page.locator('[data-checklist="fire-warden"] summary').click();
    const label = page.locator('label[for="fire-forecourt-1"]');
    await label.click();
    assert.equal(await page.locator('#fire-forecourt-1').isChecked(), true);
    await label.evaluate(el => {
      const line = document.querySelector('header').getBoundingClientRect().bottom + 12;
      scrollBy(0, el.getBoundingClientRect().top - line + 10);
    });
    const fraction = () => label.evaluate(el => {
      const r = el.getBoundingClientRect(); const line = document.querySelector('header').getBoundingClientRect().bottom + 12;
      return (line - r.top) / r.height;
    });
    const before = await fraction();
    assert.ok(before >= 0 && before <= 1, `Reading setup at ${width}px: ${before}`);
    await page.locator('header [data-lang="ar"]').click();
    await page.waitForTimeout(50);
    const after=await fraction();
    assert.ok(Math.abs(after - before) < 0.03, `Reading position at ${width}px: ${before} -> ${after}`);
    assert.match(await label.textContent(), /محطة/);
    assert.match(await page.locator('label[for="fire-warden-3"]').textContent(), /حريق/);
    assert.equal(await page.locator('#fire-forecourt-1').isChecked(), true);
    await noOverflow();
    await page.locator('[data-back-fire]').click();
    await page.locator('#training.active').waitFor();
    await page.locator('#training-tab-completed').click();
    assert.equal(await page.locator('#completedLearning').isVisible(),true);
    for(const section of ['benefits','uniform','access']){
      await page.goto('https://mo.elasrag.com/#'+section);
      await page.locator('#'+section+'.active').waitFor();
      for(const tab of await page.locator('#'+section+' [data-tab]').all()){
        await tab.click();const name=await tab.getAttribute('data-tab');
        assert.equal(await page.locator('#'+section+' [data-tab-panel="'+name+'"]').isVisible(),true);
        await page.locator('header [data-lang="en"]').click();await noOverflow();
        await page.locator('header [data-lang="ar"]').click();await noOverflow();
        assert.equal(await tab.getAttribute('aria-selected'),'true');
      }
    }
    await page.locator('#logoutBtn').click();
    await page.locator('#home.active').waitFor();
    assert.deepEqual(errors, []);
    await context.close();
    console.log(`Mobile layout, auth, labels, Arabic reading position and logout: ${width}px passed`);
  }
} finally { await browser.close(); }
