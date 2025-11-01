/* =========================================
   MODULE: SoundFX — Realistic Audio System
   =========================================
   (REPLACE ENTIRE MODULE WITH THIS BLOCK)
*/
const SoundFX = (() => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();

  const volumes = {
    dice: 0.6,
    caravan: 0.6,
    buy: 0.5,
    sell: 0.5,
    wait: 0.4,
    turn: 0.35
  };

  const sounds = {};

  // make filenames configurable and tolerant (lowercase fallback)
  const soundList = {
    dice: "Dice.mp3",
    caravan: "Walk.mp3",
    buy: "Ding.mp3",
    sell: "Ding.mp3",
    wait: "Pop.mp3",
    turn: "Turn.mp3" // <-- used by nextTurn()
  };

  async function loadSound(name, url) {
    try {
      // try given url, then lowercase fallback
      const tryUrls = [url, url.toLowerCase()];
      let arrayBuf = null;
      for (const u of tryUrls) {
        try {
          const res = await fetch(u);
          if (!res.ok) throw new Error("Not found");
          arrayBuf = await res.arrayBuffer();
          break;
        } catch (e) { /* continue to next try */ }
      }
      if (!arrayBuf) throw new Error(`All fetch attempts failed for ${url}`);
      const buffer = await ctx.decodeAudioData(arrayBuf);
      sounds[name] = buffer;
      console.log(`✅ Loaded sound: ${name}`);
    } catch (e) {
      console.warn(`⚠️ Failed to load ${name}:`, e);
    }
  }

  async function preloadAll() {
    const entries = Object.entries(soundList);
    for (const [name, url] of entries) await loadSound(name, url);
  }

  function ensureResume() {
    if (ctx && ctx.state === "suspended") {
      // attempt to resume; careful: user gesture required for some browsers
      ctx.resume().catch(() => {});
    }
  }

  function play(name) {
    ensureResume();
    const buffer = sounds[name];
    if (!buffer) {
      // silent fail but log for debugging
      console.warn(`🔈 Sound buffer missing for '${name}'`);
      return;
    }
    const src = ctx.createBufferSource();
    const gain = ctx.createGain();
    gain.gain.value = volumes[name] ?? 0.5;
    src.buffer = buffer;
    src.connect(gain).connect(ctx.destination);
    try { src.start(0); } catch (e) { /* ignore */ }
  }

  // 🎯 Public triggers
  function diceRoll() { play("dice"); }
  function caravanMove() { play("caravan"); }
  function buy() { play("buy"); }
  function sell() { play("sell"); }
  function wait() { play("wait"); }
  // NEW: nextTurn sound used when switching players
  function nextTurn() { play("turn"); }

  // start preloading but don't block (decode may fail if context suspended)
  preloadAll();

  return {
    ctx,
    volumes,
    diceRoll,
    caravanMove,
    buy,
    sell,
    wait,
    nextTurn // <-- exported so other modules can call it
  };
})();