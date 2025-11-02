/* =========================================
   3D Dice Module — Dual Dice (Green + Red)
   - maps numeric result -> cube rotation
   - keeps random extra spins for realism
   - exposes init(container) and rollBoth()
   ========================================= */
const Dice3D = (function () {
  let greenDie = null, redDie = null; // objects { wrapper, cube }
  let onRollDoneCallback = null;

  function init(container) {
    if (!container) {
      console.error("Dice3D.init: container not found");
      return;
    }

    const root = document.createElement("div");
    root.id = "dice3d-container";
root.style.position = "absolute";
root.style.top = "50%";
root.style.left = "20px";
root.style.transform = "translateY(-50%)";
root.style.display = "flex";
root.style.flexDirection = "column";
root.style.alignItems = "center";
root.style.gap = "16px";
root.style.zIndex = "6000"; // يعلو فوق كل شيء آخر
    container.appendChild(root);

    greenDie = createDie("green");
    redDie = createDie("red");

    root.appendChild(greenDie.wrapper);
    root.appendChild(redDie.wrapper);

    // small accessible numeric readout (for screen readers)
    const sr = document.createElement("div");
    sr.style.position = "absolute";
    sr.style.left = "-9999px";
    sr.setAttribute("aria-hidden", "true");
    root.appendChild(sr);

    // make sure wrapper sizes are consistent via CSS (styles added separately)
    console.log("🎲 Dice3D initialized");
	  // 🌀 تحديث الزهر تلقائيًا عند تغيير حجم الشاشة
  window.addEventListener("resize", () => {
    const parent = document.getElementById("dice3d-container");
    if (!parent) return;

    // امسح الزهر القديم
    parent.innerHTML = "";

    // أعد إنشاء النردين
    greenDie = createDie("green");
    redDie = createDie("red");
    parent.appendChild(greenDie.wrapper);
    parent.appendChild(redDie.wrapper);
  });
  }

// === REPLACE ENTIRE FUNCTION: function createDie(color) { ... } ===
function createDie(color) {
  // Wrapper (الـ container لكل وجه)
  const wrapper = document.createElement("div");
  wrapper.className = "dice3d-wrapper";

  // حساب الحجم اعتمادًا على عرض الخريطة (أكثر ثباتًا من عرض الشاشة)
  const mapEl = document.querySelector(".map");
  const mapWidth = mapEl ? mapEl.getBoundingClientRect().width : window.innerWidth;
  // معامل أصغر قليلاً للحفاظ على قابلية العرض على الهواتف الطولية
  const diceSize = Math.round(Math.max(34, Math.min(96, mapWidth * 0.082)));

  // خصائص التغليف والتصيير الثلاثي الأبعاد
  wrapper.style.width = `${diceSize}px`;
  wrapper.style.height = `${diceSize}px`;
  wrapper.style.perspective = `${Math.max(420, diceSize * 9)}px`;
  wrapper.style.position = "relative";
  wrapper.style.userSelect = "none";
  wrapper.style.transformStyle = "preserve-3d";
  wrapper.style.display = "inline-block";
  wrapper.style.touchAction = "manipulation";

  // المكعب (الحاوية الفعلية للوجوه)
  const cube = document.createElement("div");
  cube.className = "dice3d-cube";
  cube.style.width = "100%";
  cube.style.height = "100%";
  cube.style.position = "absolute";
  cube.style.left = "0";
  cube.style.top = "0";
  cube.style.transformStyle = "preserve-3d";
  cube.style.transition = "transform 1.1s cubic-bezier(.2,.9,.2,1)";
  cube.style.willChange = "transform";
  cube.style.transform = "rotateX(0deg) rotateY(0deg)";

  // تدرج لوني لوجه المكعب (يحافظ على الإيحاء الثلاثي الأبعاد)
  const baseColor = color === "green"
    ? "radial-gradient(circle at 30% 30%, #9fffa3, #006f2a)"
    : "radial-gradient(circle at 30% 30%, #ffbdbd, #8b0000)";

  // نصف الحجم (يستخدم لتحريك الوجوه للخارج) — نصحح بمقدار طفيف offset لتفادي الفجوات
  const half = Math.round(diceSize / 2);
  const offsetFix = 0.6; // مقدار تصحيح بسيط يقلل ظهور الشقوق
  const translateZ = Math.max(1, half - offsetFix);

  // حجم النقطة: نطاق أصغر يناسب الهواتف (1.5px → 4.5px تقريبًا)
  const dotSize = Math.max(3, Math.min(10, diceSize * 0.12));
  const dotOffset = dotSize / 2;

  // Helper: create a face with correct visual settings
  function makeFace(transformStr) {
    const face = document.createElement("div");
    face.className = "dice3d-face";
    face.style.width = "100%";
    face.style.height = "100%";
    face.style.position = "absolute";
    face.style.left = "0";
    face.style.top = "0";
    face.style.background = baseColor;
    face.style.border = "none";
    face.style.boxShadow = "none";
    face.style.borderRadius = `${Math.max(3, Math.round(diceSize * 0.11))}px`;
    face.style.backfaceVisibility = "hidden"; // يمنع ظهور الحواف البعيدة
    face.style.transformStyle = "preserve-3d";
    face.style.overflow = "hidden";
    face.style.webkitTransform = transformStr;
    face.style.transform = transformStr;
    return face;
  }

  // Generate faces 1..6 with corrected translateZ
  const faceTransforms = {
    1: `rotateY(0deg) translateZ(${translateZ}px)`,
    2: `rotateY(180deg) translateZ(${translateZ}px)`,
    3: `rotateY(90deg) translateZ(${translateZ}px)`,
    4: `rotateY(-90deg) translateZ(${translateZ}px)`,
    5: `rotateX(90deg) translateZ(${translateZ}px)`,
    6: `rotateX(-90deg) translateZ(${translateZ}px)`
  };

  for (let i = 1; i <= 6; i++) {
    const face = makeFace(faceTransforms[i]);

    // dots positions per side (existing positions kept for visual balance)
    const dots = getDotsForSide(i);
    dots.forEach(([x, y]) => {
      const dot = document.createElement("div");
      dot.className = "dice3d-dot";
      dot.style.width = `${dotSize}px`;
      dot.style.height = `${dotSize}px`;
      dot.style.borderRadius = "50%";
      dot.style.background = "#ffffff";
      dot.style.position = "absolute";
      dot.style.left = `calc(${x}% - ${dotOffset}px)`;
      dot.style.top = `calc(${y}% - ${dotOffset}px)`;
      dot.style.boxShadow = "0 0 0.6px rgba(0,0,0,0.18)";
      dot.style.pointerEvents = "none";
      face.appendChild(dot);
    });

    cube.appendChild(face);
  }

  // Append and expose
  wrapper.appendChild(cube);
  wrapper._diceSize = diceSize;
  wrapper._translateZ = translateZ;
  return { wrapper, cube };
}
  function getDotsForSide(num) {
    const center = [[50, 50]];
    const diagTLBR = [[28, 28], [72, 72]];
    const diagTRBL = [[72, 28], [28, 72]];
    const fourCorners = [[28, 28], [72, 28], [28, 72], [72, 72]];
    const sixDots = [
      [28, 20], [72, 20],
      [28, 50], [72, 50],
      [28, 80], [72, 80]
    ];
    switch (num) {
      case 1: return center;
      case 2: return diagTLBR;
      case 3: return [...diagTLBR, [50, 50]];
      case 4: return fourCorners;
      case 5: return [...fourCorners, [50, 50]];
      case 6: return sixDots;
      default: return [];
    }
  }

  // mapping of desired face → rotation (X, Y)
  // These rotations make the corresponding face point outward (face 1 at front, etc).
  const faceRotations = {
    1: { x: 0, y: 0 },     // front
    2: { x: 0, y: 180 },   // back
    3: { x: 0, y: -90 },   // left
    4: { x: 0, y: 90 },    // right
    5: { x: -90, y: 0 },   // top
    6: { x: 90, y: 0 }     // bottom
  };

  function _applyRotation(cube, faceNumber) {
    const rot = faceRotations[faceNumber] || { x: 0, y: 0 };
    // add a couple of full spins for realism
    const extraX = 360 * (Math.floor(Math.random() * 3) + 1);
    const extraY = 360 * (Math.floor(Math.random() * 3) + 1);
    const tx = rot.x + extraX;
    const ty = rot.y + extraY;
    cube.style.transform = `rotateX(${tx}deg) rotateY(${ty}deg)`;
  }

// ===== REPLACE EXISTING rollBoth() WITH THIS BLOCK =====
  // rollBoth: apply animation and return numeric results
  // options: { currentTownIndex: number, townsCount: number, maxRerolls: number }
  function rollBoth(options = {}) {
    const { currentTownIndex = null, townsCount = null, maxRerolls = 200 } = options || {};

    // helper: single random die
    function one() { return Math.floor(Math.random() * 6) + 1; }

    let greenRoll = one();
    let redRoll = one();
    let reRolledTimes = 0;

    // If one side must be ignored due to map edge, mark early.
    // ignored = { green: bool, red: bool }
    const ignored = { green: false, red: false };
    if (Number.isFinite(currentTownIndex) && Number.isFinite(townsCount)) {
      if (currentTownIndex === townsCount - 1) {
        // at topmost town — no city "above" to move to using green die
        ignored.green = true;
      } else if (currentTownIndex === 0) {
        // at bottommost town — no city "below" to move with red die
        ignored.red = true;
      }
    }

    // If both are ignored (edge case: single-city map), just return zeros
    if (ignored.green && ignored.red) {
      if (onRollDoneCallback) {
        try {
          setTimeout(() => onRollDoneCallback({
            green: null, red: null,
            effectiveGreen: null, effectiveRed: null,
            reRolledTimes, ignored
          }), 10);
        } catch (e) {}
      }
      return { green: null, red: null, effectiveGreen: null, effectiveRed: null, reRolledTimes, ignored };
    }

    // Re-roll loop: if both dice are equal AND both are relevant (i.e., not ignored),
    // then re-roll until non-equal. If one die is ignored, don't enforce the "no-equals" rule
    // for the ignored pair (since only one die matters).
    while (true) {
      // If one side ignored, we don't need to force non-equal pairs
      if (ignored.green || ignored.red) break;

      if (greenRoll !== redRoll) break;

      // re-roll both if equal
      greenRoll = one();
      redRoll = one();
      reRolledTimes++;
      if (reRolledTimes >= maxRerolls) break; // safety to avoid infinite loops (shouldn't happen)
    }

    // Effective results (null if ignored)
    const effectiveGreen = ignored.green ? null : greenRoll;
    const effectiveRed = ignored.red ? null : redRoll;

    // apply rotation visuals if cubes exist (preserve original visual behaviour)
    if (greenDie && greenDie.cube && effectiveGreen !== null) _applyRotation(greenDie.cube, greenRoll);
    if (redDie && redDie.cube && effectiveRed !== null) _applyRotation(redDie.cube, redRoll);

    // If a callback is registered, call it after animation duration (1.2s)
    if (onRollDoneCallback) {
      try {
        setTimeout(() => onRollDoneCallback({
          green: greenRoll,
          red: redRoll,
          effectiveGreen,
          effectiveRed,
          reRolledTimes,
          ignored
        }), 1300);
      } catch (e) {}
    }

    return { green: greenRoll, red: redRoll, effectiveGreen, effectiveRed, reRolledTimes, ignored };
  }

  // optionally register a callback called when the visual spin finishes
  function onRollDone(cb) { onRollDoneCallback = cb; }

  return { init, rollBoth, onRollDone };
})();