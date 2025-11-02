(() => {
  // 🎯 إضافة عناصر التحكم أسفل الـ Log داخل اللوحة الجانبية
  const logSection = document.getElementById("log");
  const panel = logSection?.parentElement || document.querySelector(".panel") || document.body;

  panel.insertAdjacentHTML("beforeend", `
    <audio id="bgMusic" src="market_breeze.mp3" loop></audio>

    <div id="musicCtl">
      <button id="musicBtn" title="Mute / Unmute">🎵</button>
      <div id="musicUI">
        <input id="musicVol" type="range" min="0" max="0.5" step="0.01" value="0.25">
        <select id="musicSel">
        <option value="market_breeze.mp3" selected>🌅 Desert</option>
		<option value="halloween_theme.mp3">🎃 Halloween</option>         
	    <option value="desert_theme.mp3">🌙 Egyptian Nights</option>                
          <option value="youtube">📺 YouTube Player</option>
        </select>
      </div>
    </div>

    <!-- 🎨 Theme control below -->
    <div id="themeCtl">
      <label for="themeSel">🎨 Theme:</label>
      <select id="themeSel">
        <option value="default" selected>🏜️ Default</option>
        <option value="halloween">🎃 Halloween</option>
        <option value="night">🌙 Egyptian Nights</option>
      </select>
    </div>
  `);

  // 🌈 CSS المودرن
  const s = document.createElement("style");
  s.textContent = `
    #musicCtl {
      position: relative;
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 12px;
      padding: 8px 12px;
      width: 100%;
      border-radius: 12px;
      background: linear-gradient(145deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05));
      border: 1px solid rgba(255,255,255,0.2);
      backdrop-filter: blur(14px) saturate(180%);
      box-shadow: 0 3px 12px rgba(0,0,0,0.25);
      transition: background 0.3s, transform 0.3s;
    }
    #musicCtl:hover {
      background: linear-gradient(145deg, rgba(255,255,255,0.25), rgba(255,255,255,0.1));
      transform: translateY(-1px);
    }
    #musicBtn {
      background: radial-gradient(circle at 30% 30%, #fff8, #fff2);
      border: none;
      border-radius: 50%;
      width: 34px;
      height: 34px;
      font-size: 18px;
      cursor: pointer;
      color: #4b2e05;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform .2s, background .3s;
    }
    #musicBtn:hover {
      transform: scale(1.1);
      background: radial-gradient(circle at 30% 30%, #fff, #fffa);
    }
    #musicVol {
      width: 90px;
      accent-color: #d8b56f;
      cursor: pointer;
    }
    #musicSel {
      background: #fffdf7;
      color: #4b2e05;
      border-radius: 8px;
      border: 1px solid #e0c080;
      font-size: 12px;
      font-weight: 600;
      padding: 3px 6px;
      cursor: pointer;
    }
    #themeCtl {
      margin-top: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(145deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05));
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 10px;
      padding: 6px 10px;
      backdrop-filter: blur(14px) saturate(180%);
      box-shadow: 0 3px 12px rgba(0,0,0,0.25);
    }
    #themeCtl label {
      font-size: 12px;
      color: #4b2e05;
      font-weight: 600;
    }
    #themeSel {
      background: #fffdf7;
      color: #4b2e05;
      border-radius: 8px;
      border: 1px solid #e0c080;
      font-size: 12px;
      font-weight: 600;
      padding: 3px 6px;
      cursor: pointer;
    }
  `;
  document.head.appendChild(s);

  // 🎧 العناصر
  const m = document.getElementById("bgMusic");
  const b = document.getElementById("musicBtn");
  const v = document.getElementById("musicVol");
  const sel = document.getElementById("musicSel");
  const themeSel = document.getElementById("themeSel");
  let muted = false;

  // 🔊 تشغيل تلقائي بعد أول تفاعل
  window.addEventListener("click", function once() {
    m.volume = parseFloat(v.value);
    m.play().catch(() => {});
    window.removeEventListener("click", once);
  });

  // ▶️ تشغيل تلقائي عند الرجوع للصفحة
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && !muted) m.play().catch(() => {});
    else if (document.hidden) stopMusic();
  });

  // ⛔ إيقاف فوري عند مغادرة الصفحة
  const stopMusic = () => {
    try {
      m.pause();
      m.currentTime = 0;
    } catch (e) {}
  };
  window.addEventListener("beforeunload", stopMusic);
  window.addEventListener("pagehide", stopMusic);
  window.addEventListener("orientationchange", stopMusic);

  // 🎚️ التحكم بالصوت
  v.oninput = e => {
    const val = parseFloat(e.target.value);
    m.volume = muted ? 0 : val;
  };

  // 🔇 ميوت / تشغيل
  b.onclick = e => {
    e.stopPropagation();
    muted = !muted;
    if (muted) {
      m.volume = 0;
      b.textContent = "🔇";
    } else {
      m.volume = parseFloat(v.value);
      m.play().catch(()=>{});
      b.textContent = "🔈";
    }
  };

  // 🎼 اختيار الخلفية يدويًا
  sel.onchange = e => {
    const val = e.target.value;
    playMusic(val);
  };
// 🌓 تغيير الثيم + الصوت تلقائيًا — مُعدّل ليدعم ThemeManager
themeSel.onchange = e => {
  const val = e.target.value;

  // 1) خزّن الاختيار وحدّث كلاس الـ body (لـ CSS fallback)
  document.body.className = "";
  if (val !== "default") document.body.classList.add(val);
  localStorage.setItem("silkroadTheme", val);

  // 2) اطلب من ThemeManager تطبيق كل تغييرات الثيم (الخريطة، CSS vars، ألوان الكروت...)
  if (typeof ThemeManager !== "undefined" && typeof ThemeManager.applyTheme === "function") {
    try {
      ThemeManager.applyTheme(val);
    } catch (err) {
      console.warn("ThemeManager.applyTheme failed:", err);
    }
  } else {
    // إذا ThemeManager غير متوفر، فنفس fallback: ضع background عبر الكلاس فقط
    console.warn("ThemeManager not found; relying on CSS class only for theme visuals.");
  }

  // 3) اختر الموسيقى المناسبة للثيم
  let themeMusic = "desert_theme.mp3";
  if (val === "halloween") themeMusic = "halloween_theme.mp3";
  else if (val === "night") themeMusic = "egyptian_theme.mp3"; // ← عدّل اسم الملف إذا لزم

  // 4) حدّث اختيار الموسيقى وشغّلها
  sel.value = themeMusic;
  playMusic(themeMusic);
};

  // 🎵 دالة تشغيل الموسيقى العامة
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

  
  const savedTheme = localStorage.getItem("silkroadTheme") || "default";
themeSel.value = savedTheme;

// استخدم ThemeManager لتطبيق الثيم بالكامل عند التحميل (أفضل من مجرد تغيير كلاس)
if (typeof ThemeManager !== "undefined" && typeof ThemeManager.applyTheme === "function") {
  try {
    ThemeManager.applyTheme(savedTheme);
  } catch (err) {
    console.warn("ThemeManager.applyTheme on load failed:", err);
    if (savedTheme !== "default") document.body.classList.add(savedTheme);
  }
} else {
  if (savedTheme !== "default") document.body.classList.add(savedTheme);
}

// تشغيل موسيقى الثيم تلقائيًا عند التحميل
let initialMusic = "market_breeze.mp3";
if (savedTheme === "halloween") initialMusic = "halloween_theme.mp3";
else if (savedTheme === "night") initialMusic = "desert_theme.mp3"; // ← عدّل إذا لزم
sel.value = initialMusic;
m.src = initialMusic;
  
  
})();