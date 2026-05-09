/* =========================================================
   La Ronde des Robes — GSAP v2
   ========================================================= */

(function () {
  'use strict';

  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     CURSEUR CUSTOM
  ============================================================ */
  const cursor = document.getElementById('cursor');
  if (cursor && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const setCursor = gsap.quickSetter(cursor, 'css');
    document.addEventListener('mousemove', e => setCursor({ x: e.clientX, y: e.clientY }));
    document.querySelectorAll('a, button, [data-magnetic], .service-card, .robe-zone').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hovered'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovered'));
    });
  }

  /* ============================================================
     HEADER SCROLL
  ============================================================ */
  const header = document.getElementById('site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ============================================================
     MENU MOBILE
  ============================================================ */
  const navToggle     = document.getElementById('nav-toggle');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileClose   = document.getElementById('mobile-close');

  const openMenu = () => {
    mobileOverlay?.classList.add('is-open');
    mobileOverlay?.setAttribute('aria-hidden', 'false');
    navToggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  const closeMenu = () => {
    mobileOverlay?.classList.remove('is-open');
    mobileOverlay?.setAttribute('aria-hidden', 'true');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  navToggle?.addEventListener('click', openMenu);
  mobileClose?.addEventListener('click', closeMenu);
  mobileOverlay?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* ============================================================
     HERO ANIMATIONS — déclenché après l'intro (ou immédiatement)
  ============================================================ */
  const heroTitle = document.getElementById('hero-title');

  /* Découpe le H1 lettre par lettre */
  if (heroTitle) {
    heroTitle.querySelectorAll('.hero-line').forEach(line => {
      const text = line.textContent;
      line.textContent = '';
      line.style.opacity = '1';
      [...text].forEach(char => {
        const s = document.createElement('span');
        s.textContent = char === ' ' ? ' ' : char;
        s.style.cssText = 'display:inline-block;opacity:0;transform:translateY(20px)';
        line.appendChild(s);
      });
    });
  }

  const startHeroAnim = () => {
    const tl = gsap.timeline({ delay: 0.15 });

    tl.fromTo('#hero-image-side',
      { opacity: 0 },
      { opacity: 1, duration: 1.5, ease: 'power2.out' }
    );
    tl.to('.hero-eyebrow',
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.9'
    );

    if (heroTitle) {
      const letters = heroTitle.querySelectorAll('span[style]');
      tl.to(letters, { opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: 'power3.out' }, '-=0.3');
    }

    const goldBar = document.getElementById('hero-gold-bar');
    if (goldBar) tl.to(goldBar, { width: '60px', duration: 0.9, ease: 'power3.out' }, '-=0.4');

    tl.to('.hero-lead',
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5'
    );
    tl.to(['.hero-rdv-tag', '.hero-discover'],
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out' }, '-=0.4'
    );
  };

  /* ============================================================
     SCROLL INTRO — pas d'overlay, hero anim directe
  ============================================================ */
  startHeroAnim();

  /* ============================================================
     PARALLAX HERO
  ============================================================ */
  gsap.to('#hero-img-wrap', {
    yPercent: -15, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  /* ============================================================
     SCROLL REVEALS GÉNÉRIQUES
  ============================================================ */
  gsap.utils.toArray('.gsap-reveal').forEach(el => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 83%', once: true }
    });
  });

  gsap.utils.toArray('.gsap-reveal-card').forEach((card, i) => {
    gsap.to(card, {
      opacity: 1, y: 0, duration: 1, delay: i * 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: '.services-cards', start: 'top 78%', once: true }
    });
  });

  /* ============================================================
     PULL QUOTE — lignes qui se tracent
  ============================================================ */
  const pullQuote = document.querySelector('.pull-quote');
  if (pullQuote) {
    const pqTop    = document.getElementById('pq-line-top');
    const pqBottom = document.getElementById('pq-line-bottom');
    ScrollTrigger.create({
      trigger: pullQuote, start: 'top 76%', once: true,
      onEnter: () => {
        gsap.to(pullQuote, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
        gsap.to([pqTop, pqBottom], { width: '100%', duration: 1, ease: 'power3.out', stagger: 0.2, delay: 0.3 });
        gsap.fromTo(pullQuote.querySelector('p'),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: 'power3.out' }
        );
      }
    });
  }

  /* ============================================================
     SIGNATURE — révélation de gauche à droite
  ============================================================ */
  const signature = document.querySelector('.gsap-signature');
  if (signature) {
    ScrollTrigger.create({
      trigger: signature, start: 'top 86%', once: true,
      onEnter: () => gsap.to(signature, { clipPath: 'inset(0 0% 0 0)', duration: 2, ease: 'power2.inOut' })
    });
  }

  /* ============================================================
     PARALLAX IMAGE HISTOIRE
  ============================================================ */
  const histPhoto = document.querySelector('.histoire-photo');
  if (histPhoto) {
    gsap.to(histPhoto, {
      yPercent: -8, ease: 'none',
      scrollTrigger: { trigger: '.section-histoire', start: 'top bottom', end: 'bottom top', scrub: true }
    });
  }

  /* ============================================================
     BOUTON MAGNÉTIQUE
  ============================================================ */
  document.querySelectorAll('[data-magnetic]').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      if (Math.hypot(dx, dy) < 70) gsap.to(btn, { x: dx * 0.4, y: dy * 0.4, duration: 0.4, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' }));
  });

  /* ============================================================
     ATELIER ROBE — Croquis interactif
  ============================================================ */
  const svgEl  = document.getElementById('robe-svg');
  const canvas = document.getElementById('atelier-canvas');

  if (svgEl && canvas) {
    const ctx = canvas.getContext('2d');
    let selectedColor = '#FEF9F5';
    let currentMode   = 'fill';
    let isDrawing     = false;
    let lastX = 0, lastY = 0;

    /* Sync canvas sur taille réelle du SVG */
    const syncCanvas = () => {
      const r = svgEl.getBoundingClientRect();
      if (r.width === 0) return;
      canvas.width  = Math.round(r.width);
      canvas.height = Math.round(r.height);
      canvas.style.width  = r.width  + 'px';
      canvas.style.height = r.height + 'px';
    };
    if (window.ResizeObserver) new ResizeObserver(syncCanvas).observe(svgEl);
    syncCanvas();
    setTimeout(syncCanvas, 500); // Retry after fonts/layout

    /* ——— Palette de couleurs ——— */
    document.querySelectorAll('.color-swatch').forEach(sw => {
      sw.addEventListener('click', function () {
        selectedColor = this.dataset.color;
        document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        this.classList.add('active');
      });
    });

    /* ——— Modes Colorier / Dessiner ——— */
    const hintEl      = document.getElementById('atelier-hint');
    const brushSec    = document.getElementById('brush-section');

    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        currentMode = this.dataset.mode;
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const isDrawMode = currentMode === 'draw';
        if (brushSec)  brushSec.style.display        = isDrawMode ? 'block' : 'none';
        canvas.style.pointerEvents                    = isDrawMode ? 'all'   : 'none';
        svgEl.style.pointerEvents                     = isDrawMode ? 'none'  : 'all';
        if (hintEl) hintEl.textContent = isDrawMode
          ? 'Dessinez librement sur le croquis avec votre couleur choisie.'
          : 'Cliquez sur une zone de la robe pour la colorier.';
      });
    });

    /* ——— Colorier les zones SVG ——— */
    document.querySelectorAll('.robe-zone').forEach(zone => {
      zone.addEventListener('click', function () {
        if (currentMode !== 'fill') return;
        /* Animation CSS transition via setAttribute + court GSAP flash */
        this.setAttribute('fill', selectedColor);
        gsap.fromTo(this, { opacity: 0.5 }, { opacity: 1, duration: 0.35, ease: 'power2.out' });
      });
    });

    /* ——— Dessin libre sur canvas ——— */
    const getPos = e => {
      const r   = canvas.getBoundingClientRect();
      const src = e.touches ? e.touches[0] : e;
      return [src.clientX - r.left, src.clientY - r.top];
    };

    canvas.addEventListener('mousedown',  e => { isDrawing = true;  [lastX, lastY] = getPos(e); });
    canvas.addEventListener('touchstart', e => { e.preventDefault(); isDrawing = true; [lastX, lastY] = getPos(e); }, { passive: false });

    const drawLine = e => {
      if (!isDrawing) return;
      const [x, y] = getPos(e);
      const size   = +(document.getElementById('brush-size')?.value ?? 3);
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth   = size;
      ctx.lineCap     = 'round';
      ctx.lineJoin    = 'round';
      ctx.stroke();
      [lastX, lastY] = [x, y];
    };

    canvas.addEventListener('mousemove',  drawLine);
    canvas.addEventListener('touchmove',  e => { e.preventDefault(); drawLine(e); }, { passive: false });
    canvas.addEventListener('mouseup',    () => isDrawing = false);
    canvas.addEventListener('touchend',   () => isDrawing = false);
    canvas.addEventListener('mouseleave', () => isDrawing = false);

    /* ——— Boutons reset ——— */
    document.getElementById('btn-erase-canvas')?.addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    document.getElementById('btn-reset-zones')?.addEventListener('click', () => {
      document.querySelectorAll('.robe-zone').forEach(z => {
        z.setAttribute('fill', 'transparent');
        gsap.fromTo(z, { opacity: 0.3 }, { opacity: 1, duration: 0.4 });
      });
    });
  }

  /* ============================================================
     VALIDATION FORMULAIRE
  ============================================================ */
  const form     = document.querySelector('form[name="contact"]');
  const feedback = form?.querySelector('.form-feedback');

  const setError = (input, err) => {
    input.classList.toggle('error', err);
    err ? input.setAttribute('aria-invalid', 'true') : input.removeAttribute('aria-invalid');
  };

  const validateField = input => {
    if (!input.required && !input.value.trim()) return true;
    if (input.type === 'email') {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      setError(input, !ok); return ok;
    }
    if (input.type === 'tel') {
      const ok = /^[+\d\s().-]{6,}$/.test(input.value.trim());
      setError(input, !ok); return ok;
    }
    const ok = input.value.trim().length > 0;
    setError(input, !ok); return ok;
  };

  if (form) {
    const fields = form.querySelectorAll('input[required], textarea[required], input[type="email"], input[type="tel"]');
    fields.forEach(f => {
      f.addEventListener('blur',  () => validateField(f));
      f.addEventListener('input', () => { if (f.classList.contains('error')) validateField(f); });
    });
    form.addEventListener('submit', e => {
      let ok = true;
      fields.forEach(f => { if (!validateField(f)) ok = false; });
      if (!ok) {
        e.preventDefault();
        if (feedback) { feedback.textContent = 'Merci de vérifier les champs incorrects.'; feedback.className = 'form-feedback is-error'; }
        form.querySelector('.error')?.focus();
      } else if (feedback) {
        feedback.textContent = 'Envoi en cours…';
        feedback.className = 'form-feedback';
      }
    });
  }

})();
