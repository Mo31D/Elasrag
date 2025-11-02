# Silkroad Project — Audit Report

Generated: Detailed audit of issues, duplicate code, suspicious patterns, and snippets

Files analyzed: Silkroad V1.0.0.8.html, dice3d.js, soundFX.js, musicControl.js, silkroad-style.css

---

## 1) Resize listeners / re-creation vs. resizing logic

Potential conflicts where multiple modules listen for `resize` and either recreate DOM or adjust existing elements.

**Silkroad V1.0.0.8.html** — match `addEventListener\(['\"]resize['\"]` at line 970

```js
 964:     resizeTimer = setTimeout(() => {
 965:       adjustAll();
 966:     }, 120);
 967:   }
 968: 
 969:   // Initial run and binding
 970:   window.addEventListener("resize", onResize);
 971:   // Also react to orientationchange on mobile
 972:   window.addEventListener("orientationchange", onResize);
 973: 
 974:   // Run initial adjustments after small delay to allow DOM layout
 975:   setTimeout(() => {
 976:     adjustAll();
```

**Silkroad V1.0.0.8.html** — match `scaleDiceToMap\(` at line 831

```js
 825:       p.dotEl.style.left = `${x}px`;
 826:       p.dotEl.style.top = `${y}px`;
 827:     });
 828:   }
 829: 
 830:   // Scale 3D dice wrappers that Dice3D created
 831:   function scaleDiceToMap() {
 832:     const containerDice = document.getElementById("dice3d-container");
 833:     if (!containerDice) return;
 834: 
 835:     const mapRect = mapEl.getBoundingClientRect();
 836:     const mapWidth = Math.max(180, mapRect.width); // safe fallback
 837: 
```

**Silkroad V1.0.0.8.html** — match `innerHTML\s*=\s*\"\"` at line 201

```js
 195:     this.map.appendChild(div);
 196:   },
 197: 
 198: refreshTable() {
 199:   const container = document.querySelector("#playersTableContainer");
 200:   if (!container) return;
 201:   container.innerHTML = "";
 202: 
 203:   GameState.players.forEach((p, i) => {
 204:     const avg = p.camels ? (p.totalSpent / p.camels).toFixed(1) : "-";
 205:     const wealth = (p.gold + p.camels * GameState.prices[GameState.currentTown]).toFixed(1);
 206: 
 207:     const card = document.createElement("div");
```

**dice3d.js** — match `addEventListener\(['\"]resize['\"]` at line 46

```js
  40:     sr.setAttribute("aria-hidden", "true");
  41:     root.appendChild(sr);
  42: 
  43:     // make sure wrapper sizes are consistent via CSS (styles added separately)
  44:     console.log("🎲 Dice3D initialized");
  45: 	  // 🌀 تحديث الزهر تلقائيًا عند تغيير حجم الشاشة
  46:   window.addEventListener("resize", () => {
  47:     const parent = document.getElementById("dice3d-container");
  48:     if (!parent) return;
  49: 
  50:     // امسح الزهر القديم
  51:     parent.innerHTML = "";
  52: 
```

**dice3d.js** — match `innerHTML\s*=\s*\"\"` at line 51

```js
  45: 	  // 🌀 تحديث الزهر تلقائيًا عند تغيير حجم الشاشة
  46:   window.addEventListener("resize", () => {
  47:     const parent = document.getElementById("dice3d-container");
  48:     if (!parent) return;
  49: 
  50:     // امسح الزهر القديم
  51:     parent.innerHTML = "";
  52: 
  53:     // أعد إنشاء النردين
  54:     greenDie = createDie("green");
  55:     redDie = createDie("red");
  56:     parent.appendChild(greenDie.wrapper);
  57:     parent.appendChild(redDie.wrapper);
```

---

## 2) Dice3D — single callback registration (`onRollDone`) and roll timing

**dice3d.js** — `onRollDone\(` at line 229

```js
 223:     }
 224: 
 225:     return { green: greenRoll, red: redRoll };
 226:   }
 227: 
 228:   // optionally register a callback called when the visual spin finishes
 229:   function onRollDone(cb) { onRollDoneCallback = cb; }
 230: 
 231:   return { init, rollBoth, onRollDone };
 232: })();
```

**dice3d.js** — `onRollDoneCallback` at line 9

```js
   3:    - maps numeric result -> cube rotation
   4:    - keeps random extra spins for realism
   5:    - exposes init(container) and rollBoth()
   6:    ========================================= */
   7: const Dice3D = (function () {
   8:   let greenDie = null, redDie = null; // objects { wrapper, cube }
   9:   let onRollDoneCallback = null;
  10: 
  11:   function init(container) {
  12:     if (!container) {
  13:       console.error("Dice3D.init: container not found");
  14:       return;
  15:     }
```

**dice3d.js** — `onRollDoneCallback` at line 221

```js
 215:     const redRoll = Math.floor(Math.random() * 6) + 1;
 216: 
 217:     if (greenDie && greenDie.cube) _applyRotation(greenDie.cube, greenRoll);
 218:     if (redDie && redDie.cube) _applyRotation(redDie.cube, redRoll);
 219: 
 220:     // If a callback is registered, call it after animation duration (1.2s)
 221:     if (onRollDoneCallback) {
 222:       try { setTimeout(() => onRollDoneCallback({ green: greenRoll, red: redRoll }), 1300); } catch(e) {}
 223:     }
 224: 
 225:     return { green: greenRoll, red: redRoll };
 226:   }
 227: 
```

**dice3d.js** — `onRollDoneCallback` at line 222

