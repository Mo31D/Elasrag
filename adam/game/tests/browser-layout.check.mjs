import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir} from 'node:fs/promises';

const sizes=[
 {name:'samsung-s21-portrait',width:360,height:780,touch:true},
 {name:'samsung-s21-landscape',width:780,height:360,touch:true},
 {name:'ipad-portrait',width:820,height:1180,touch:true},
 {name:'ipad-landscape',width:1180,height:820,touch:true},
 {name:'desktop',width:1440,height:900,touch:false}
];
await mkdir('atlas-screenshots',{recursive:true});
const browser=await chromium.launch({headless:true});
let failures=[];
for(const size of sizes){
 const ctx=await browser.newContext({viewport:{width:size.width,height:size.height},isMobile:size.touch,hasTouch:size.touch,deviceScaleFactor:1});
 const page=await ctx.newPage();
 try{
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173/adam/',{waitUntil:'networkidle',timeout:30000});
  await page.locator('.adventure-card.science-card').waitFor();
  const geometry=await page.evaluate(()=>{
   const r=(selector)=>{const e=document.querySelector(selector);if(!e)return null;const b=e.getBoundingClientRect();return {top:b.top,bottom:b.bottom,left:b.left,right:b.right,height:b.height,width:b.width,position:getComputedStyle(e).position}};
   return {
    science:r('.adventure-card.science-card'),
    maths:r('.adventure-card.maths-card'),
    atlas:r('.atlas'),deck:r('.adventure-deck'),footer:r('.game-footer'),bottom:r('.map-bottom'),
    cards:document.querySelectorAll('.adventure-deck .adventure-card').length,
    viewport:innerWidth,
    documentWidth:document.documentElement.scrollWidth,
    scrollHeight:document.documentElement.scrollHeight
   };
  });
  assert.ok(geometry.cards>=4,'missing a quest');
  assert.equal(geometry.deck.position,'relative','atlas cards must be in document flow');
  assert.ok(geometry.science.height>=250,'science card should have content space');
  assert.ok(geometry.science.bottom<=geometry.atlas.bottom+2,'science card cropped by atlas');
  assert.ok(geometry.bottom.top>=geometry.science.bottom-1,'bottom actions cover science card');
  assert.ok(geometry.bottom.bottom<=geometry.footer.top+2,'bottom actions overlap footer');
  assert.ok(geometry.documentWidth<=geometry.viewport+2,'horizontal overflow');
  assert.equal(errors.length,0,'runtime errors: '+errors.join('; '));
  await page.locator('.adventure-card.science-card').scrollIntoViewIfNeeded();
  await page.screenshot({path:'atlas-screenshots/'+size.name+'.png',fullPage:true});
  // Exercise the actual visual tools at every viewport, not just the atlas.
  await page.locator('[data-action="maths"]').click();
  await page.locator('[data-action="engine-2"]').click();
  await page.locator('.visual-tool summary').click();
  await page.locator('[data-piece="0"]').click();
  assert.match(await page.locator('.visual-tool output').innerText(),/1\/4.*25%/);
  await page.locator('.visual-tool').scrollIntoViewIfNeeded();
  await page.screenshot({path:'atlas-screenshots/'+size.name+'-fractions.png',fullPage:true});
  await page.locator('[data-action="maths"]').click();
  await page.locator('[data-action="engine-8"]').click();
  await page.locator('.visual-tool summary').click();
  await page.getByRole('slider',{name:'Garden length'}).focus();
  await page.getByRole('slider',{name:'Garden length'}).press('End');
  assert.match(await page.locator('.garden-result').innerText(),/30 m.*50 m²/);
  await page.locator('[data-action="maths"]').click();
  await page.locator('[data-action="engine-9"]').click();
  await page.locator('.visual-tool summary').click();
  await page.getByRole('button',{name:'Point (3, 5)',exact:true}).click();
  assert.match(await page.locator('.visual-tool output').innerText(),/Treasure found/);
  const width=await page.evaluate(()=>({document:document.documentElement.scrollWidth,viewport:innerWidth}));
  assert.ok(width.document<=width.viewport+2,'visual tool causes horizontal overflow');
  assert.equal(errors.length,0,'runtime errors: '+errors.join('; '));
  console.log('PASS',size.name,geometry);
 }catch(e){
  failures.push(size.name+': '+e.message);
  await page.screenshot({path:'atlas-screenshots/'+size.name+'-failed.png',fullPage:true}).catch(()=>{});
 }finally{await ctx.close();}
}
await browser.close();
if(failures.length)throw Error(failures.join('\n'));
