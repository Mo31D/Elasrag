const text = `Welcome back.
Please verify your access to continue.`;

const speed = 40;
let i = 0;
const element = document.getElementById("typewriter");

function typeEffect() {
  if (i < text.length) {
    const char = text.charAt(i);
    element.innerHTML += (char === '\n') ? '<br>' : char;
    i++;
    setTimeout(typeEffect, speed);
  }
}

window.addEventListener('load', () => {
  setTimeout(typeEffect, 600);
});

const CORRECT_PASS = '000';
const PRIVATE_URL = 'https://www.elasrag.com/elasrag/';
const msg = document.getElementById('msg');

document.getElementById('accessForm').addEventListener('submit', e => {
  e.preventDefault();
  const pw = document.getElementById('pw').value.trim();
  if (pw === CORRECT_PASS) {
    msg.style.color = '#bfffd8';
    msg.textContent = 'Access granted...';
    setTimeout(() => window.open(PRIVATE_URL, '_blank'), 600);
  } else {
    msg.style.color = '#ffbcbc';
    msg.textContent = 'Incorrect password.';
  }
});


// --- Click sound for nav links (put this after your other code in script.js) ---
window.addEventListener('load', () => {
  // existing typing start if any
  // setTimeout(typeEffect, 600); // <- هذا موجود لديك بالفعل; لا تكرره إن كان مكررًا

  // Helper: play a short soft click sound
  function playSoftClick(freq = 420, vol = 0.12, duration = 0.12) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);

      // Optional: close context shortly after to free resources
      setTimeout(() => {
        if (ctx && ctx.close) ctx.close().catch(()=>{});
      }, (duration + 0.05) * 1000);
    } catch (e) {
      // بعض المتصفحات قد تمنع إنشاء السياق — فقط تجاهل الخطأ
      console.warn('Audio play failed:', e);
    }
  }

  // Attach to nav links
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (ev) => {
      // if link is "#" preventing navigation to top — يمكنك تعديل هذا حسب الروابط الحقيقية
      if (link.getAttribute('href') === '#') ev.preventDefault();

      playSoftClick(460, 0.12, 0.12);
    });
  });

  // Attach to .btn (إذا أردت نفس التأثير)
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => playSoftClick(400, 0.14, 0.15));
  });

  // Debug: لاختبار سريع في الكونسول
  console.log('Click-sound handlers attached:', document.querySelectorAll('.nav-links a').length, 'nav links');
});