```js
 216: 
 217:     if (greenDie && greenDie.cube) _applyRotation(greenDie.cube, greenRoll);
 218:     if (redDie && redDie.cube) _applyRotation(redDie.cube, redRoll);
 219: 
 220:     // If a callback is registered, call it after animation duration (1.2s)
 221:     if (onRollDoneCallback) {
 222:       try { setTimeout(() => onRollDoneCallback({ green: greenRoll, red: redRoll }), 1300); } catch(e) {}
 223:     }
 224: 
 225:     return { green: greenRoll, red: redRoll };
 226:   }
 227: 
 228:   // optionally register a callback called when the visual spin finishes
```

**dice3d.js** — `onRollDoneCallback` at line 229

```js
 223:     }
 224: 
 225:     return { green: greenRoll, red: redRoll };
 226:   }
 227: 
 228:   // optionally register a callback called when the visual spin finishes
 229:   function onRollDone(cb) { onRollDoneCallback = cb; }
 230: 
 231:   return { init, rollBoth, onRollDone };
 232: })();
```

**dice3d.js** — `rollBoth\(` at line 5

```js
   1: /* =========================================
   2:    3D Dice Module — Dual Dice (Green + Red)
   3:    - maps numeric result -> cube rotation
   4:    - keeps random extra spins for realism
   5:    - exposes init(container) and rollBoth()
   6:    ========================================= */
   7: const Dice3D = (function () {
   8:   let greenDie = null, redDie = null; // objects { wrapper, cube }
   9:   let onRollDoneCallback = null;
  10: 
  11:   function init(container) {
```

**dice3d.js** — `rollBoth\(` at line 213

```js
 207:     const tx = rot.x + extraX;
 208:     const ty = rot.y + extraY;
 209:     cube.style.transform = `rotateX(${tx}deg) rotateY(${ty}deg)`;
 210:   }
 211: 
 212:   // rollBoth: apply animation and return numeric results
 213:   function rollBoth() {
 214:     const greenRoll = Math.floor(Math.random() * 6) + 1;
 215:     const redRoll = Math.floor(Math.random() * 6) + 1;
 216: 
 217:     if (greenDie && greenDie.cube) _applyRotation(greenDie.cube, greenRoll);
 218:     if (redDie && redDie.cube) _applyRotation(redDie.cube, redRoll);
 219: 
```

Notes: `onRollDone` appears to support a single callback registration (overwritable). `rollBoth` uses timeouts — see snippets above.

---

## 3) Dual dice interfaces (numeric `.die` elements vs. 3D `.dice3d-wrapper`)

**Silkroad V1.0.0.8.html** — `\.die\b` at line 858

```text
 853:       });
 854:       // if wrapper keeps a cached _diceSize, update it
 855:       if (w._diceSize) w._diceSize = size;
 856:     });
 857: 
 858:     // also scale the simple .die (numeric readouts) to not overlap
 859:     const numericDice = document.querySelectorAll(".die");
 860:     numericDice.forEach((d, idx) => {
 861:       d.style.width = `${Math.round(size * 0.9)}px`;
 862:       d.style.height = `${Math.round(size * 0.9)}px`;
 863:       d.style.lineHeight = `${Math.round(size * 0.9)}px`;
```

**Silkroad V1.0.0.8.html** — `\.dice3d-wrapper\b` at line 843

```text
 838:     // compute desired dice size in px bounded by min/max
 839:     const desired = Math.round(mapWidth * DICE_MAP_RATIO);
 840:     const size = Math.max(DICE_MIN_PX, Math.min(DICE_MAX_PX, desired));
 841: 
 842:     // apply to each wrapper (created by dice3d.createDie)
 843:     const wrappers = containerDice.querySelectorAll(".dice3d-wrapper");
 844:     wrappers.forEach(w => {
 845:       w.style.width = `${size}px`;
 846:       w.style.height = `${size}px`;
 847:       // update perspective for nicer 3d on small dice
 848:       w.style.perspective = `${Math.max(400, size * 8)}px`;
```

**dice3d.js** — `createDie\(` at line 30

```text
  25: root.style.alignItems = "center";
  26: root.style.gap = "16px";
  27: root.style.zIndex = "6000"; // يعلو فوق كل شيء آخر
  28:     container.appendChild(root);
  29: 
  30:     greenDie = createDie("green");
  31:     redDie = createDie("red");
  32: 
  33:     root.appendChild(greenDie.wrapper);
  34:     root.appendChild(redDie.wrapper);
  35: 
```

**silkroad-style.css** — `\.die\b` at line 247

```text
 242: @keyframes flash {
 243:   0% { opacity: 1; transform: scale(1); }
 244:   100% { opacity: 0.6; transform: scale(1.3); }
 245: }
 246: 
 247: .die {
 248:   width: 48px;
 249:   height: 48px;
 250:   line-height: 48px;
 251:   border-radius: 8px;
 252:   text-align: center;
```

**silkroad-style.css** — `\.dice3d-wrapper\b` at line 836

```text
 831: #musicHint { font-size: 10px !important; right: 44px !important; bottom: 18px !important; }
 832: 
 833: .dice3d-dot {
 834:   transition: transform 0.2s ease;
 835: }
 836: .dice3d-wrapper:hover .dice3d-dot {
 837:   transform: scale(1.15);
 838: }
 839: 
 840: 
 841: .dice3d-cube { transform-style: preserve-3d; -webkit-transform-style: preserve-3d; }
```

---

## 4) Implicit globals / undeclared variables

**Silkroad V1.0.0.8.html** — reference to `lastMovedTown` at line 588

```js
 582: 
 583:   setTimeout(() => {
 584:     const price = GameState.prices[GameState.currentTown];
 585:     const townName = GameState.towns[GameState.currentTown];
 586: 
 587:     // 🗺️ Log AI’s situational awareness
 588:     if (typeof lastMovedTown === "undefined") {
 589:       UI.log(`🤖 ${p.name} starts analysis at ${townName}.`);
 590:       Notifications.aiLog(`📍 Starting analysis in ${townName}.`);
 591:     } else if (lastMovedTown === GameState.currentTown) {
 592:       UI.log(`🤖 ${p.name} notices caravan still in ${townName}.`);
 593:       Notifications.aiLog(`📍 Caravan still in ${townName}.`);
 594:     }
```

