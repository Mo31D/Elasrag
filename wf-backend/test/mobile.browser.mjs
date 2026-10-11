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
    assert.equal(await page.title(),'My Shift Companion');
    assert.equal(await page.locator('header .brand').textContent(),'My Shift Companion');
    await page.waitForTimeout(50);
    assert.ok(await page.evaluate(() => scrollY <= 5),JSON.stringify(await page.evaluate(()=>({scroll:scrollY,focus:document.activeElement.id,hero:document.querySelector('#shiftHero').getBoundingClientRect().toJSON()}))));
    const noOverflow = async () => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow at ${width}px`);
    await noOverflow();
    assert.equal(await page.locator('html').getAttribute('lang'),'en');
    await noOverflow();
    // Emergency routes remain in the header's Quick Action, not duplicated on Home.
    assert.equal(await page.locator('#home .home-safety-grid').count(),0);
    assert.equal(await page.locator('#home #homeSafetyTitle').count(),0);
    assert.deepEqual(await page.locator('header .action-strip [data-page]').evaluateAll(els=>els.map(el=>el.dataset.page)),['fire','actions']);
    assert.deepEqual(await page.locator('#actions .action-hub-card').evaluateAll(els=>els.map(el=>el.dataset.page)),['fire','firstaid/cpr','incident','safety/forecourt','safety/hazards','food/allergens','safety/burns','safety/substances']);
    assert.deepEqual(await page.locator('#home .home-focus .focus-card').evaluateAll(els=>els.map(el=>el.dataset.page)),['details','training']);
    assert.deepEqual(await page.locator('#home .home-topic').evaluateAll(els=>els.map(el=>el.dataset.topic)),['safety','food','firstaid','benefits','till']);
    assert.equal(await page.locator('#home .home-topic-link').count(),23);
    assert.equal(await page.locator('#home .home-topic-icon').count(),5);
    assert.equal(await page.locator('#home .home-topic-heading-label').count(),5);
    assert.equal(await page.locator('#home .home-topic-icon').evaluateAll(els=>els.every(el=>el.getBoundingClientRect().width<=30)),true);
    const companyHub=page.locator('#home .company-hub');
    assert.equal(await companyHub.count(),1);
    assert.equal(await companyHub.locator('.company-hub-app').count(),2);
    assert.deepEqual(await companyHub.locator('.company-hub-help-link').evaluateAll(els=>els.map(el=>el.dataset.page)),['access/reset','access/username','access/app']);
    const separation=await companyHub.evaluate(hub=>{
      const grid=document.querySelector('#home .home-topic-grid');
      return hub.getBoundingClientRect().top-grid.getBoundingClientRect().bottom;
    });
    assert.ok(separation>=20,`Company tools should remain visually separate at ${width}px: ${separation}px`);
    await noOverflow();
    const groupsLayout=await page.locator('#home .home-topic-grid').evaluate(grid=>{
      const sections=[...grid.children];
      const a=sections[0].getBoundingClientRect();
      const b=sections[1].getBoundingClientRect();
      return {columns:getComputedStyle(grid).gridTemplateColumns.split(' ').length,firstWidth:a.width,secondWidth:b.width,firstX:a.x,secondX:b.x};
    });
    assert.equal(groupsLayout.columns,width>=620?2:1,JSON.stringify(groupsLayout));
    assert.ok(Math.abs(groupsLayout.firstWidth-groupsLayout.secondWidth)<2,JSON.stringify(groupsLayout));
    if(width>=620)assert.ok(groupsLayout.firstX!==groupsLayout.secondX);
    else assert.ok(Math.abs(groupsLayout.firstX-groupsLayout.secondX)<2);
    for(const [route,pageId,selectedTab] of [
      ['safety/lifting','safety','lifting'],
      ['safety/forecourt','safety','forecourt'],
      ['food/temperatures','food','temperatures'],
      ['firstaid/choking','firstaid','choking'],
      ['benefits/leisure','benefits','leisure'],
      ['benefits/speakup','benefits','speakup'],
      ['till/basics','till','basics'],
      ['till/sales','till','sales'],
      ['till/fuel','till','fuel'],
      ['till/stock','till','stock'],
      ['uniform','uniform',null],
      ['access/username','access','username']
    ]){
      const selector=route.startsWith('access/') ? `#home .company-hub-help-link[data-page="${route}"]` : `#home .home-topic-link[data-page="${route}"]`;
      await page.locator(selector).click();
      await page.locator(`#${pageId}.active`).waitFor();
      if(selectedTab)assert.equal(await page.locator(`#${pageId} [data-tab="${selectedTab}"]`).getAttribute('aria-selected'),'true',route);
      await noOverflow();
      await page.locator(`#${pageId} [data-back]`).click();
      await page.locator('#home.active').waitFor();
    }
    // The two five-tab pages must use non-overlapping, non-sticky responsive grids.
    for(const [hash,section] of [['#safety/forecourt','safety'],['#benefits/speakup','benefits']]){
      await page.goto('https://mo.elasrag.com/'+hash);
      await page.locator('#'+section+'.active').waitFor();
      for(const locale of ['en','ar']){
        if(await page.locator('html').getAttribute('lang')!==locale)await page.locator('#languageToggle').click();
        const boxes=await page.locator('#'+section+' .section-tabs').evaluate(bar=>{
          const rect=bar.getBoundingClientRect();
          const tabs=[...bar.querySelectorAll('button')];
          const positions=tabs.map(tab=>tab.getBoundingClientRect());
          const overlaps=positions.some((a,i)=>positions.some((b,j)=>j>i&&Math.min(a.right,b.right)-Math.max(a.left,b.left)>2&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>2));
          return {
            display:getComputedStyle(bar).display,
            position:getComputedStyle(bar).position,
            columns:getComputedStyle(bar).gridTemplateColumns.split(' ').length,
            overlaps,
            fit:tabs.every((tab,i)=>positions[i].left>=rect.left-2&&positions[i].right<=rect.right+2&&tab.scrollWidth<=tab.clientWidth+2),
            all:tabs.length
          };
        });
        assert.equal(boxes.display,'grid',JSON.stringify({width,locale,section,boxes}));
        assert.equal(boxes.position,'relative');
        assert.equal(boxes.columns,width>=600?5:6);
        assert.equal(boxes.all,5);
        assert.equal(boxes.overlaps,false,JSON.stringify({width,locale,section,boxes}));
        assert.equal(boxes.fit,true,JSON.stringify({width,locale,section,boxes}));
        await noOverflow();
      }
    }
    if(await page.locator('html').getAttribute('lang')!=='en')await page.locator('#languageToggle').click();
    await page.goto('https://mo.elasrag.com/');
    await page.locator('#home.active').waitFor();

    // Training remains reachable from the primary card instead of a duplicate Browse tile.
    await page.locator('#home .home-learning').click();
    await page.locator('#training.active').waitFor();
    // Completed learning is private until signed in; the public overview card must still navigate.
    assert.equal(await page.locator('#training-tab-completed').isVisible(),false);
    await page.locator('#training [data-back]').click();
    await page.locator('#home.active').waitFor();
    await noOverflow();
    await page.locator('#languageToggle').click();
    assert.equal(await page.title(),'My Shift Companion');
    assert.equal(await page.locator('header .brand').textContent(),'My Shift Companion');
    assert.match(await page.locator('#home [data-topic="benefits"] .home-topic-heading').textContent(),/مزايا وإرشادات/);
    assert.match(await page.locator('#home [data-topic="safety"] .home-topic-heading').textContent(),/سلامة الشغل/);
    assert.match(await page.locator('#homeBrowseTitle').textContent(),/الأقسام والإرشادات/);
    await noOverflow();

    assert.match(await page.locator('header .action-hub-strip').textContent(),/تصرف سريع/);
    await noOverflow();
    await page.locator('#languageToggle').click();
    await page.locator('header .action-hub-strip').click();
    await page.locator('#actions.active').waitFor();
    for(const [route,target] of [
      ['incident','incident'],['safety/hazards','safety'],['food/allergens','food']
    ]){
      await page.locator(`#actions [data-page="${route}"]`).click();
      await page.locator(`#${target}.active`).waitFor();
      if(target==='safety')assert.equal(await page.locator('#safety-panel-hazards').isVisible(),true);
      await noOverflow();
      await page.locator(`#${target} [data-back]`).click();
      await page.locator('#actions.active').waitFor();
    }
    await page.locator('nav [data-page="home"]').click();
    await page.locator('#home.active').waitFor();
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
    // Private Vault has an intentionally different visual identity from the
    // two external apps, with a single lock icon and a readable bilingual label.
    await page.locator('#details-tab-accounts').click();
    const vaultEntry=page.locator('#details-panel-accounts .vault-entry');
    await vaultEntry.scrollIntoViewIfNeeded();
    const vaultVisual=await vaultEntry.evaluate(el=>{
      const other=el.closest('[data-tab-panel]').querySelector('a.action');
      const icon=el.querySelector('.vault-entry-icon svg').getBoundingClientRect();
      const rect=el.getBoundingClientRect();
      return {bg:getComputedStyle(el).backgroundColor,otherBg:getComputedStyle(other).backgroundColor,
        height:rect.height,width:rect.width,iconWidth:icon.width};
    });
    assert.notEqual(vaultVisual.bg,vaultVisual.otherBg,'Vault must not resemble the green external-app buttons');
    assert.ok(vaultVisual.height>=52 && vaultVisual.height<=95,JSON.stringify(vaultVisual));
    assert.ok(vaultVisual.iconWidth<=24,JSON.stringify(vaultVisual));
    assert.match(await vaultEntry.textContent(),/Passwords & private notes/);
    await noOverflow();
    await page.locator('#languageToggle').click();
    assert.match(await vaultEntry.textContent(),/كلمات المرور والملاحظات الخاصة/);
    await noOverflow();
    await vaultEntry.click();
    await page.locator('#vault.active').waitFor();
    await noOverflow();
    await page.locator('#vault [data-back]').click();
    await page.locator('#details.active').waitFor();
    assert.equal(await page.locator('#details-tab-accounts').getAttribute('aria-selected'),'true');
    await page.locator('#languageToggle').click();
    await noOverflow();
    await page.locator('nav [data-page="home"]').click();
    assert.ok((await page.locator('#shiftHeadline').textContent()).length>0);
    await noOverflow();
    assert.equal(await page.locator('nav [data-page="tasks"]').count(),0);
    assert.equal(await page.locator('#home .task-summary[data-page="tasks"]').count(),1);
    await page.locator('nav [data-page="shiftDuties"]').click();
    await page.locator('#shiftDuties.active').waitFor();
    assert.equal(await page.locator('#shiftDutyList .shift-duty-row').count(),2);
    assert.deepEqual(await page.locator('#shiftDutyList .shift-duty-clock').allTextContents(),['22:45','07:15']);
    await noOverflow();
    await page.locator('#addShiftDuty').click();
    await page.locator('#shiftDutyInput').fill('Manager instruction');
    await page.locator('#shiftDutyTime').fill('03:00');
    await page.locator('#shiftDutyOnce').check();
    await noOverflow();
    await page.locator('#shiftDutyForm [type="submit"]').click();
    await page.locator('#shiftDutyList .shift-duty-row').nth(2).waitFor();
    assert.equal(await page.locator('#shiftDutyList .shift-duty-row').count(),3);
    await page.locator('#shiftDutyList [data-duty="shift-arrival"] .task-check').check();
    await page.waitForFunction(() => document.getElementById('shiftDutyProgress').textContent === '1 / 3');
    await page.locator('#languageToggle').click();
    assert.match(await page.locator('#shiftDutyList [data-duty="shift-arrival"] .shift-duty-text').textContent(),/الوصول/);
    await noOverflow();
    await page.locator('#languageToggle').click();
    await page.locator('nav [data-page="training"]').click();
    await page.locator('#courseList .course-row').first().waitFor();
    await noOverflow();
    await page.locator('header [data-page="fire"]').click();
    await page.locator('#fire.active').waitFor();
    assert.equal(await page.locator('#fire .fire-direction-list > li').count(),2);
    assert.equal(await page.locator('#fire .fire-emergency-card [data-check]').count(),0);
    assert.match(await page.locator('#fire .fire-now-message').textContent(),/evacuating immediately/i);
    const practice=page.locator('#fire .fire-practice-panel');
    assert.equal(await practice.count(),1);
    assert.equal(await practice.evaluate(el=>el.open),false);
    assert.equal(await page.locator('#fire .fire-equipment-card').evaluate(el=>el.open),false);
    assert.equal(await page.locator('#fire .fire-call-link').getAttribute('href'),'tel:999');
    await noOverflow();
    await page.locator('#fire .fire-equipment-title').click();
    assert.equal(await page.locator('#fire .fire-equipment-card').evaluate(el=>el.open),true);
    assert.equal(await page.locator('#fire .fire-equipment-card .ext-card').count(),5);
    await noOverflow();
    await page.locator('#languageToggle').click();
    assert.match(await page.locator('#fire .fire-now-message').textContent(),/الإخلاء فورًا/);
    assert.equal(await page.locator('#fire .fire-equipment-card').evaluate(el=>el.open),true);
    await noOverflow();
    await page.locator('#languageToggle').click();
    await page.locator('#fire .fire-equipment-title').click();
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
    // Practice checklist must remain a compact collapsed reference on Fire,
    // never a floating, broken SVG/checkbox block under the course tracker.
    await practice.locator('summary').click();
    assert.equal(await practice.evaluate(el=>el.open),true);
    const drillLayout=await practice.evaluate(el=>{
      const icon=el.querySelector('.fire-heading-icon').getBoundingClientRect();
      const rows=[...el.querySelectorAll('.fire-emergency-list > li')];
      return {
        icon:Math.max(icon.width,icon.height),
        rows:rows.map(li=>{
          const label=li.querySelector('label.fire-check-row');
          return {
            checks:label.querySelectorAll('input[type="checkbox"]').length,
            width:label.getBoundingClientRect().width,
            text:label.querySelector('.task-text').getBoundingClientRect().width,
            scroll:label.scrollWidth,
            client:label.clientWidth
          };
        })
      };
    });
    assert.ok(drillLayout.icon<=28,'Fire rehearsal icon should not dominate the page');
    assert.equal(drillLayout.rows.length,2);
    for(const row of drillLayout.rows){
      assert.equal(row.checks,1,'One checkbox per rehearsal step');
      assert.ok(row.text>=130,'Readable label width on narrow mobile');
      assert.ok(row.scroll<=row.client+2,'No compressed or overflowing drill row');
    }
    await noOverflow();
    await practice.locator('[data-check="fire-evacuation-1"]').check();
    assert.equal(await practice.locator('[data-check="fire-evacuation-1"]').isChecked(),true);
    await practice.locator('[data-reset-checklist="fire-evacuation"]').click();
    assert.equal(await practice.locator('[data-check="fire-evacuation-1"]').isChecked(),false);
    await practice.locator('summary').click();
    await page.locator('[data-back-fire]').click();
    await page.locator('#training.active').waitFor();
    assert.equal(await page.locator('#training .fire-practice-panel').count(),0);
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
    // Newly documented on-shift action and workplace reporting: visible, readable, RTL-safe.
    const previousGuidanceLang=await page.locator('html').getAttribute('lang');
    if(await page.locator('html').getAttribute('lang')!=='en')await page.locator('#languageToggle').click();
    await page.goto('https://mo.elasrag.com/#actions');
    await page.locator('#actions [data-page="safety/forecourt"]').click();
    await page.locator('#safety.active').waitFor();
    assert.equal(await page.locator('#safety-tab-forecourt').getAttribute('aria-selected'),'true');
    assert.match(await page.locator('#safety-panel-forecourt .fc-emergency').textContent(),/Fuel spill/);
    assert.equal(await page.locator('#safety-panel-forecourt .fc-call').getAttribute('href'),'tel:999');
    assert.equal(await page.locator('#safety-panel-substances .chem-shift-note').count(),1);
    await noOverflow();
    await page.locator('#safety-panel-forecourt .fc-reference summary').first().click();
    assert.equal(await page.locator('#safety-panel-forecourt .fc-reference details[open]').count(),1);
    await page.locator('#safety-panel-forecourt .fc-reference summary').nth(1).click();
    assert.equal(await page.locator('#safety-panel-forecourt .fc-reference details[open]').count(),1);
    assert.equal(await page.locator('#safety-panel-forecourt .fc-reference details').first().evaluate(el=>el.open),false);
    await noOverflow();
    await page.locator('#languageToggle').click();
    assert.match(await page.locator('#safety-panel-forecourt .fc-emergency').textContent(),/تسرب وقود/);
    await noOverflow();
    await page.locator('#languageToggle').click();
    await page.goto('https://mo.elasrag.com/#benefits/speakup');
    await page.locator('#benefits-panel-speakup:visible').waitFor();
    assert.equal(await page.locator('#benefits-panel-speakup .speakup-contact').getAttribute('href'),'mailto:people@westmorlandfamily.com');
    await noOverflow();
    await page.locator('#languageToggle').click();
    assert.match(await page.locator('#benefits-panel-speakup').textContent(),/الإبلاغ/);
    await noOverflow();
    await page.locator('#languageToggle').click();
    await page.goto('https://mo.elasrag.com/#training');
    await page.locator('#training.active').waitFor();
    assert.equal(await page.locator('#training .training-verified').count(),0);
    await noOverflow();
    if(previousGuidanceLang!=='en')await page.locator('#languageToggle').click();

    // Route-specific, session-scoped progress: one checklist per operational task.
    for (const [route,id] of [
      ['#safety/burns','flow-burns'],['#safety/hazards','flow-hazards'],
      ['#safety/lifting','flow-lifting'],['#safety/hazards','flow-ppe-check'],['#safety/substances','flow-chemical-safe-use'],
      ['#safety/forecourt','flow-fuel-spill'],['#firstaid/cpr','flow-aid-cpr'],
      ['#firstaid/choking','flow-aid-choking'],['#food/allergens','flow-food-allergy'],
      ['#incident','flow-incident-response']
    ]) {
      await page.goto('https://mo.elasrag.com/'+route);
      const list=page.locator('[data-checklist="'+id+'"]');
      await list.waitFor({state:'visible'});
      const initial=await list.locator('input[type="checkbox"]').count();
      assert.ok(initial>=2,route);
      assert.equal(await page.locator('[data-check-progress="'+id+'"]').textContent(),'0 / '+initial);
      await list.locator('input[type="checkbox"]').first().check();
      assert.equal(await page.locator('[data-check-progress="'+id+'"]').textContent(),'1 / '+initial);
      await page.locator('#languageToggle').click();
      assert.equal(await list.locator('input[type="checkbox"]').first().isChecked(),true);
      await page.locator('#languageToggle').click();
      await page.locator('[data-reset-checklist="'+id+'"]').click();
      assert.equal(await list.locator('input[type="checkbox"]').first().isChecked(),false);
      assert.equal(await page.locator('[data-check-progress="'+id+'"]').textContent(),'0 / '+initial);
      await noOverflow();
    }

    // Safety quick actions should be reachable and readable on every supported viewport.
    await page.goto('https://mo.elasrag.com/#actions');
    await page.locator('#actions [data-page="firstaid/cpr"]').click();
    await page.locator('#firstaid.active').waitFor();
    assert.equal(await page.locator('#firstaid .aid-call').getAttribute('href'),'tel:999');
    for(const name of ['cpr','choking','recovery','injuries']){
      await page.locator('#firstaid-tab-'+name).click();
      assert.equal(await page.locator('#firstaid [data-tab-panel]:visible').count(),1);
      await noOverflow();
      await page.locator('#languageToggle').click();
      assert.equal(await page.locator('#firstaid-panel-'+name).isVisible(),true);
      await noOverflow();
      await page.locator('#languageToggle').click();
    }
    await page.locator('#firstaid-panel-injuries details summary').first().focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#firstaid-panel-injuries details').first().evaluate(el=>el.open),true);
    await noOverflow();
    await page.locator('#firstaid [data-page="safety/burns"]').click();
    await page.locator('#safety.active').waitFor();
    await page.locator('#safety [data-back]').click();
    await page.locator('#firstaid-panel-injuries').waitFor();
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

    // Incident reporting and risk hierarchy from training — concise, routed and bilingual.
    assert.equal(await page.locator('#safety-panel-hazards .risk-steps li').count(),3);
    assert.equal(await page.locator('#safety-panel-hazards .risk-steps .quick-step-number').count(),0);
    assert.equal(await page.locator('#safety-panel-hazards .risk-steps .quick-step-existing-number').count(),3);
    await noOverflow();
    await page.locator('#safety-panel-hazards .risk-control-details summary').click();
    assert.equal(await page.locator('#safety-panel-hazards .risk-control-list li').count(),5);
    await page.locator('#safety-panel-hazards .safety-scenario summary').first().click();
    assert.match(await page.locator('#safety-panel-hazards .safety-scenario').first().textContent(),/سكينة/);
    assert.equal(await page.locator('#safety-panel-hazards .safety-scenario').count(),4);
    for (const [guide, ar, en] of [['lone', /الشغل لوحدك/, /Working alone/], ['dse', /العمل على شاشة/, /Screen work/]]) {
      const detail = page.locator('#safety-panel-hazards [data-guide="'+guide+'"]');
      await detail.locator('summary').click();
      assert.equal(await detail.evaluate(el => el.open), true);
      assert.match(await detail.textContent(), ar);
      await noOverflow();
      await page.locator('#languageToggle').click();
      assert.match(await detail.textContent(), en);
      await noOverflow();
      await page.locator('#languageToggle').click();
      await detail.locator('summary').click();
    }
    await noOverflow();
    await page.locator('#safety-panel-hazards .risk-report-button').click();
    await page.locator('#incident.active').waitFor();
    assert.equal(await page.locator('#incident .incident-steps > li').count(),5);
    assert.equal(await page.locator('#incident .incident-steps .quick-step-number').count(),0);
    assert.equal(await page.locator('#incident .incident-steps .quick-step-existing-number').count(),5);
    assert.equal(await page.locator('#incident .incident-steps > li:first-child .quick-step-row').evaluate(row=>{
      const nodes=[...row.children];
      return nodes.length===3 && nodes[0].classList.contains('quick-step-check') &&
        nodes[1].classList.contains('incident-step-no') && nodes[2].classList.contains('quick-step-copy');
    }),true);
    await noOverflow();
    // Immediate action must precede definitions; details remain keyboard accessible.
    assert.equal(await page.locator('#incident .incident-classification').getAttribute('open'),null);
    assert.ok(await page.locator('#incident .incident-urgent').evaluate(el=>el.compareDocumentPosition(document.querySelector('#incident .incident-response')) & Node.DOCUMENT_POSITION_FOLLOWING));
    await page.locator('#incident .incident-classification summary').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#incident .incident-classification').evaluate(el=>el.open),true);
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#incident .incident-classification').evaluate(el=>el.open),false);
    assert.ok(await page.locator('#safety-panel-hazards').evaluate(el=>el.firstElementChild.querySelector('[data-i18n="hazardTitle"]')!==null));
    assert.match(await page.locator('#incident .incident-system-path').textContent(),/Alert65.*Accidents & Incidents/);
    assert.match(await page.locator('#incident-heading').textContent(),/الإبلاغ/);
    await page.locator('#incident .incident-record summary').click();
    assert.equal(await page.locator('#incident .incident-record-grid li').count(),4);
    await noOverflow();
    await page.locator('#languageToggle').click();
    assert.match(await page.locator('#incident-heading').textContent(),/Report an accident or near miss/);
    assert.match(await page.locator('#incident .incident-step-no').last().textContent(),/5/);
    await noOverflow();
    await page.locator('#incident [data-back]').click();
    await page.locator('#safety.active').waitFor();
    assert.equal(await page.locator('#safety-panel-hazards').isVisible(),true);
    await page.goto('https://mo.elasrag.com/#actions');
    await page.locator('#actions [data-page="incident"]').click();
    await page.locator('#incident.active').waitFor();
    await noOverflow();

    // Food guide: all tabs, translation persistence and layout on mobile.
    await page.goto('https://mo.elasrag.com/#food/allergens');
    await page.locator('#food.active').waitFor();
    assert.equal(await page.locator('#food .food-tabs button').count(),4);
    assert.equal(await page.locator('#food .food-call').getAttribute('href'),'tel:999');
    for(const tab of ['temperatures','hygiene','reporting','allergens']){
      await page.locator('#food-tab-'+tab).click();
      assert.equal(await page.locator('#food [role="tabpanel"]:visible').count(),1);
      await noOverflow();
      await page.locator('#languageToggle').click();
      assert.equal(await page.locator('#food-panel-'+tab).isVisible(),true);
      await noOverflow();
      await page.locator('#languageToggle').click();
    }
    await page.locator('#food .food-fold summary').first().focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#food .food-fold').first().evaluate(el=>el.open),true);
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
