/* =========================================================
   La Ronde des Robes — Cinematic Scroll Canvas
   Frame-sequence scroll-driven animation
   ========================================================= */

(function () {
  'use strict';

  const FRAME_COUNT  = 150;
  const LERP_FACTOR  = 0.09;   // Fluidité — plus bas = plus doux
  const FADE_START   = 0.78;   // % scroll à partir duquel le canvas s'efface
  const HINT_HIDE_AT = 0.005;  // Cache le titre dès le début du scroll

  const canvas  = document.getElementById('scroll-canvas');
  const section = document.getElementById('scroll-intro');
  const loader  = document.getElementById('scroll-loader');
  const fill    = document.getElementById('scroll-loader-fill');
  const pct     = document.getElementById('scroll-loader-pct');
  const hint    = document.getElementById('scroll-hint');
  const brand   = document.getElementById('scroll-brand');

  if (!canvas || !section) return;

  const ctx = canvas.getContext('2d', { alpha: false });

  /* ---- État ---- */
  const frames   = new Array(FRAME_COUNT).fill(null);
  let loadedCount = 0;
  let firstReady  = false;
  let currentF    = 0;
  let targetF     = 0;
  let hintHidden  = false;

  /* ---- Resize ---- */
  function resize() {
    canvas.width  = window.innerWidth  * (window.devicePixelRatio || 1);
    canvas.height = window.innerHeight * (window.devicePixelRatio || 1);
    canvas.style.width  = '100%';
    canvas.style.height = '100vh';
    if (firstReady) drawFrame(Math.round(currentF));
  }

  /* ---- Dessin cover-fit ---- */
  function drawFrame(n) {
    const idx = Math.max(0, Math.min(Math.round(n), FRAME_COUNT - 1));
    const img = frames[idx];
    if (!img || !img.complete || !img.naturalWidth) return;

    const cw = canvas.width, ch = canvas.height;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth  * scale;
    const h = img.naturalHeight * scale;

    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  }

  /* ---- Preload ---- */
  function preload() {
    let resolved = false;

    return new Promise(resolve => {
      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        const num = String(i + 1).padStart(4, '0');
        img.src   = `frames/f${num}.jpg`;

        img.onload = () => {
          frames[i] = img;
          loadedCount++;

          /* Premier frame — affiche immédiatement */
          if (i === 0 && !firstReady) {
            firstReady = true;
            drawFrame(0);
          }

          /* Loader progress */
          const p = Math.round(loadedCount / FRAME_COUNT * 100);
          if (fill) fill.style.width = p + '%';
          if (pct)  pct.textContent  = p + ' %';

          /* Suffisamment chargé pour démarrer (30 frames) */
          if (loadedCount >= 30 && !resolved) {
            resolved = true;
            hideLoader();
            resolve();
          }

          if (loadedCount === FRAME_COUNT && !resolved) {
            resolved = true;
            hideLoader();
            resolve();
          }
        };

        img.onerror = () => {
          loadedCount++;
          if (loadedCount >= 30 && !resolved) {
            resolved = true;
            hideLoader();
            resolve();
          }
        };
      }
    });
  }

  function hideLoader() {
    if (!loader) return;
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 700);
  }

  /* ---- Scroll progress ---- */
  function getProgress() {
    const max = section.offsetHeight - window.innerHeight;
    return max <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / max));
  }

  function onScroll() {
    const p = getProgress();

    /* Frame cible */
    targetF = p * (FRAME_COUNT - 1);

    /* Opacité du canvas : fondu à partir de FADE_START */
    if (p >= FADE_START) {
      const t = (p - FADE_START) / (1 - FADE_START);
      canvas.style.opacity = Math.max(0, 1 - t).toFixed(3);
    } else {
      canvas.style.opacity = '1';
    }

    /* Cache le nom + hint dès le premier scroll */
    if (!hintHidden && p > HINT_HIDE_AT) {
      hintHidden = true;
      if (typeof gsap !== 'undefined') {
        gsap.to([brand, hint], { opacity: 0, duration: 0.35, ease: 'power2.inOut' });
      }
    }
  }

  /* ---- Boucle RAF avec lerp ---- */
  function animate() {
    requestAnimationFrame(animate);

    if (!firstReady) return;

    const prev = currentF;
    currentF += (targetF - currentF) * LERP_FACTOR;

    if (Math.abs(currentF - prev) > 0.02) {
      drawFrame(currentF);
    }
  }

  /* ---- Apparition du titre + hint via GSAP ---- */
  function animateOverlays() {
    if (typeof gsap === 'undefined') return;
    gsap.to(brand, { opacity: 1, y: 0, duration: 1.2, delay: 0.8, ease: 'power3.out' });
    gsap.to(hint,  { opacity: 1, y: 0, duration: 1.0, delay: 1.6, ease: 'power3.out' });
  }

  /* ---- Init ---- */
  function init() {
    /* Position de départ pour l'animation d'entrée */
    if (brand) gsap.set(brand, { y: 16 });
    if (hint)  gsap.set(hint,  { y: 10 });

    resize();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    preload().then(animateOverlays);
    animate();
  }

  /* Expose startHeroAnim hook — appelé depuis main.js */
  window.__scrollIntroReady = true;

  init();
})();