**Silkroad V1.0.0.8.html** — reference to `lastMovedTown` at line 591

```js
 585:     const townName = GameState.towns[GameState.currentTown];
 586: 
 587:     // 🗺️ Log AI’s situational awareness
 588:     if (typeof lastMovedTown === "undefined") {
 589:       UI.log(`🤖 ${p.name} starts analysis at ${townName}.`);
 590:       Notifications.aiLog(`📍 Starting analysis in ${townName}.`);
 591:     } else if (lastMovedTown === GameState.currentTown) {
 592:       UI.log(`🤖 ${p.name} notices caravan still in ${townName}.`);
 593:       Notifications.aiLog(`📍 Caravan still in ${townName}.`);
 594:     }
 595: 
 596:     lastMovedTown = GameState.currentTown;
 597: 
```

**Silkroad V1.0.0.8.html** — reference to `lastMovedTown` at line 596

```js
 590:       Notifications.aiLog(`📍 Starting analysis in ${townName}.`);
 591:     } else if (lastMovedTown === GameState.currentTown) {
 592:       UI.log(`🤖 ${p.name} notices caravan still in ${townName}.`);
 593:       Notifications.aiLog(`📍 Caravan still in ${townName}.`);
 594:     }
 595: 
 596:     lastMovedTown = GameState.currentTown;
 597: 
 598:     const gold = p.gold;
 599:     const camels = p.camels;
 600: 
 601:     // 🐪 Buying strategy
 602:     if (price < 10 && gold >= price) {
```

**Silkroad V1.0.0.8.html** — possible implicit/global assignment to `src` at line 85

```js
  81: 
  82: <div id="log"></div>
  83: 
  84: <div id="ytWrapper" style="display:none; text-align:center; margin-top:10px;">
  85:   <iframe id="ytFrame" width="360" height="215"
  86:     src=""
  87:     frameborder="0"
  88:     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  89:     allowfullscreen>
```

**Silkroad V1.0.0.8.html** — possible implicit/global assignment to `frameborder` at line 86

```js
  82: <div id="log"></div>
  83: 
  84: <div id="ytWrapper" style="display:none; text-align:center; margin-top:10px;">
  85:   <iframe id="ytFrame" width="360" height="215"
  86:     src=""
  87:     frameborder="0"
  88:     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  89:     allowfullscreen>
  90:   </iframe>
```

**Silkroad V1.0.0.8.html** — possible implicit/global assignment to `allow` at line 87

```js
  83: 
  84: <div id="ytWrapper" style="display:none; text-align:center; margin-top:10px;">
  85:   <iframe id="ytFrame" width="360" height="215"
  86:     src=""
  87:     frameborder="0"
  88:     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  89:     allowfullscreen>
  90:   </iframe>
  91: </div>
```

**Silkroad V1.0.0.8.html** — possible implicit/global assignment to `usedGreen` at line 393

```js
 389: 
 390:   if (currentPrice === 1) {
 391:     usedRed = false;
 392:     UI.log("ℹ️ Bottom city: ignoring RED die.");
 393:   } else if (currentPrice === 100) {
 394:     usedGreen = false;
 395:     UI.log("ℹ️ Top city: ignoring GREEN die.");
 396:   }
 397: 
```

**Silkroad V1.0.0.8.html** — possible implicit/global assignment to `diff` at line 404

```js
 400: 
 401:   if (usedGreen && !usedRed) {
 402:     diff = g;
 403:     direction = "green-only";
 404:   } else if (!usedGreen && usedRed) {
 405:     diff = r;
 406:     direction = "red-only";
 407:   } else if (usedGreen && usedRed) {
 408:     if (g > r) { diff = g - r; direction = "up"; }
```

**Silkroad V1.0.0.8.html** — possible implicit/global assignment to `direction` at line 405

```js
 401:   if (usedGreen && !usedRed) {
 402:     diff = g;
 403:     direction = "green-only";
 404:   } else if (!usedGreen && usedRed) {
 405:     diff = r;
 406:     direction = "red-only";
 407:   } else if (usedGreen && usedRed) {
 408:     if (g > r) { diff = g - r; direction = "up"; }
 409:     else if (r > g) { diff = r - g; direction = "down"; }
```

**Silkroad V1.0.0.8.html** — possible implicit/global assignment to `newIndex` at line 429

```js
 425: 
 426:   const prevIndex = GameState.currentTown;
 427:   let newIndex = prevIndex;
 428: 
 429:   if (direction === "green-only" || direction === "up")
 430:     newIndex = Math.min(GameState.towns.length - 1, prevIndex + diff);
 431:   else if (direction === "red-only" || direction === "down")
 432:     newIndex = Math.max(0, prevIndex - diff);
 433: 
```

**Silkroad V1.0.0.8.html** — possible implicit/global assignment to `newIndex` at line 431

```js
 427:   let newIndex = prevIndex;
 428: 
 429:   if (direction === "green-only" || direction === "up")
 430:     newIndex = Math.min(GameState.towns.length - 1, prevIndex + diff);
 431:   else if (direction === "red-only" || direction === "down")
 432:     newIndex = Math.max(0, prevIndex - diff);
 433: 
 434:   GameState.currentTown = newIndex;
 435:   const newTown = GameState.towns[newIndex];
```

**Silkroad V1.0.0.8.html** — possible implicit/global assignment to `actionsTaken` at line 456

