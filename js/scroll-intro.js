/* =========================================================
   La Ronde des Robes — Cinematic Scroll Canvas
   Frame-sequence scroll-driven animation
   ========================================================= */

(function () {
  'use strict';

  const FRAME_COUNT  = 150;
  const LERP_FACTOR  = 0.09;
  const FADE_START   = 0.78;   // % scroll où canvas + voile commencent
  const HINT_HIDE_AT = 0.467;  // Frame 70/150 — seuil disparition titre

  const canvas  = document.getElementById('scroll-canvas');
  const section = document.getElementById('scroll-intro');
  const loader  = document.getElementById('scroll-loader');
  const fill    = document.getElementById('scroll-loader-fill');
  const pct     = document.getElementById('scroll-loader-pct');
  const hint    = document.getElementById('scroll-hint');
  const brand   = document.getElementById('scroll-brand');
  const header  = document.getElementById('site-header');

  if (!canvas || !section) return;

  const ctx = canvas.getContext('2d', { alpha: false });

  /* Voile crème scroll-driven */
  const veil = document.createElement('div');
  veil.style.cssText = 'position:fixed;inset:0;background:#FEF9F5;opacity:0;z-index:9999;pointer-events:none;';
  document.body.appendChild(veil);

  /* ---- État ---- */
  const frames    = new Array(FRAME_COUNT).fill(null);
  let loadedCount = 0;
  let firstReady  = false;
  let currentF    = 0;
  let targetF     = 0;
  let introEnded  = false;
  let titleVisible = true; // état courant du titre (bidirectionnel)

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
          if (i === 0 && !firstReady) { firstReady = true; drawFrame(0); }
          const p = Math.round(loadedCount / FRAME_COUNT * 100);
          if (fill) fill.style.width = p + '%';
          if (pct)  pct.textContent  = p + ' %';
          if (loadedCount >= 30 && !resolved) { resolved = true; hideLoader(); resolve(); }
          if (loadedCount === FRAME_COUNT && !resolved) { resolved = true; hideLoader(); resolve(); }
        };
        img.onerror = () => {
          loadedCount++;
          if (loadedCount >= 30 && !resolved) { resolved = true; hideLoader(); resolve(); }
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

  /* ---- Titre bidirectionnel ---- */
  function updateTitle(p) {
    const shouldShow = p <= HINT_HIDE_AT;

    if (shouldShow && !titleVisible) {
      titleVisible = true;
      if (brand) { brand.style.display = ''; gsap.killTweensOf(brand); gsap.to(brand, { opacity: 1, duration: 0.35, ease: 'power2.out' }); }
      if (hint)  { hint.style.display  = ''; gsap.killTweensOf(hint);  gsap.to(hint,  { opacity: 1, duration: 0.35, ease: 'power2.out' }); }
    } else if (!shouldShow && titleVisible) {
      titleVisible = false;
      if (typeof gsap !== 'undefined') {
        gsap.killTweensOf([brand, hint]);
        gsap.to([brand, hint], {
          opacity: 0, duration: 0.5, ease: 'power2.inOut',
          onComplete: () => {
            if (brand) brand.style.display = 'none';
            if (hint)  hint.style.display  = 'none';
          }
        });
      }
    }
  }

  function onScroll() {
    const p = getProgress();
    targetF = p * (FRAME_COUNT - 1);

    /* Canvas + voile scroll-driven en parallèle */
    if (p >= FADE_START) {
      const t = (p - FADE_START) / (1 - FADE_START);
      canvas.style.opacity      = Math.max(0, 1 - t).toFixed(3);
      const veilT               = Math.min(1, Math.max(0, (t - 0.4) / 0.6));
      veil.style.opacity        = veilT.toFixed(3);
      veil.style.pointerEvents  = veilT > 0.05 ? 'all' : 'none';

      /* Snap quand le voile est presque opaque */
      if (t >= 0.97 && !introEnded) {
        introEnded = true;
        window.removeEventListener('scroll', onScroll);
        veil.style.opacity = '1';

        /* Prépare le header caché */
        if (header) { header.style.visibility = ''; gsap.set(header, { opacity: 0 }); }

        /* Bloque le scroll pendant la transition */
        document.body.style.overflow = 'hidden';

        /* Retire la section + atterrit exactement sur le hero */
        section.style.display = 'none';
        const hero = document.querySelector('.hero');
        if (hero) {
          hero.scrollIntoView({ behavior: 'instant', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }

        /* Recalcule ScrollTrigger après changement de layout */
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();

        /* Force la visibilité des éléments hero */
        const heroEls = document.querySelectorAll(
          '#hero-image-side, .hero-eyebrow, .hero-lead, .hero-rdv-tag, .hero-discover, #hero-gold-bar'
        );
        heroEls.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
        const goldBar = document.getElementById('hero-gold-bar');
        if (goldBar) goldBar.style.width = '60px';

        /* Ouvre le voile + révèle le header + débloque le scroll */
        gsap.to(veil, {
          opacity: 0, duration: 1.1, delay: 0.1, ease: 'power2.inOut',
          onComplete: () => {
            veil.remove();
            document.body.style.overflow = '';
            if (header) gsap.to(header, { opacity: 1, duration: 0.4, ease: 'power2.out' });
          }
        });
      }
    } else {
      canvas.style.opacity     = '1';
      veil.style.opacity       = '0';
      veil.style.pointerEvents = 'none';
    }

    updateTitle(p);
  }

  /* ---- Boucle RAF avec lerp ---- */
  function animate() {
    requestAnimationFrame(animate);
    if (!firstReady) return;
    const prev = currentF;
    currentF += (targetF - currentF) * LERP_FACTOR;
    if (Math.abs(currentF - prev) > 0.02) drawFrame(currentF);
  }

  /* ---- Init ---- */
  function init() {
    if (header) header.style.visibility = 'hidden';

    resize();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    /* Titre visible immédiatement */
    if (typeof gsap !== 'undefined') {
      if (brand) gsap.to(brand, { opacity: 1, duration: 0.9, delay: 0.3, ease: 'power2.out' });
      if (hint)  gsap.to(hint,  { opacity: 1, duration: 0.7, delay: 0.6, ease: 'power2.out' });
    }

    preload();
    animate();
  }

  window.__scrollIntroReady = true;
  init();
})();
