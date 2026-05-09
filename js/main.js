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
    document.querySelectorAll('a, button, [data-magnetic], .service-card').forEach(el => {
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
    const tl = gsap.timeline({ delay: 0.2 });

    /* Fondu de l'overlay */
    tl.fromTo('.hero-overlay',
      { opacity: 0 },
      { opacity: 1, duration: 1.8, ease: 'power2.out' }
    );

    tl.to('.hero-eyebrow',
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=1'
    );

    if (heroTitle) {
      const letters = heroTitle.querySelectorAll('span[style]');
      tl.to(letters, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' }, '-=0.4');
    }

    const goldBar = document.getElementById('hero-gold-bar');
    if (goldBar) tl.to(goldBar, { width: '80px', duration: 1.1, ease: 'power3.out' }, '-=0.3');

    tl.to('.hero-lead',
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.6'
    );
    tl.to('.hero-rdv-tag',
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5'
    );
    tl.to('.hero-discover',
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
        onComplete: () => document.querySelector('.hero-discover')?.classList.add('anim-ready')
      }, '-=0.3'
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
     HISTOIRE — grand titre + séparateur or
  ============================================================ */
  const histGoldSep = document.querySelector('.histoire-gold-sep');
  if (histGoldSep) {
    ScrollTrigger.create({
      trigger: histGoldSep, start: 'top 88%', once: true,
      onEnter: () => gsap.to(histGoldSep, { opacity: 1, scaleX: 1, duration: 1.2, ease: 'power3.out' })
    });
  }

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
     SIGNATURE — écriture à la main
  ============================================================ */
  const signature    = document.querySelector('.gsap-signature');
  const sigUnderline = document.querySelector('.signature-underline');

  if (signature) {
    gsap.set(signature, { rotate: -4, transformOrigin: 'left center' });

    ScrollTrigger.create({
      trigger: signature, start: 'top 88%', once: true,
      onEnter: () => {
        const tl = gsap.timeline();
        tl.to(signature, {
          clipPath: 'inset(0 0% 0 0)',
          rotate: 0,
          duration: 2,
          ease: 'power2.inOut'
        });
        if (sigUnderline) {
          tl.to(sigUnderline, {
            width: '180px',
            duration: 0.9,
            ease: 'power2.out'
          }, '-=0.6');
        }
      }
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
     ATELIER — Slider 3-up + révélation SVG réel
  ============================================================ */
  const sliderItems = Array.from(document.querySelectorAll('.slider-item'));
  const infoCards   = document.querySelectorAll('.atelier-info-card');
  const total       = sliderItems.length;
  let   current     = 0;
  let   animLocked  = false;

  /* Cache toutes les fiches au départ */
  infoCards.forEach(card => gsap.set(card, { autoAlpha: 0 }));

  function animateCardIn(card) {
    const name  = card.querySelector('.atelier-info-name');
    const quote = card.querySelector('.atelier-info-quote');
    const desc  = card.querySelector('.atelier-info-desc');
    const items = card.querySelectorAll('.atelier-info-fits li');

    const tl = gsap.timeline({ delay: 0.1 });

    /* Carte visible */
    tl.set(card, { autoAlpha: 1 });

    /* Titre — révélation clip-path du bas */
    if (name) {
      gsap.set(name, { clipPath: 'inset(0 0 100% 0)', y: 10 });
      tl.to(name, { clipPath: 'inset(0 0 0% 0)', y: 0, duration: 0.55, ease: 'power3.out' }, 0);
    }

    /* Citation — fondu + légère remontée */
    if (quote) {
      gsap.set(quote, { opacity: 0, y: 12 });
      tl.to(quote, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.2);
    }

    /* Description */
    if (desc) {
      gsap.set(desc, { opacity: 0, y: 10 });
      tl.to(desc, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.35);
    }

    /* Liste — stagger item par item */
    if (items.length) {
      gsap.set(items, { opacity: 0, x: -12 });
      tl.to(items, { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' }, 0.45);
    }

    return tl;
  }

  function goTo(idx) {
    if (animLocked) return;
    animLocked = true;
    setTimeout(() => { animLocked = false; }, 600);

    idx = (idx + total) % total;
    const dressKey = sliderItems[idx].dataset.dress;

    sliderItems.forEach((item, i) => {
      const diff = (i - idx + total) % total;
      item.classList.remove('is-active', 'is-prev', 'is-next');
      if      (diff === 0)                   item.classList.add('is-active');
      else if (diff === 1)                   item.classList.add('is-next');
      else if (diff === total - 1 && i !== idx) item.classList.add('is-prev');
    });

    infoCards.forEach(card => {
      gsap.killTweensOf(card);
      if (card.id === `info-${dressKey}`) {
        card.classList.add('is-active');
        animateCardIn(card);
      } else {
        card.classList.remove('is-active');
        gsap.set(card, { autoAlpha: 0 });
      }
    });

    current = idx;
  }

  document.querySelector('.slider-prev')?.addEventListener('click', () => goTo(current - 1));
  document.querySelector('.slider-next')?.addEventListener('click', () => goTo(current + 1));
  sliderItems.forEach((item, i) => {
    item.addEventListener('click', () => {
      if (!item.classList.contains('is-active')) goTo(i);
    });
  });

  ScrollTrigger.create({
    trigger: '.atelier-stage',
    start: 'top 75%',
    once: true,
    onEnter: () => goTo(0)
  });

  /* ============================================================
     SÉLECTEUR DE TAILLE — met à jour les croquis
  ============================================================ */
  const sizeBtns   = document.querySelectorAll('.size-btn');
  let   currentSize = '42';

  sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentSize = btn.dataset.size;
      sizeBtns.forEach(b => {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-pressed', String(b === btn));
      });
      sliderItems.forEach(item => {
        const dress = item.dataset.dress;
        const img   = item.querySelector('.atelier-sketch-svg');
        if (img) img.src = `images/Croquis/${dress}-${currentSize}.png`;
      });
    });
  });

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