```js
 452:     playerActed() {
 453:       actionsTaken++;
 454:       UI.log(`✅ Action registered (${actionsTaken}/${GameState.players.length})`);
 455: 
 456:       if (actionsTaken >= GameState.players.length) {
 457:         actionsTaken = 0;
 458:         roundNumber++;
 459:         UI.log(`🔔 All players acted — rolling dice for round ${roundNumber}`);
 460:         setTimeout(() => rollValidDice(), 600);
```

**Silkroad V1.0.0.8.html** — possible implicit/global assignment to `n` at line 624

```js
 620:         n = camels;
 621:         PlayerActions.sell(p, n);
 622:         UI.log(`🤖 ${p.name} sees premium prices! Selling ALL camels at $${price}.`);
 623:         Notifications.aiLog(`💎 Premium market ($${price}) — sold ALL ${n} camels.`);
 624:       } else if (profitRatio >= 1.2) {
 625:         n = Math.ceil(camels * 0.6);
 626:         PlayerActions.sell(p, n);
 627:         UI.log(`🤖 ${p.name} takes profits and sells ${n} camels at $${price}.`);
 628:         Notifications.aiLog(`💰 Profitable market — sold ${n} camels.`);
```

**Silkroad V1.0.0.8.html** — possible implicit/global assignment to `n` at line 629

```js
 625:         n = Math.ceil(camels * 0.6);
 626:         PlayerActions.sell(p, n);
 627:         UI.log(`🤖 ${p.name} takes profits and sells ${n} camels at $${price}.`);
 628:         Notifications.aiLog(`💰 Profitable market — sold ${n} camels.`);
 629:       } else {
 630:         n = Math.ceil(camels * 0.3);
 631:         PlayerActions.sell(p, n);
 632:         UI.log(`🤖 ${p.name} sells ${n} camels cautiously at $${price}.`);
 633:         Notifications.aiLog(`⚖️ Mild profit — sold ${n} camels cautiously.`);
```

**Silkroad V1.0.0.8.html** — possible implicit/global assignment to `el` at line 664

```js
 660:   let hideTimer = null;
 661: 
 662:   // 🧱 Ensure notification element exists
 663:   function ensure() {
 664:     if (el) return;
 665:     el = document.createElement("div");
 666:     el.id = "smart-notif";
 667:     el.setAttribute("role", "status");
 668:     el.setAttribute("aria-live", "polite");
```

**Silkroad V1.0.0.8.html** — possible implicit/global assignment to `showing` at line 747

```js
 743:       displayNow(msg, duration, sound);
 744:     }
 745:   }
 746: 
 747:   function displayNow(msg, duration, sound) {
 748:     showing = true;
 749:     el.textContent = msg;
 750:     el.classList.add("visible");
 751:     if (sound) playChime();
```

**Silkroad V1.0.0.8.html** — possible implicit/global assignment to `hideTimer` at line 751

```js
 747:   function displayNow(msg, duration, sound) {
 748:     showing = true;
 749:     el.textContent = msg;
 750:     el.classList.add("visible");
 751:     if (sound) playChime();
 752: 
 753:     hideTimer = setTimeout(() => {
 754:       el.classList.remove("visible");
 755:       setTimeout(() => {
```

**Silkroad V1.0.0.8.html** — possible implicit/global assignment to `showing` at line 756

```js
 752: 
 753:     hideTimer = setTimeout(() => {
 754:       el.classList.remove("visible");
 755:       setTimeout(() => {
 756:         el.textContent = "";
 757:         showing = false;
 758:       }, 300);
 759:     }, duration);
 760:   }
```

**Silkroad V1.0.0.8.html** — possible implicit/global assignment to `aiBuffer` at line 770

```js
 766:       aiBuffer += line.trim().replace(/\s+/g, " ");
 767:       if (aiBuffer.length > 160) aiBuffer = aiBuffer.slice(0, 157) + "…";
 768:     }
 769:     if (done && aiBuffer) {
 770:       show(aiBuffer, { level: "good", duration: 5200 });
 771:       aiBuffer = "";
 772:     }
 773:   }
 774: 
```

**Silkroad V1.0.0.8.html** — possible implicit/global assignment to `resizeTimer` at line 963

```js
 959:   }
 960: 
 961:   // Debounced resize to avoid thrashing
 962:   function onResize() {
 963:     clearTimeout(resizeTimer);
 964:     resizeTimer = setTimeout(() => {
 965:       adjustAll();
 966:     }, 120);
 967:   }
```

---

## 5) Audio handling: AudioContext, preload & decoding behavior

**soundFX.js** — `AudioContext` at line 7

```js
   1: /* =========================================
   2:    MODULE: SoundFX — Realistic Audio System
   3:    =========================================
   4:    (REPLACE ENTIRE MODULE WITH THIS BLOCK)
   5: */
   6: const SoundFX = (() => {
   7:   const ctx = new (window.AudioContext || window.webkitAudioContext)();
   8: 
   9:   const volumes = {
  10:     dice: 0.6,
  11:     caravan: 0.6,
  12:     buy: 0.5,
  13:     sell: 0.5,
```

**soundFX.js** — `AudioContext` at line 7

```js
   1: /* =========================================
   2:    MODULE: SoundFX — Realistic Audio System
   3:    =========================================
   4:    (REPLACE ENTIRE MODULE WITH THIS BLOCK)
   5: */
   6: const SoundFX = (() => {
   7:   const ctx = new (window.AudioContext || window.webkitAudioContext)();
   8: 
   9:   const volumes = {
  10:     dice: 0.6,
  11:     caravan: 0.6,
  12:     buy: 0.5,
  13:     sell: 0.5,
```

**soundFX.js** — `decodeAudioData` at line 44

