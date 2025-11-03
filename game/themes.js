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
      map: "halloween_map.png",
      cardGlow: "#ff6600",
      accent: "#ff3300"
    },
    night: {
      map: "Egyptian.jpeg",
      cardGlow: "#ffcc00",
      accent: "#b8860b"
    }
  };

  let current = "default";

  function applyTheme(name) {
    if (!themes[name]) return console.warn("Unknown theme:", name);
    current = name;
    const t = themes[name];

    // ✅ أضف/أزل فقط كلاس الثيم من body
    document.body.classList.remove("default", "halloween", "night");
    document.body.classList.add(name);

    // 🗺️ تحديث صورة الخريطة بدون حذف بقية الكلاسات
    const map = document.querySelector(".map");
    if (map) {
      map.style.backgroundImage = `url('${t.map}')`;
      map.classList.remove("default", "halloween", "night");
      map.classList.add(name);
    }

    // 🃏 تحديث الكروت النشطة
    document.querySelectorAll(".player-card.active").forEach(card => {
      card.style.boxShadow = `0 0 20px 6px ${t.cardGlow}`;
      card.style.borderColor = t.cardGlow;
      card.style.background = `${t.accent}10`;
      card.style.color = t.cardGlow;
    });

    // 🌈 تحديث المتغيرات العامة
    document.documentElement.style.setProperty("--gold", t.cardGlow);
    document.documentElement.style.setProperty("--brown", t.accent);

    console.log(`🎨 Theme applied: ${name}`);
  }

  function getAvailableThemes() {
    return Object.keys(themes);
  }

  return { applyTheme, getAvailableThemes };
})();