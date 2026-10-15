import {illustrationKey} from './asset-registry.js';
// Deterministic layered SVG illustrations. No network calls or paid models.
const r=(x,y,w,h,fill,rx=12,stroke='none',sw=0)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+rx+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
const c=(x,y,rad,fill,stroke='none',sw=0)=>'<circle cx="'+x+'" cy="'+y+'" r="'+rad+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
const p=(d,fill,stroke='none',sw=0)=>'<path d="'+d+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+'" stroke-linecap="round" stroke-linejoin="round"/>';
const ell=(x,y,rx,ry,fill)=>'<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="'+fill+'"/>';
function motif(key){
 const navy='#173b50', gold='#e8b95c', coral='#d77c63', paper='#fff0cc', teal='#328f88', ink='#20495b';
 const openBook=()=>'<g transform="translate(0 6)">'+p('M126 220 Q220 182 303 229 L303 348 Q211 310 126 340Z',paper,navy,7)+p('M303 229 Q393 180 482 220 L482 340 Q396 311 303 348Z','#f4dca2',navy,7)+p('M303 233 V344','none',navy,4)+p('M164 252 Q218 235 271 256 M164 277 Q218 261 271 282 M339 258 Q401 236 445 254 M339 280 Q391 265 445 283','none','#c69c69',4)+'</g>';
 switch(key){
 case 'apple': return p('M307 163 C239 104 175 173 188 255 C199 347 260 354 305 323 C356 352 422 333 432 251 C445 163 370 112 307 163Z',coral,navy,8)+p('M302 164 Q297 130 321 102','none',navy,9)+p('M320 129 Q360 94 380 118 Q356 153 320 129Z',teal,navy,5)+ell(247,210,22,47,'#ffffff33');
 case 'book': return openBook();
 case 'cat': return '<g>'+ell(310,316,140,35,'#122d3933')+ell(304,270,114,78,gold)+p('M218 236 L236 147 L274 196 M341 192 L382 146 L398 236',gold,navy,7)+c(264,247,12,navy)+c(351,247,12,navy)+p('M308 261 L298 270 L316 270Z',coral)+p('M305 274 Q294 289 282 278 M305 274 Q318 289 329 278 M240 270 L198 263 M239 284 L194 291 M370 270 L413 264 M367 284 L416 290','none',navy,5)+'</g>';
 case 'chair': return r(225,188,151,119,gold,25,navy,8)+r(209,283,180,27,coral,9,navy,7)+r(226,310,19,77,navy,6)+r(355,310,19,77,navy,6);
 case 'door':return r(212,130,202,245,navy,85,'#dcad5c',8)+r(233,153,160,221,'#397d83',77,'#f0d590',4)+c(365,280,10,gold)+p('M245 168 Q302 112 379 168','none',paper,4);
 case 'house':return p('M150 221 L308 113 L467 221Z',coral,navy,9)+r(191,219,231,148,paper,8,navy,8)+r(271,267,78,100,teal,35,navy,5)+r(215,253,44,42,'#b4dfe3',8,navy,4)+r(364,253,38,42,'#b4dfe3',8,navy,4);
 case 'school':return r(169,207,278,163,paper,8,navy,8)+p('M146 206 L305 116 L466 206Z',coral,navy,8)+r(265,259,87,111,navy,40)+r(192,241,53,60,'#a5dce0',13,navy,5)+r(365,241,53,60,'#a5dce0',13,navy,5)+c(305,181,26,gold,navy,5)+p('M305 181 L305 165 M305 181 L321 188','none',navy,4);
 case 'heart': return p('M307 350 C241 302 169 260 190 196 C209 143 273 153 307 196 C340 151 405 143 425 196 C452 260 380 302 307 350Z',coral,navy,9)+p('M222 212 Q230 185 253 185','none','#ffe5d4',11);
 case 'hands': return '<g>'+r(184,204,105,111,gold,32,navy,7)+r(323,204,105,111,teal,32,navy,7)+p('M280 283 Q306 247 337 279 L354 298 Q321 334 300 331 Z',paper,navy,7)+'</g>';
 case 'rain':return '<g>'+p('M224 257 Q194 217 227 190 Q248 164 285 174 Q312 124 367 155 Q392 174 400 196 Q458 195 456 241 Q450 274 414 274 L242 274 Q224 274 224 257Z',paper,navy,8)+p('M245 294 L226 330 M313 294 L295 341 M385 294 L368 331','none','#4ac6d2',12)+'</g>';
 case 'sun':return c(307,243,83,gold,navy,8)+p('M307 113 V91 M307 370 V392 M176 242 H150 M437 242 H464 M213 149 L193 129 M400 334 L420 354 M401 148 L420 130 M214 334 L196 354','none',gold,12)+c(278,235,7,navy)+c(333,235,7,navy)+p('M281 268 Q305 287 334 269','none',navy,6);
 case 'owl':return '<g>'+ell(304,272,104,107,gold)+p('M220 217 L212 153 L275 182 M338 183 L397 150 L393 221',gold,navy,7)+ell(263,250,43,49,paper)+ell(348,250,43,49,paper)+c(272,249,17,navy)+c(338,249,17,navy)+p('M305 273 L285 293 L322 293 Z',coral,navy,5)+p('M261 335 Q302 370 348 335','none',navy,7)+r(240,363,40,11,navy,5)+r(330,363,40,11,navy,5)+'</g>';
 case 'key':return '<g transform="rotate(-24 310 255)">'+c(245,236,48,gold,navy,10)+c(245,236,19,'#2c6979',navy,6)+r(285,223,171,27,gold,3,navy,8)+p('M392 251 V292 H414 V251 M432 250 V279 H452 V250','none',navy,10)+'</g>';
 case 'magnify':return '<g transform="rotate(-24 300 260)">'+c(273,215,90,'#80d3d255',navy,14)+c(273,215,66,'#b1e5df99','#f1d89a',5)+r(265,302,22,100,gold,8,navy,8)+p('M223 180 Q248 156 277 158','none','#ffffff88',10)+'</g>';
 case 'clock':return c(307,238,117,paper,navy,10)+c(307,238,95,'#cfebe2',navy,3)+p('M307 174 V240 L354 265','none',navy,13)+c(307,239,8,gold,navy,3)+p('M307 145 V157 M307 320 V334 M213 239 H229 M385 239 H401','none',navy,7);
 case 'speech':return p('M176 178 Q176 132 232 132 H394 Q448 132 448 188 V267 Q448 315 394 315 H309 L242 366 L254 313 H232 Q176 313 176 267Z',paper,navy,9)+p('M226 207 H398 M226 251 H360','none',teal,13);
 case 'people': return c(242,198,49,gold,navy,7)+c(366,198,49,coral,navy,7)+p('M151 354 Q152 262 235 266 Q296 275 302 354Z',teal,navy,7)+p('M309 354 Q310 262 372 266 Q453 272 466 354Z',gold,navy,7);
 case 'map':return p('M146 196 L249 162 L352 200 L463 162 V352 L354 385 L250 347 L146 385Z',paper,navy,8)+p('M250 166 V348 M352 202 V386','none','#c89b63',5)+p('M197 330 Q246 283 271 301 Q304 312 345 255 Q380 208 418 230','none',coral,7)+c(421,227,15,coral,navy,5);
 case 'thought':return c(304,229,119,paper,navy,8)+c(393,324,23,paper,navy,6)+c(428,363,13,paper,navy,4)+p('M305 153 L319 218 L288 218 L316 294','none',gold,14);
 case 'science':return '<g>'+p('M278 120 H350 M294 120 V201 L221 336 Q207 366 243 373 H382 Q416 370 399 338 L331 201 V120','none',navy,12)+p('M264 293 H359 L395 354 Q397 363 374 364 H254 Q234 364 239 350Z',teal)+c(301,332,15,gold)+c(350,311,9,paper)+c(331,283,8,coral)+'</g>';
 case 'leaf':return p('M190 330 Q173 143 406 138 Q455 296 266 333Z',teal,navy,9)+p('M237 323 Q333 253 395 173','none',paper,9)+p('M284 278 L253 213 M344 238 L365 284','none',paper,6);
 case 'stars':return p('M307 117 L338 210 L431 237 L339 268 L307 358 L277 267 L181 237 L278 209Z',gold,navy,8)+p('M454 155 L464 175 L488 185 L464 195 L454 217 L445 195 L425 185 L445 175Z',paper,navy,4);
 default:return openBook();
 }
}
export function artSvg(word, extraClass=''){
 const key=illustrationKey(word && word.art);
 const title=String(word && word.term || 'Vocabulary illustration').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
 const raw=motif(key);
 return '<svg class="wk-art '+extraClass+'" viewBox="0 0 620 430" role="img" aria-label="Illustration for '+title+'" xmlns="http://www.w3.org/2000/svg">'
 +'<defs><linearGradient id="wk-sky" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#18394d"/><stop offset=".57" stop-color="#286b75"/><stop offset="1" stop-color="#a2bda9"/></linearGradient><linearGradient id="wk-floor" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#eadcaa"/><stop offset="1" stop-color="#b49c77"/></linearGradient><filter id="wk-shadow" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="12" stdDeviation="12" flood-color="#0a2332" flood-opacity=".33"/></filter></defs>'
 +'<rect width="620" height="430" fill="url(#wk-sky)"/>'
 +'<circle cx="495" cy="100" r="98" fill="#f2ca7b" opacity=".16"/>'
 +'<path d="M0 323 Q165 272 304 323 T620 300 V430 H0Z" fill="#1c5c69" opacity=".7"/>'
 +'<rect y="367" width="620" height="63" fill="url(#wk-floor)"/>'
 +'<g opacity=".48"><circle cx="73" cy="64" r="4" fill="#f0e3bc"/><circle cx="547" cy="235" r="5" fill="#f0e3bc"/><circle cx="128" cy="154" r="3" fill="#f0e3bc"/><path d="M510 54 v25 M497 67 h26" stroke="#f5d38b" stroke-width="3"/></g>'
 +'<ellipse cx="310" cy="375" rx="170" ry="19" fill="#103a4b" opacity=".27"/>'
 +'<g class="wk-float" filter="url(#wk-shadow)">'+raw+'</g>'
 +'<path d="M14 14 H606 V416 H14Z" fill="none" stroke="#f5dc9d" stroke-width="4" opacity=".48"/>'
 +'</svg>';
}