```js
  38:           if (!res.ok) throw new Error("Not found");
  39:           arrayBuf = await res.arrayBuffer();
  40:           break;
  41:         } catch (e) { /* continue to next try */ }
  42:       }
  43:       if (!arrayBuf) throw new Error(`All fetch attempts failed for ${url}`);
  44:       const buffer = await ctx.decodeAudioData(arrayBuf);
  45:       sounds[name] = buffer;
  46:       console.log(`✅ Loaded sound: ${name}`);
  47:     } catch (e) {
  48:       console.warn(`⚠️ Failed to load ${name}:`, e);
  49:     }
  50:   }
```

**soundFX.js** — `preloadAll\(` at line 52

```js
  46:       console.log(`✅ Loaded sound: ${name}`);
  47:     } catch (e) {
  48:       console.warn(`⚠️ Failed to load ${name}:`, e);
  49:     }
  50:   }
  51: 
  52:   async function preloadAll() {
  53:     const entries = Object.entries(soundList);
  54:     for (const [name, url] of entries) await loadSound(name, url);
  55:   }
  56: 
  57:   function ensureResume() {
  58:     if (ctx && ctx.state === "suspended") {
```

**soundFX.js** — `preloadAll\(` at line 90

```js
  84:   function sell() { play("sell"); }
  85:   function wait() { play("wait"); }
  86:   // NEW: nextTurn sound used when switching players
  87:   function nextTurn() { play("turn"); }
  88: 
  89:   // start preloading but don't block (decode may fail if context suspended)
  90:   preloadAll();
  91: 
  92:   return {
  93:     ctx,
  94:     volumes,
  95:     diceRoll,
  96:     caravanMove,
```

**soundFX.js** — `ensureResume\(` at line 57

```js
  51: 
  52:   async function preloadAll() {
  53:     const entries = Object.entries(soundList);
  54:     for (const [name, url] of entries) await loadSound(name, url);
  55:   }
  56: 
  57:   function ensureResume() {
  58:     if (ctx && ctx.state === "suspended") {
  59:       // attempt to resume; careful: user gesture required for some browsers
  60:       ctx.resume().catch(() => {});
  61:     }
  62:   }
  63: 
```

**soundFX.js** — `ensureResume\(` at line 65

```js
  59:       // attempt to resume; careful: user gesture required for some browsers
  60:       ctx.resume().catch(() => {});
  61:     }
  62:   }
  63: 
  64:   function play(name) {
  65:     ensureResume();
  66:     const buffer = sounds[name];
  67:     if (!buffer) {
  68:       // silent fail but log for debugging
  69:       console.warn(`🔈 Sound buffer missing for '${name}'`);
  70:       return;
  71:     }
```

Notes: `preloadAll`/`decodeAudioData` invoked early may run before user gesture; `ensureResume` exists but fetch/decode may already have been attempted.

---

## 6) CSS duplicates, repeated `@keyframes`, and `!important` usage

Keyframes name `dotFlash` appears 2 times in silkroad-style.css

```css
 163:   transition: left 1s linear, top 1s linear;
 164: }
 165: 
 166: 
 167: 
 168: @keyframes dotFlash {
 169:   0% {
 170:     box-shadow: 0 0 6px 2px currentColor, 0 0 10px rgba(255,255,255,0.6);
 171:     transform: scale(1);
 172:   }
 173:   100% {
```

```css
 357: 
 358: .player-dot.active {
 359:   box-shadow: 0 0 10px currentColor, 0 0 20px currentColor;
 360: }
 361: 
 362: @keyframes dotFlash {
 363:   0% {
 364:     box-shadow: 0 0 6px 2px currentColor, 0 0 10px rgba(255,255,255,0.6);
 365:     transform: scale(1);
 366:   }
 367:   100% {
```

Keyframes name `blink` appears 2 times in silkroad-style.css

```css
 216: #turnBanner {
 217:   text-align:center; padding:8px; background:#ffe599;
 218:   border-radius:6px; font-weight:700; color:#5b3a00;
 219:   animation: blink 2s infinite;
 220: }
 221: @keyframes blink {0%,100%{opacity:1;}50%{opacity:0.6;}}
 222: 
 223: /* Small colored dot beside player name */
 224: .player-dot-inline {
 225:   display: inline-block;
 226:   width: 12px;
```

```css
 454: .turn-status {
 455:   font-size: 12px;
 456:   color: var(--gold);
 457:   animation: blink 1.2s infinite;
 458: }
 459: @keyframes blink {
 460:   0%,100%{opacity:1;}50%{opacity:0.4;}
 461: }
 462: 
 463: .player-divider {
 464:   border: none;
```

**silkroad-style.css** — `!important` used at line 733

```css
 729: 
 730: /* 🏕️ Ensure Caravan Entry panel stays above towns and map dots */
 731: .login-floating,
 732: .after-start-floating {
 733:   position: absolute !important;
 734:   z-index: 12000 !important;
 735: }
 736: 
 737: /* Layer hierarchy */
```

**silkroad-style.css** — `!important` used at line 734

```css
 730: /* 🏕️ Ensure Caravan Entry panel stays above towns and map dots */
 731: .login-floating,
 732: .after-start-floating {
 733:   position: absolute !important;
 734:   z-index: 12000 !important;
 735: }
 736: 
 737: /* Layer hierarchy */
 738: .map { z-index: 1000; }
```

**silkroad-style.css** — `!important` used at line 806

```css
 802:   50% { box-shadow: 0 0 12px currentColor; opacity: 0.7; }
 803: }
 804: /* compact music control for small screens */
 805: #musicCtl.compact-music, #musicCtl.compact-music #musicBtn {
 806:   width: 36px !important;
 807:   height: 36px !important;
 808:   padding: 4px !important;
 809:   font-size: 14px !important;
 810: }
```

**silkroad-style.css** — `!important` used at line 807

