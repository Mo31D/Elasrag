import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir,readFile,stat} from 'node:fs/promises';
import {createServer} from 'node:http';
import {fileURLToPath} from 'node:url';
import {resolve,extname} from 'node:path';
const root=fileURLToPath(new URL('../../../',import.meta.url));
const shots=fileURLToPath(new URL('../atlas-screenshots/',import.meta.url));
const server=createServer(async(req,res)=>{try{let path=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!path.startsWith(root))throw Error();if((await stat(path)).isDirectory())path+='/index.html';res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.json':'application/json','.mp3':'audio/mpeg','.webp':'image/webp'})[extname(path)]||'application/octet-stream');res.end(await readFile(path));}catch{res.statusCode=404;res.end('Not found')}});
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
 const page=await ctx.newPage();page.setDefaultTimeout(15000);
 try{
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4174/adam/',{waitUntil:'domcontentloaded',timeout:30000});
  await page.locator('.adventure-card.science-card').waitFor();
  await page.waitForFunction(()=>{const image=document.querySelector('.painted-atlas');return image?.complete&&image.naturalWidth>0;});
  const geometry=await page.evaluate(()=>{
   const rect=e=>{const b=e.getBoundingClientRect();return {top:b.top,bottom:b.bottom,left:b.left,right:b.right,height:b.height,width:b.width}};
   const image=document.querySelector('.painted-atlas');
   return {frame:rect(document.querySelector('.world-map-frame')),sites:[...document.querySelectorAll('.world-site')].map(e=>({...rect(e),label:rect(e.querySelector('.site-label'))})),camp:rect(document.querySelector('.explorer-camp')),footer:rect(document.querySelector('.game-footer')),bottom:rect(document.querySelector('.map-bottom')),viewport:innerWidth,documentWidth:document.documentElement.scrollWidth,imageLoaded:image.complete&&image.naturalWidth>0};
  });
  assert.equal(geometry.sites.length,4,'all four destinations must be available');
  assert.equal(geometry.imageLoaded,true,'original world artwork must load');
  for(const site of geometry.sites){
   assert.ok(site.width>=44&&site.height>=44,'world destination needs a comfortable touch target');
   assert.ok(site.left>=geometry.frame.left&&site.right<=geometry.frame.right+1&&site.top>=geometry.frame.top&&site.bottom<=geometry.frame.bottom+1,'destination cropped by map');
   assert.ok(site.label.left>=0&&site.label.right<=geometry.viewport+1,'destination label cropped');
  }
  for(let i=0;i<4;i++)for(let j=i+1;j<4;j++){
   const a=geometry.sites[i],b=geometry.sites[j];
   assert.equal(a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top,false,'destination controls overlap');
  }
  assert.ok(geometry.bottom.bottom<=geometry.footer.top+2,'camp actions overlap footer');
  if(size.width<=700)assert.ok(geometry.camp.top>=geometry.frame.bottom,'camp covers the map');
  assert.ok(geometry.documentWidth<=geometry.viewport+2,'horizontal overflow');
  assert.equal(errors.length,0,'runtime errors: '+errors.join('; '));
  await page.screenshot({path:shots+'/'+size.name+'.png',fullPage:true});
  // The artwork is a playable scene. Optional text opens on request, without a new route.
  await page.locator('[data-action="mission"]').click();
  await page.locator('.scene-art').waitFor();
  await page.waitForFunction(()=>{const e=document.querySelector('.scene-art');return e?.complete&&e.naturalWidth>0;});
  const scene=await page.locator('.scene-art').boundingBox(),clue=await page.locator('[data-action="clue-empty"]').boundingBox();
  assert.ok(clue.x>=0&&clue.x+clue.width<=size.width+1&&clue.y+clue.height<=scene.y+scene.height+1,'clue is outside its scene');
  await page.locator('[data-action="read"]').click();
  assert.equal(await page.locator('.story-caption').getAttribute('open'),'');
  await page.locator('[data-action="clue-empty"]').click();
  assert.equal(await page.locator('.word-illustration .word-story-art').count(),1,'discovered word has a contextual picture');
  await page.locator('#overlay .close').click();
  await page.screenshot({path:shots+'/'+size.name+'-detective.png',fullPage:true});
  await page.getByRole('button',{name:'Adventure map',exact:true}).click();
  // Exercise the actual visual tools at every viewport, not just the atlas.
  await page.locator('[data-action="maths"]').click();
  await page.locator('[data-action="engine-2"]').click();
  const selector=await page.locator('.engine-selector').boundingBox(),question=await page.locator('.puzzle-panel').boundingBox();
  if(size.width<=650)assert.ok(selector.y+selector.height<=question.y+2,'path selector covers the question');
  assert.equal(await page.locator('.visual-tool').getAttribute('open'),'','visual help should be visible without hunting for it');
  await page.locator('[data-piece="0"]').click();
  assert.match(await page.locator('.visual-tool output').innerText(),/1\/4 of 20 = 5 lanterns/);
  await page.locator('.visual-tool').scrollIntoViewIfNeeded();
  await page.screenshot({path:shots+'/'+size.name+'-fractions.png',fullPage:true});
  await page.locator('[data-action="maths"]').click();
  await page.locator('[data-action="engine-8"]').click();
  assert.equal(await page.locator('.visual-tool').getAttribute('open'),'','visual help should be visible without hunting for it');
  await page.getByRole('slider',{name:'Garden length'}).focus();
  await page.getByRole('slider',{name:'Garden length'}).press('End');
  assert.match(await page.locator('.garden-result').innerText(),/30 m.*50 m²/);
  await page.locator('[data-action="maths"]').click();
  await page.locator('[data-action="engine-9"]').click();
  assert.equal(await page.locator('.visual-tool').getAttribute('open'),'','visual help should be visible without hunting for it');
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
  await page.waitForFunction(()=>[...document.querySelectorAll('.material-grains.sugar em')].every(e=>getComputedStyle(e).opacity==='0'));
  await page.locator('[data-stir]').click();
  assert.match(await page.locator('.particle-host [role="status"]').innerText(),/still present/);
  await page.screenshot({path:shots+'/'+size.name+'-science.png',fullPage:true});
  await page.getByRole('button',{name:'Record observations →',exact:true}).click();
  await page.getByRole('button',{name:'Sugar is soluble in water; sand is insoluble.',exact:true}).click();
  await page.getByRole('link',{name:'Return to the Adventure Atlas',exact:true}).click();
  assert.match(await page.locator('.xp').innerText(),/\b10\s+XP\b/);
  await page.getByRole('button',{name:'Detective notebook',exact:true}).click();
  await page.locator('#notebook-search').fill('soluble');
  assert.ok(await page.locator('[data-notebook-term="soluble"]').isVisible());
  await page.locator('#overlay .close').click();
  await page.getByRole('button',{name:'Enter Word Kingdom',exact:true}).click();
  await page.getByRole('button',{name:'Open apple card',exact:true}).click();
  await page.screenshot({path:shots+'/'+size.name+'-word-card.png',fullPage:true});
  await page.getByRole('button',{name:'Close card',exact:true}).click();
  await page.locator('#wk-collection').selectOption('all');
  await page.locator('#wk-search').fill('puzzled');
  await page.getByRole('button',{name:'Open puzzled card',exact:true}).click();
  const art=await page.locator('.wk-card-front .word-story-art').boundingBox();
  assert.ok(Math.abs(art.width-art.height)<2,'context art must preserve square proportions');
  await page.screenshot({path:shots+'/'+size.name+'-word-story.png',fullPage:true});
  await page.locator('#wk-flip').click();
  const meaning=await page.locator('.wk-definition').innerText();
  await page.locator('#wk-practise').click();
  await page.locator('.wk-answer').filter({hasNotText:meaning}).first().click();
  assert.match(await page.locator('#wk-feedback').innerText(),/try again/i);
  await page.locator('#wk-again').click();
  await page.locator('.wk-answer').filter({hasText:meaning}).click();
  assert.match(await page.locator('#wk-feedback').innerText(),/Good thinking/);
  await page.locator('#wk-next-skill').click();
  await page.locator('#wk-spell').fill('puzzled');
  await page.locator('#wk-spell-form button[type="submit"]').click();
  assert.match(await page.locator('#wk-feedback').innerText(),/word stars/);
  await page.getByRole('button',{name:'Close card',exact:true}).click();
  await page.getByRole('link',{name:'Return to Adventure Atlas',exact:true}).click();
  await page.getByRole('button',{name:'Detective notebook',exact:true}).click();
  await page.locator('#notebook-search').fill('apple');
  assert.ok(await page.locator('[data-notebook-term="apple"]').isVisible());
  await page.screenshot({path:shots+'/'+size.name+'-notebook.png',fullPage:true});
  await page.locator('#overlay .close').click();
  await page.locator('[data-action="daily"]').click();
  assert.match(await page.locator('.daily-world').innerText(),/A little learning/);
  await page.locator('[data-action="daily-maths"]').click();
  await page.locator('[data-action="beacon-next"]').click();
  await page.locator('#beacon-answer').fill('12');
  await page.locator('#beacon-form button').click();
  assert.match(await page.locator('#beacon-feedback').innerText(),/Try again/);
  await page.locator('.value-crate[data-value="400"]').click();
  assert.equal(await page.locator('#beacon-answer').inputValue(),'400');
  assert.match(await page.locator('.xp').innerText(),/\b10\s+XP\b/,'selecting a visual answer must not award XP');
  await page.locator('#beacon-form button').click();
  await page.locator('[data-action="beacon-next"]').click();
  for(let stage=2;stage<=3;stage++){
   const heading=await page.locator('.beacon-panel h2').innerText();const [,digit,formatted]=heading.match(/value of (\d) in ([\d,]+)/);
   const digits=formatted.replaceAll(',',''),value=Number(digit)*10**(digits.length-digits.indexOf(digit)-1);
   await page.locator('.value-crate[data-value="'+value+'"]').click();await page.locator('#beacon-form button').click();
   if(stage===2)await page.locator('[data-action="beacon-next"]').click();
  }
  assert.match(await page.locator('#beacon-next').innerText(),/review is scheduled/);
  assert.equal(await page.locator('.beacon-lights .lit').count(),4,'completed beacon lights all four crystals');
  assert.equal(await page.locator('.value-crate:disabled').count(),4,'a solved choice cannot be accidentally changed');
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
  await page.locator('#overlay .close').click();
  await page.getByRole('button',{name:'Adventure map',exact:true}).click();
  await page.getByRole('button',{name:'Open Number Kingdom',exact:true}).click();await page.locator('[data-action="engine-0"]').click();
  await page.locator('#math-form button').click();assert.match(await page.locator('#feedback').innerText(),/Enter an answer when/);
  await page.locator('#math-answer').fill('700');await page.locator('#math-form button').click();assert.equal(await page.locator('#math-form button').isDisabled(),true);
  await page.locator('[data-action="extension"]').click();
  for(let attempt=0;attempt<2;attempt++){await page.locator('#math-answer').fill('0');await page.locator('#math-form button').click();}
  assert.match(await page.locator('#feedback').innerText(),/8,000/);assert.doesNotMatch(await page.locator('#feedback').innerText(),/700/);
  await page.locator('#math-answer').fill('8000');await page.locator('#math-form button').click();assert.match(await page.locator('.xp').innerText(),/\b18\s+XP\b/);
  assert.equal(errors.length,0,'cross-game runtime errors: '+errors.join('; '));
  await page.route('**/assets/play/world-map-v1.webp',route=>route.abort());
  await page.goto('http://127.0.0.1:4174/adam/',{waitUntil:'domcontentloaded'});
  await page.locator('.world-site').first().waitFor();
  assert.equal(await page.locator('.world-site').count(),4,'unavailable map image must not block navigation');
  await page.getByRole('button',{name:'Open Number Kingdom',exact:true}).click();
  await page.locator('[data-action="engine-0"]').click();
  assert.ok(await page.locator('.engine-world').isVisible(),'game still works with missing artwork');
  console.log('PASS',size.name,geometry);
 }catch(e){
  failures.push(size.name+': '+e.message);
  await page.screenshot({path:shots+'/'+size.name+'-failed.png',fullPage:true}).catch(()=>{});
 }finally{await ctx.close();}
}
await browser.close();
await new Promise(r=>server.close(r));
if(failures.length)throw Error(failures.join('\n'));
