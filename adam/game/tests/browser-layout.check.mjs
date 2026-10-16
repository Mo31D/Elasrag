import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir,readFile,stat} from 'node:fs/promises';
import {createServer} from 'node:http';
import {fileURLToPath} from 'node:url';
import {resolve,extname} from 'node:path';
const root=fileURLToPath(new URL('../../../',import.meta.url));
const shots=fileURLToPath(new URL('../atlas-screenshots/',import.meta.url));
const server=createServer(async(req,res)=>{try{let path=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!path.startsWith(root))throw Error();if((await stat(path)).isDirectory())path+='/index.html';res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.json':'application/json','.mp3':'audio/mpeg'})[extname(path)]||'application/octet-stream');res.end(await readFile(path));}catch{res.statusCode=404;res.end('Not found')}});
await new Promise(r=>server.listen(4174,'127.0.0.1',r));

const sizes=[
 {name:'samsung-s21-portrait',width:360,height:780,touch:true},
 {name:'samsung-s21-landscape',width:780,height:360,touch:true},
 {name:'ipad-portrait',width:820,height:1180,touch:true},
 {name:'ipad-landscape',width:1180,height:820,touch:true},
 {name:'desktop',width:1440,height:900,touch:false}
];
await mkdir(shots,{recursive:true});
const browser=await chromium.launch({headless:true});
let failures=[];
for(const size of sizes){
 const ctx=await browser.newContext({viewport:{width:size.width,height:size.height},isMobile:size.touch,hasTouch:size.touch,deviceScaleFactor:1});
 const page=await ctx.newPage();
 try{
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4174/adam/',{waitUntil:'networkidle',timeout:30000});
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
  assert.ok(geometry.science.height>=210,'science card should have content space');
  assert.ok(geometry.science.bottom<=geometry.atlas.bottom+2,'science card cropped by atlas');
  assert.ok(geometry.bottom.top>=geometry.science.bottom-1,'bottom actions cover science card');
  assert.ok(geometry.bottom.bottom<=geometry.footer.top+2,'bottom actions overlap footer');
  assert.ok(geometry.documentWidth<=geometry.viewport+2,'horizontal overflow');
  assert.equal(errors.length,0,'runtime errors: '+errors.join('; '));
  await page.locator('.adventure-card.science-card').scrollIntoViewIfNeeded();
  await page.screenshot({path:shots+'/'+size.name+'.png',fullPage:true});
  const artwork=await page.locator('.science-card').evaluate(card=>{const a=card.querySelector('.adventure-feature-art').getBoundingClientRect(),t=card.querySelector('strong').getBoundingClientRect();return {overlap:a.left<t.right&&a.right>t.left&&a.top<t.bottom&&a.bottom>t.top}});
  assert.equal(artwork.overlap,false,'science artwork overlaps its title');
  // Exercise the actual visual tools at every viewport, not just the atlas.
  await page.locator('[data-action="maths"]').click();
  await page.locator('[data-action="engine-2"]').click();
  const selector=await page.locator('.engine-selector').boundingBox(),question=await page.locator('.puzzle-panel').boundingBox();
  if(size.width<=650)assert.ok(selector.y+selector.height<=question.y+2,'path selector covers the question');
  await page.locator('.visual-tool summary').click();
  await page.locator('[data-piece="0"]').click();
  assert.match(await page.locator('.visual-tool output').innerText(),/1\/4.*25%/);
  await page.locator('.visual-tool').scrollIntoViewIfNeeded();
  await page.screenshot({path:shots+'/'+size.name+'-fractions.png',fullPage:true});
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
  await page.getByRole('button',{name:'Adventure map',exact:true}).click();
  await page.getByRole('button',{name:'Enter Discovery Laboratory',exact:true}).click();
  await page.getByRole('button',{name:'Enter the laboratory →',exact:true}).click();
  await page.getByRole('button',{name:'Sugar will dissolve',exact:true}).click();
  await page.locator('[data-action="test-sugar"]').click();
  await page.locator('[data-action="test-sand"]').click();
  await page.getByRole('button',{name:'Record observations →',exact:true}).click();
  await page.getByRole('button',{name:'Sugar is soluble in water; sand is insoluble.',exact:true}).click();
  await page.getByRole('link',{name:'Return to the Adventure Atlas',exact:true}).click();
  assert.match(await page.locator('.xp').innerText(),/\b10\s+XP\b/);
  await page.getByRole('button',{name:'Detective notebook',exact:true}).click();
  await page.locator('#notebook-search').fill('soluble');
  assert.ok(await page.locator('[data-notebook-term="soluble"]').isVisible());
  await page.locator('[data-action="close"]').click();
  await page.getByRole('button',{name:'Enter Word Kingdom',exact:true}).click();
  await page.getByRole('button',{name:'Open apple card',exact:true}).click();
  await page.getByRole('button',{name:'Close card',exact:true}).click();
  await page.getByRole('link',{name:'Return to Adventure Atlas',exact:true}).click();
  await page.getByRole('button',{name:'Detective notebook',exact:true}).click();
  await page.locator('#notebook-search').fill('apple');
  assert.ok(await page.locator('[data-notebook-term="apple"]').isVisible());
  await page.screenshot({path:shots+'/'+size.name+'-notebook.png',fullPage:true});
  await page.locator('[data-action="close"]').click();
  await page.locator('[data-action="daily"]').click();
  assert.match(await page.locator('.daily-world').innerText(),/A little learning/);
  await page.locator('[data-action="daily-maths"]').click();
  await page.locator('[data-action="beacon-next"]').click();
  await page.locator('#beacon-answer').fill('12');
  await page.locator('#beacon-form button').click();
  assert.match(await page.locator('#beacon-feedback').innerText(),/Try again/);
  await page.locator('#beacon-answer').fill('400');
  await page.locator('#beacon-form button').click();
  await page.locator('[data-action="beacon-next"]').click();
  for(let stage=2;stage<=3;stage++){
   const heading=await page.locator('.beacon-panel h2').innerText();const [,digit,formatted]=heading.match(/value of (\d) in ([\d,]+)/);
   const digits=formatted.replaceAll(',',''),value=Number(digit)*10**(digits.length-digits.indexOf(digit)-1);
   await page.locator('#beacon-answer').fill(String(value));await page.locator('#beacon-form button').click();
   if(stage===2)await page.locator('[data-action="beacon-next"]').click();
  }
  assert.match(await page.locator('#beacon-next').innerText(),/review is scheduled/);
  assert.match(await page.locator('.xp').innerText(),/\b18\s+XP\b/,'HUD must update immediately after the new lesson awards XP');
  await page.screenshot({path:shots+'/'+size.name+'-beacon.png',fullPage:true});
  await page.locator('[data-action="daily"]').first().click();
  assert.ok(await page.locator('.daily-steps li.done').count()>=1);
  await page.reload();await page.locator('[data-action="daily"]').click();assert.ok(await page.locator('.daily-steps li.done').count()>=1);
  const dailyWidth=await page.evaluate(()=>({width:document.documentElement.scrollWidth,viewport:innerWidth}));assert.ok(dailyWidth.width<=dailyWidth.viewport+2);
  await page.locator('[data-action="daily-words"]').click();
  // Every fresh word begins with meaning recognition. Wrong attempts stay supported.
  for(let i=0;i<3;i++){
   await page.locator('[data-action="notebook-help"]').click();
   const model=await page.locator('#notebook-feedback').innerText();const term=model.split(':')[0];
   await page.locator('[data-action="notebook-choice:'+term+'"]').click();
   assert.match(await page.locator('#notebook-feedback').innerText(),/Supported practice saved/);
   await page.locator('[data-action="notebook-next"]').click();
  }
  assert.match(await page.locator('#overlay').innerText(),/Recall trail complete/);
  assert.equal(errors.length,0,'cross-game runtime errors: '+errors.join('; '));
  console.log('PASS',size.name,geometry);
 }catch(e){
  failures.push(size.name+': '+e.message);
  await page.screenshot({path:shots+'/'+size.name+'-failed.png',fullPage:true}).catch(()=>{});
 }finally{await ctx.close();}
}
await browser.close();
await new Promise(r=>server.close(r));
if(failures.length)throw Error(failures.join('\n'));