```css
 803: }
 804: /* compact music control for small screens */
 805: #musicCtl.compact-music, #musicCtl.compact-music #musicBtn {
 806:   width: 36px !important;
 807:   height: 36px !important;
 808:   padding: 4px !important;
 809:   font-size: 14px !important;
 810: }
 811: #musicCtl.compact-music #musicUI { display:none !important; }
```

**silkroad-style.css** — `!important` used at line 808

```css
 804: /* compact music control for small screens */
 805: #musicCtl.compact-music, #musicCtl.compact-music #musicBtn {
 806:   width: 36px !important;
 807:   height: 36px !important;
 808:   padding: 4px !important;
 809:   font-size: 14px !important;
 810: }
 811: #musicCtl.compact-music #musicUI { display:none !important; }
 812: 
```

**silkroad-style.css** — `!important` used at line 809

```css
 805: #musicCtl.compact-music, #musicCtl.compact-music #musicBtn {
 806:   width: 36px !important;
 807:   height: 36px !important;
 808:   padding: 4px !important;
 809:   font-size: 14px !important;
 810: }
 811: #musicCtl.compact-music #musicUI { display:none !important; }
 812: 
 813: /* collapsed sidebar styling (mobile) */
```

**silkroad-style.css** — `!important` used at line 811

```css
 807:   height: 36px !important;
 808:   padding: 4px !important;
 809:   font-size: 14px !important;
 810: }
 811: #musicCtl.compact-music #musicUI { display:none !important; }
 812: 
 813: /* collapsed sidebar styling (mobile) */
 814: .sidebar.sidebar-collapsed {
 815:   width: 220px !important;
```

**silkroad-style.css** — `!important` used at line 815

```css
 811: #musicCtl.compact-music #musicUI { display:none !important; }
 812: 
 813: /* collapsed sidebar styling (mobile) */
 814: .sidebar.sidebar-collapsed {
 815:   width: 220px !important;
 816:   padding: 8px !important;
 817:   font-size: 13px;
 818:   box-shadow: 0 6px 18px rgba(0,0,0,0.18);
 819: }
```

**silkroad-style.css** — `!important` used at line 816

```css
 812: 
 813: /* collapsed sidebar styling (mobile) */
 814: .sidebar.sidebar-collapsed {
 815:   width: 220px !important;
 816:   padding: 8px !important;
 817:   font-size: 13px;
 818:   box-shadow: 0 6px 18px rgba(0,0,0,0.18);
 819: }
 820: 
```

**silkroad-style.css** — `!important` used at line 831

```css
 827: }
 828: 
 829: 
 830: /* reduce music hint size on small screens */
 831: #musicHint { font-size: 10px !important; right: 44px !important; bottom: 18px !important; }
 832: 
 833: .dice3d-dot {
 834:   transition: transform 0.2s ease;
 835: }
```

**silkroad-style.css** — `!important` used at line 831

```css
 827: }
 828: 
 829: 
 830: /* reduce music hint size on small screens */
 831: #musicHint { font-size: 10px !important; right: 44px !important; bottom: 18px !important; }
 832: 
 833: .dice3d-dot {
 834:   transition: transform 0.2s ease;
 835: }
```

**silkroad-style.css** — `!important` used at line 831

```css
 827: }
 828: 
 829: 
 830: /* reduce music hint size on small screens */
 831: #musicHint { font-size: 10px !important; right: 44px !important; bottom: 18px !important; }
 832: 
 833: .dice3d-dot {
 834:   transition: transform 0.2s ease;
 835: }
```

**silkroad-style.css** — `!important` used at line 846

```css
 842: .dice3d-face {
 843:   box-sizing: border-box;
 844:   -webkit-backface-visibility: hidden;
 845:   backface-visibility: hidden;
 846:   border: none !important;
 847:   box-shadow: none !important;
 848: }
 849: 
 850: /* dots minor transitions */
```

**silkroad-style.css** — `!important` used at line 847

```css
 843:   box-sizing: border-box;
 844:   -webkit-backface-visibility: hidden;
 845:   backface-visibility: hidden;
 846:   border: none !important;
 847:   box-shadow: none !important;
 848: }
 849: 
 850: /* dots minor transitions */
 851: .dice3d-dot { transition: transform .12s ease; }
```

**silkroad-style.css** — `!important` used at line 863

```css
 859:   height: auto;
 860:   -webkit-transform-style: preserve-3d;
 861:   transform-style: preserve-3d;
 862:   perspective: 800px;
 863:   border: none !important;
 864:   box-shadow: none !important;
 865:   max-width: none !important;
 866:   max-height: none !important;
 867:   user-select: none;
```

**silkroad-style.css** — `!important` used at line 864

```css
 860:   -webkit-transform-style: preserve-3d;
 861:   transform-style: preserve-3d;
 862:   perspective: 800px;
 863:   border: none !important;
 864:   box-shadow: none !important;
 865:   max-width: none !important;
 866:   max-height: none !important;
 867:   user-select: none;
 868:   touch-action: manipulation;
```

**silkroad-style.css** — `!important` used at line 865

```css
 861:   transform-style: preserve-3d;
 862:   perspective: 800px;
 863:   border: none !important;
 864:   box-shadow: none !important;
 865:   max-width: none !important;
 866:   max-height: none !important;
 867:   user-select: none;
 868:   touch-action: manipulation;
 869: }
```

**silkroad-style.css** — `!important` used at line 866

```css
 862:   perspective: 800px;
 863:   border: none !important;
 864:   box-shadow: none !important;
 865:   max-width: none !important;
 866:   max-height: none !important;
 867:   user-select: none;
 868:   touch-action: manipulation;
 869: }
```

Selector `\.player-header\b` appears 2 times in CSS.

```css
 321:   filter: none;
 322:   animation: playerGlow 1.6s ease-in-out infinite alternate;
 323: }
 324: 
 325: .player-header {
 326:   display: flex;
 327:   align-items: center;
 328:   justify-content: space-between;
 329:   margin-bottom: 6px;
```

