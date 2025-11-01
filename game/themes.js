/* =========================================
   MODULE: ThemeManager — Dynamic Visual Themes
   ========================================= */
const ThemeManager = (() => {
  const themes = {
    default: {
      map: "Silkroad_page-0001.jpeg",
      cardGlow: "#ffcc00",
      accent: "#b8860b"
    },
    halloween: {
      map: "halloween_map.png", // 🎃 can be a static image or animated .gif / .webp
      cardGlow: "#ff6600",
      accent: "#ff3300"
    },
    winter: {
      map: "winter_map.jpg",
      cardGlow: "#66ccff",
      accent: "#99ddff"
    }
  };

  let current = "default";

  function applyTheme(name) {
  if (!themes[name]) return console.warn("Unknown theme:", name);
  current = name;
  const t = themes[name];

  document.body.className = name; // ✅ يسمح بتطبيق تنسيقات CSS بناءً على اسم الثيم

  // 🗺️ Change map image
  const map = document.querySelector(".map");
  if (map) {
  map.style.backgroundImage = `url('${t.map}')`;
  map.className = `map ${name}`; // ✅ حتى يكون عندها نفس كلاس الثيم
  }

  // 🃏 Change player card light/glow
  document.querySelectorAll(".player-card.active").forEach(card => {
    card.style.boxShadow = `0 0 20px 6px ${t.cardGlow}`;
    card.style.borderColor = t.cardGlow;
    card.style.background = `${t.accent}10`;
    card.style.color = t.cardGlow;
  });

  // 🌈 Update CSS variables for global accent
  document.documentElement.style.setProperty("--gold", t.cardGlow);
  document.documentElement.style.setProperty("--brown", t.accent);

  console.log(`🎨 Theme applied: ${name}`);
}

  function getAvailableThemes() {
    return Object.keys(themes);
  }

  return { applyTheme, getAvailableThemes };
})();