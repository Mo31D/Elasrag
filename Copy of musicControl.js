(() => {
  const map = document.querySelector(".map") || document.body;
  map.insertAdjacentHTML("beforeend", `
    <small id="musicHint" style="position:absolute;right:54px;bottom:22px;color:#fff;font-size:11px;opacity:0.6;">🔊 Click to start music</small>
    <audio id="bgMusic" src="desert_theme.mp3" loop></audio>
    <div id="musicCtl">
      <button id="musicBtn">🎵</button>
      <div id="musicUI">
        <input id="musicVol" type="range" min="0" max="1" step="0.01" value="0.25">
        <select id="musicSel">
		  <option value="market_breeze.mp3">🏜️ Market</option>
          <option value="desert_theme.mp3">🌅 Desert</option>
          <option value="night_caravan.mp3">🌙 Night</option>
          <option value="youtube">📺 YouTube Player</option>
        </select>
      </div>
    </div>
  `);

  const s = document.createElement("style");
  s.textContent = `
    #musicCtl {
      position: absolute;
      right: 14px;
      bottom: 12px;
      z-index: 1800;
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(255,255,255,0.08);
      backdrop-filter: blur(12px) saturate(180%);
      border: 1px solid rgba(255,255,255,0.25);
      border-radius: 30px;
      padding: 4px 8px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.25);
      width: 38px;
      transition: .3s width .4s ease;
    }
    #musicBtn {
      background: rgba(255,255,255,0.15);
      border: none;
      border-radius: 50%;
      width: 29px;
      height: 29px;
      font-size: 15px;
      color: #3a2500;
      cursor: pointer;
      transition: transform .2s;
    }
    #musicBtn:hover { transform: scale(1.1); }
    #musicUI {
      display: flex;
      align-items: center;
      gap: 6px;
      opacity: 0;
      transition: opacity .3s;
    }
    #musicVol { width: 64px; cursor: pointer; }
    #musicSel {
      background: #fffdf7;
      color: #4b2e05;
      border-radius: 6px;
      border: 1px solid #e0c080;
      font-size: 11px;
      font-weight: 600;
      padding: 2px 4px;
      cursor: pointer;
    }
    #musicCtl.open { width: 208px; padding: 4px 10px; }
    #musicCtl.open #musicUI { opacity: 1; }
  `;
  document.head.appendChild(s);

  const m = document.getElementById("bgMusic");
  const b = document.getElementById("musicBtn");
  const v = document.getElementById("musicVol");
  const sel = document.getElementById("musicSel");
  const box = document.getElementById("musicCtl");
  let open = false;

  window.addEventListener("click", function once() {
    m.volume = 0.03;
    m.play().catch(() => {});
    const hint = document.getElementById("musicHint");
    if (hint) hint.remove();
    this.removeEventListener("click", once);
  });

  b.onclick = e => {
    e.stopPropagation();
    if (open) {
      if (m.paused) {
        m.play();
        b.textContent = "🔈";
      } else {
        m.pause();
        b.textContent = "🔇";
      }
    }
    open = !open;
    box.classList.toggle("open", open);
  };

  v.oninput = e => m.volume = e.target.value;

  sel.onchange = e => {
    const val = e.target.value;
    const yt = document.getElementById("ytWrapper");
    const frame = document.getElementById("ytFrame");
    if (val === "youtube") {
      yt.style.display = "block";
      frame.src = "https://www.youtube.com/embed/videoseries?list=PL4fGSI1pDJn7OjQgkZn9VsfMdxFCn4Yb5";
    } else {
      yt.style.display = "none";
      frame.src = "";
      const play = !m.paused;
      m.src = val;
      m.currentTime = 0;
      if (play) m.play();
    }
  };

  document.addEventListener("click", e => {
    if (!box.contains(e.target)) {
      box.classList.remove("open");
      open = false;
    }
  });
})();