```css
 441: /* =======================
 442:    🧍 Enhanced Player Card Layout
 443:    ======================= */
 444: 
 445: .player-header {
 446:   display: flex;
 447:   align-items: center;
 448:   justify-content: space-between;
 449:   font-weight: 700;
```

Selector `\.hidden-panel\b` appears 3 times in CSS.

```css
  84: .login-panel .reset {
  85:   background: linear-gradient(90deg, #ff4d4d, #b30000);
  86:   color: #fff;
  87: }
  88: .hidden-panel { opacity: 0; transform: scale(0.9); pointer-events: none; }
  89: 
  90: 
  91: /* =============================
  92:    🗺️ Town Nodes (Swapped Layout)
```

```css
 552: }
 553: .after-start-floating button.primary:hover {
 554:   transform: scale(1.05);
 555: }
 556: .hidden-panel {
 557:   opacity: 0;
 558:   transform: scale(0.85);
 559:   pointer-events: none;
 560: }
```

```css
 636:   width: 100%;
 637:   margin-top: 4px;
 638: }
 639: 
 640: .hidden-panel {
 641:   opacity: 0;
 642:   transform: scale(0.85);
 643:   pointer-events: none;
 644: }
```

Selector `\.dice3d-wrapper\b` appears 4 times in CSS.

```css
 832: 
 833: .dice3d-dot {
 834:   transition: transform 0.2s ease;
 835: }
 836: .dice3d-wrapper:hover .dice3d-dot {
 837:   transform: scale(1.15);
 838: }
 839: 
 840: 
```

```css
 848: }
 849: 
 850: /* dots minor transitions */
 851: .dice3d-dot { transition: transform .12s ease; }
 852: .dice3d-wrapper:active .dice3d-dot,
 853: .dice3d-wrapper:hover .dice3d-dot { transform: scale(1.08); }
 854: 
 855: .dice3d-wrapper {
 856:   display: block;
```

```css
 849: 
 850: /* dots minor transitions */
 851: .dice3d-dot { transition: transform .12s ease; }
 852: .dice3d-wrapper:active .dice3d-dot,
 853: .dice3d-wrapper:hover .dice3d-dot { transform: scale(1.08); }
 854: 
 855: .dice3d-wrapper {
 856:   display: block;
 857:   position: relative;
```

Selector `\.die\b` appears 4 times in CSS.

```css
 243:   0% { opacity: 1; transform: scale(1); }
 244:   100% { opacity: 0.6; transform: scale(1.3); }
 245: }
 246: 
 247: .die {
 248:   width: 48px;
 249:   height: 48px;
 250:   line-height: 48px;
 251:   border-radius: 8px;
```

```css
 259:   transition: transform 0.3s;
 260: }
 261: #greenDie { left: 50px; background: #4caf50; }
 262: #redDie { left: 110px; background: #f44336; }
 263: .die.roll { transform: scale(1.2) rotate(10deg); }
 264: 
 265: #currentTownText {
 266:   font-size: 16px;
 267:   font-weight: 600;
```

```css
 817:   font-size: 13px;
 818:   box-shadow: 0 6px 18px rgba(0,0,0,0.18);
 819: }
 820: 
 821: /* ensure numeric .die behaves well when resized */
 822: .die {
 823:   border-radius: 8px;
 824:   padding: 0 4px;
 825:   box-sizing: border-box;
```

Selector `\.floating-dice\b` appears 6 times in CSS.

```css
 644: }
 645: /* =========================================
 646:    🎲 Floating 3D Dice (middle-left on map)
 647:    ========================================= */
 648: .floating-dice {
 649:   position: absolute;
 650:   top: 50%;
 651:   left: 20px;
 652:   transform: translateY(-50%);
```

```css
 661:   box-shadow: none;
 662:   padding: 0;
 663: }
 664: 
 665: .floating-dice .dice {
 666:   width: 58px;
 667:   height: 58px;
 668:   border-radius: 12px;
 669:   font-size: 26px;
```

```css
 681:   transform-style: preserve-3d;
 682:   perspective: 600px;
 683: }
 684: 
 685: .floating-dice .dice.green {
 686:   background: radial-gradient(circle at 30% 30%, #a8ff9f, #009b00);
 687:   border: 2px solid #007f00;
 688: }
 689: 
```

---

## 7) console.log / debug traces left in production files

**dice3d.js** — `console.log` at line 44

```js
  40:     sr.setAttribute("aria-hidden", "true");
  41:     root.appendChild(sr);
  42: 
  43:     // make sure wrapper sizes are consistent via CSS (styles added separately)
  44:     console.log("🎲 Dice3D initialized");
  45: 	  // 🌀 تحديث الزهر تلقائيًا عند تغيير حجم الشاشة
  46:   window.addEventListener("resize", () => {
  47:     const parent = document.getElementById("dice3d-container");
  48:     if (!parent) return;
```

**soundFX.js** — `console.log` at line 46

```js
  42:       }
  43:       if (!arrayBuf) throw new Error(`All fetch attempts failed for ${url}`);
  44:       const buffer = await ctx.decodeAudioData(arrayBuf);
  45:       sounds[name] = buffer;
  46:       console.log(`✅ Loaded sound: ${name}`);
  47:     } catch (e) {
  48:       console.warn(`⚠️ Failed to load ${name}:`, e);
  49:     }
  50:   }
```

---

## 8) Dice size / dot size calculations in multiple places

**dice3d.js** — `dotSize` at line 107

```js
 103:   const offsetFix = 0.6; // مقدار تصحيح بسيط يقلل ظهور الشقوق
 104:   const translateZ = Math.max(1, half - offsetFix);
 105: 
 106:   // حجم النقطة: نطاق أصغر يناسب الهواتف (1.5px → 4.5px تقريبًا)
 107:   const dotSize = Math.max(3, Math.min(10, diceSize * 0.12));
 108:   const dotOffset = dotSize / 2;
 109: 
 110:   // Helper: create a face with correct visual settings
 111:   function makeFace(transformStr) {
```

