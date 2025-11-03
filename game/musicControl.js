(() => {
  const logSection = document.getElementById("log");
  const panel = logSection?.parentElement || document.querySelector(".panel") || document.body;

  panel.insertAdjacentHTML("beforeend", `
  <audio id="bgMusic" src="market_breeze.mp3" loop></audio>

  <div id="controlBar">
  <div class="theme-group">
    <label for="themeSel">🎨</label>
    <select id="themeSel">
	<option value="night" selected>🌙 Egyptian Nights</option>
      <option value="default">🏜️ Default</option>
      <option value="halloween">🎃 Halloween</option>
      
    </select>
  </div>

  <div class="music-group">
    
    <input id="musicVol" type="range" min="0" max="0.5" step="0.01" value="0.25">
  </div>
<button id="musicBtn" title="Mute / Unmute">🎵</button>
  <div class="track-group">
    <select id="musicSel">
	<option value="egynights.mp3">🌙 Egyptian Nights</option>
      <option value="market_breeze.mp3" selected>🌅 Desert</option>
      <option value="halloween_theme.mp3">🎃 Halloween</option>
      
      <option value="youtube">📺 YouTube Player</option>
    </select>
  </div>
</div>
`);

  // عناصر الموسيقى
  const m = document.getElementById("bgMusic");
  const b = document.getElementById("musicBtn");
  const v = document.getElementById("musicVol");
  const sel = document.getElementById("musicSel");
  const themeSel = document.getElementById("themeSel");
  let muted = false;

  window.addEventListener("click", function once() {
    m.volume = parseFloat(v.value);
    m.play().catch(() => {});
    window.removeEventListener("click", once);
  });

  const stopMusic = () => { try { m.pause(); m.currentTime = 0; } catch (e) {} };
  window.addEventListener("beforeunload", stopMusic);
  window.addEventListener("pagehide", stopMusic);
  window.addEventListener("orientationchange", stopMusic);

  v.oninput = e => { const val = parseFloat(e.target.value); m.volume = muted ? 0 : val; };

  b.onclick = e => {
    e.stopPropagation();
    muted = !muted;
    if (muted) { m.volume = 0; b.textContent = "🔇"; }
    else { m.volume = parseFloat(v.value); m.play().catch(()=>{}); b.textContent = "🔈"; }
  };

  sel.onchange = e => playMusic(e.target.value);

  // ✅ دمج ThemeManager بشكل صحيح
  themeSel.onchange = e => {
    const val = e.target.value;

    document.body.classList.remove("default", "halloween", "night");
    if (val !== "default") document.body.classList.add(val);
    localStorage.setItem("silkroadTheme", val);

    if (typeof ThemeManager !== "undefined" && typeof ThemeManager.applyTheme === "function") {
      ThemeManager.applyTheme(val);
    }

    let themeMusic = "market_breeze.mp3";
    if (val === "halloween") themeMusic = "halloween_theme.mp3";
    else if (val === "night") themeMusic = "egynights.mp3";

    sel.value = themeMusic;
    playMusic(themeMusic);
  };

  function playMusic(src) {
    const yt = document.getElementById("ytWrapper");
    const frame = document.getElementById("ytFrame");
    if (src === "youtube") {
      if (yt) yt.style.display = "block";
      if (frame)
        frame.src = "https://www.youtube.com/embed/videoseries?list=PL4fGSI1pDJn7OjQgkZn9VsfMdxFCn4Yb5";
      m.pause();
      b.textContent = "📺";
    } else {
      if (yt) yt.style.display = "none";
      if (frame) frame.src = "";
      m.src = src;
      m.currentTime = 0;
      if (!muted) m.play().catch(() => {});
      b.textContent = muted ? "🔇" : "🎵";
    }
  }

  // تطبيق الثيم والموسيقى المحفوظين
  const savedTheme = localStorage.getItem("silkroadTheme") || "night";
  themeSel.value = savedTheme;
  if (typeof ThemeManager !== "undefined" && typeof ThemeManager.applyTheme === "function") {
    ThemeManager.applyTheme(savedTheme);
  }

  let initialMusic = "market_breeze.mp3";
  if (savedTheme === "halloween") initialMusic = "halloween_theme.mp3";
  else if (savedTheme === "night") initialMusic = "egynights.mp3";
sel.value = initialMusic;
m.src = initialMusic;

// ✅ تأكيد تطبيق الثيم فعليًا في أول تحميل
if (typeof ThemeManager !== "undefined" && typeof ThemeManager.applyTheme === "function") {
  ThemeManager.applyTheme(savedTheme);
}
})();