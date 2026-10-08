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
    assert.ok(await page.evaluate(() => scrollY <= 5),JSON.stringify(await page.evaluate(()=>({scroll:scrollY,focus:document.activeElement.id,hero:document.querySelector('#shiftHero').getBoundingClientRect().toJSON()}))));
    const noOverflow = async () => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow at ${width}px`);
    await noOverflow();
    assert.equal(await page.locator('html').getAttribute('lang'),'en');
    await noOverflow();
    await page.locator('#accountBtn').click();
    assert.ok(await page.locator('#passInput').evaluate(el => parseFloat(getComputedStyle(el).fontSize) >= 16));
    await page.locator('#passInput').fill('fixture-password-only');
    await page.locator('#unlockBtn').click();
    await page.locator('#details.active').waitFor();
    await noOverflow();
    await page.locator('[data-edit-profile]').click();
    assert.ok(await page.locator('#profileDialog').evaluate(el => el.getBoundingClientRect().width <= innerWidth));
    assert.equal(await page.locator('[data-shift-day]').count(),7);
    await page.locator('[data-shift-day="1"]').check();
    await noOverflow();
    await page.locator('#saveProfile').click();
    await page.locator('#profileDialog').waitFor({state:'hidden'});
    await page.locator('nav [data-page="home"]').click();
    assert.ok((await page.locator('#shiftHeadline').textContent()).length>0);
    await noOverflow();
    await page.locator('nav [data-page="training"]').click();
    await page.locator('#courseList .course-row').first().waitFor();
    await noOverflow();
    await page.locator('header [data-page="fire"]').click();
    await page.locator('[data-checklist="fire-forecourt"] summary').click();
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
    await page.locator('#languageToggle').click();
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
        await page.locator('#languageToggle').click();await noOverflow();
        await page.locator('#languageToggle').click();await noOverflow();
        assert.equal(await tab.getAttribute('aria-selected'),'true');
      }
    }
    // Safety quick actions should be reachable and readable on every supported viewport.
    await page.goto('https://mo.elasrag.com/#actions');
    await page.locator('#actions.active').waitFor();
    await page.locator('#actions [data-page="safety/substances"]').click();
    await page.locator('#safety.active').waitFor();
    const firstChemical = page.locator('#safety-panel-substances > .coshh-urgent');
    assert.equal(await firstChemical.isVisible(), true);
    assert.match(await firstChemical.textContent(), /لو حد ابتلع مادة تنظيف|If someone swallows a cleaning chemical/);
    await noOverflow();
    await page.locator('#safety-tab-hazards').click();
    assert.equal(await page.locator('#safety-panel-hazards > .ppe-action-guide').isVisible(), true);
    assert.equal(await page.locator('#safety-panel-hazards .ppe-mini-list li').count(),3);
    assert.equal(await page.locator('#safety-panel-hazards .safety-sign-tile').count(),4);
    await noOverflow();
    await page.locator('#languageToggle').click();
    assert.match(await page.locator('#safety-panel-hazards .ppe-action-guide').textContent(),/Before using protective equipment/);
    await noOverflow();
    await page.locator('#languageToggle').click();
    assert.match(await page.locator('#safety-panel-hazards .ppe-action-guide').textContent(),/قبل استخدام معدات الوقاية/);
    await noOverflow();
    await page.goto('https://mo.elasrag.com/#uniform');
    await page.locator('#uniform.active').waitFor();
    assert.equal(await page.locator('#uniform .ppe-action-guide').count(),0);
    await page.locator('#uniform .ppe-open-link').click();
    await page.locator('#safety.active').waitFor();
    assert.equal(await page.locator('#safety-panel-hazards').isVisible(),true);
    await noOverflow();
    await page.locator('#logoutBtn').click();
    await page.locator('#home.active').waitFor();
    assert.deepEqual(errors, []);
    await context.close();
    console.log(`Mobile layout, auth, labels, Arabic reading position and logout: ${width}px passed`);
  }
} finally { await browser.close(); }