**dice3d.js** — `diceSize` at line 71

```js
  67:   // حساب الحجم اعتمادًا على عرض الخريطة (أكثر ثباتًا من عرض الشاشة)
  68:   const mapEl = document.querySelector(".map");
  69:   const mapWidth = mapEl ? mapEl.getBoundingClientRect().width : window.innerWidth;
  70:   // معامل أصغر قليلاً للحفاظ على قابلية العرض على الهواتف الطولية
  71:   const diceSize = Math.round(Math.max(34, Math.min(96, mapWidth * 0.082)));
  72: 
  73:   // خصائص التغليف والتصيير الثلاثي الأبعاد
  74:   wrapper.style.width = `${diceSize}px`;
  75:   wrapper.style.height = `${diceSize}px`;
```

**dice3d.js** — `Math\.max\(` at line 71

```js
  67:   // حساب الحجم اعتمادًا على عرض الخريطة (أكثر ثباتًا من عرض الشاشة)
  68:   const mapEl = document.querySelector(".map");
  69:   const mapWidth = mapEl ? mapEl.getBoundingClientRect().width : window.innerWidth;
  70:   // معامل أصغر قليلاً للحفاظ على قابلية العرض على الهواتف الطولية
  71:   const diceSize = Math.round(Math.max(34, Math.min(96, mapWidth * 0.082)));
  72: 
  73:   // خصائص التغليف والتصيير الثلاثي الأبعاد
  74:   wrapper.style.width = `${diceSize}px`;
  75:   wrapper.style.height = `${diceSize}px`;
```

**dice3d.js** — `Math\.min\(` at line 71

```js
  67:   // حساب الحجم اعتمادًا على عرض الخريطة (أكثر ثباتًا من عرض الشاشة)
  68:   const mapEl = document.querySelector(".map");
  69:   const mapWidth = mapEl ? mapEl.getBoundingClientRect().width : window.innerWidth;
  70:   // معامل أصغر قليلاً للحفاظ على قابلية العرض على الهواتف الطولية
  71:   const diceSize = Math.round(Math.max(34, Math.min(96, mapWidth * 0.082)));
  72: 
  73:   // خصائص التغليف والتصيير الثلاثي الأبعاد
  74:   wrapper.style.width = `${diceSize}px`;
  75:   wrapper.style.height = `${diceSize}px`;
```

**Silkroad V1.0.0.8.html** — `diceSize` at line 854

```js
 850:       const faces = w.querySelectorAll(".dice3d-face");
 851:       faces.forEach(f => {
 852:         f.style.borderRadius = Math.max(6, Math.round(size * 0.12)) + "px";
 853:       });
 854:       // if wrapper keeps a cached _diceSize, update it
 855:       if (w._diceSize) w._diceSize = size;
 856:     });
 857: 
 858:     // also scale the simple .die (numeric readouts) to not overlap
```

**Silkroad V1.0.0.8.html** — `Math\.max\(` at line 187

```js
 183: 
 184:     // إحداثيات
 185:     if (this.townCoords && this.townCoords[index]) {
 186:       let [x, y] = this.townCoords[index];
 187:       x = Math.max(0, Math.min(100, x));
 188:       y = Math.max(0, Math.min(100, y));
 189:       div.style.left = x + "%";
 190:       div.style.top = y + "%";
 191:     }
```

**Silkroad V1.0.0.8.html** — `Math\.min\(` at line 187

```js
 183: 
 184:     // إحداثيات
 185:     if (this.townCoords && this.townCoords[index]) {
 186:       let [x, y] = this.townCoords[index];
 187:       x = Math.max(0, Math.min(100, x));
 188:       y = Math.max(0, Math.min(100, y));
 189:       div.style.left = x + "%";
 190:       div.style.top = y + "%";
 191:     }
```

---

## 9) musicControl.js inserts HTML + style dynamically (possible duplication vs stylesheet)

**musicControl.js** — `insertAdjacentHTML` at line 3

```js
   1: (() => {
   2:   const map = document.querySelector(".map") || document.body;
   3:   map.insertAdjacentHTML("beforeend", `
   4:     <small id="musicHint" style="position:absolute;right:54px;bottom:22px;color:#fff;font-size:11px;opacity:0.6;">🔊 Click to start music</small>
   5:     <audio id="bgMusic" src="desert_theme.mp3" loop></audio>
   6:     <div id="musicCtl">
   7:       <button id="musicBtn">🎵</button>
   8:       <div id="musicUI">
   9:         <input id="musicVol" type="range" min="0" max="1" step="0.01" value="0.25">
```

**musicControl.js** — `appendChild\(` at line 72

```js
  66:       padding: 2px 4px;
  67:       cursor: pointer;
  68:     }
  69:     #musicCtl.open { width: 208px; padding: 4px 10px; }
  70:     #musicCtl.open #musicUI { opacity: 1; }
  71:   `;
  72:   document.head.appendChild(s);
  73: 
  74:   const m = document.getElementById("bgMusic");
  75:   const b = document.getElementById("musicBtn");
  76:   const v = document.getElementById("musicVol");
  77:   const sel = document.getElementById("musicSel");
  78:   const box = document.getElementById("musicCtl");
```

---

## Summary / counts

- Files scanned: 5

- Keyframes duplicates found: 2

- Files that contain `addEventListener('resize')` or `scaleDiceToMap`:

  - Silkroad V1.0.0.8.html

  - dice3d.js

- Files with `console.log`: 2



---

End of report. Use this Markdown as a printable checklist for refactoring and creating the final 10/10 export.
