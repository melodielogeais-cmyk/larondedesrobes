/* =========================================================
   La Ronde des Robes — GSAP Animations
   ========================================================= */

(function () {
  'use strict';

  /* Attend que GSAP soit prêt */
  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Curseur custom ---------- */
  const cursor = document.getElementById('cursor');
  if (cursor && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const moveCursor = gsap.quickSetter(cursor, 'css');
    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      moveCursor({ x: mouseX, y: mouseY });
    });

    const hoverTargets = document.querySelectorAll('a, button, [data-magnetic], .service-card');
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hovered'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovered'));
    });
  }

  /* ---------- Header scroll ---------- */
  const header = document.getElementById('site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 30);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Menu mobile ---------- */
  const navToggle  = document.getElementById('nav-toggle');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileClose   = document.getElementById('mobile-close');

  const openMenu = () => {
    if (!mobileOverlay || !navToggle) return;
    mobileOverlay.classList.add('is-open');
    mobileOverlay.setAttribute('aria-hidden', 'false');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    if (!mobileOverlay || !navToggle) return;
    mobileOverlay.classList.remove('is-open');
    mobileOverlay.setAttribute('aria-hidden', 'true');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (navToggle) navToggle.addEventListener('click', openMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMenu);
  if (mobileOverlay) {
    mobileOverlay.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---------- HERO : animations au chargement ---------- */

  /* Lettres du H1 */
  const heroTitle = document.getElementById('hero-title');
  if (heroTitle) {
    const lines = heroTitle.querySelectorAll('.hero-line');
    lines.forEach((line) => {
      const text = line.textContent;
      line.textContent = '';
      line.style.opacity = '1';
      [...text].forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? ' ' : char;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = 'translateY(20px)';
        line.appendChild(span);
      });
    });
  }

  const heroGoldBar = document.getElementById('hero-gold-bar');
  const tl = gsap.timeline({ delay: 0.2 });

  /* Image fade-in */
  tl.fromTo('#hero-image-side',
    { opacity: 0 },
    { opacity: 1, duration: 1.5, ease: 'power2.out' }
  );

  /* Eyebrow */
  tl.to('.hero-eyebrow',
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
    '-=1'
  );

  /* Lettres H1 */
  if (heroTitle) {
    const allLetters = heroTitle.querySelectorAll('span[style]');
    tl.to(allLetters, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.035,
      ease: 'power3.out'
    }, '-=0.4');
  }

  /* Gold bar */
  if (heroGoldBar) {
    tl.to(heroGoldBar, { width: '60px', duration: 1, ease: 'power3.out' }, '-=0.2');
  }

  /* Lead text + tags */
  tl.to('.hero-lead',
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
    '-=0.5'
  );
  tl.to(['.hero-rdv-tag', '.hero-discover'],
    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.15 },
    '-=0.4'
  );

  /* ---------- Parallax hero image ---------- */
  const heroImgWrap = document.getElementById('hero-img-wrap');
  if (heroImgWrap) {
    gsap.to(heroImgWrap, {
      yPercent: -15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  /* ---------- Scroll reveals génériques ---------- */
  gsap.utils.toArray('.gsap-reveal').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 82%',
        once: true
      }
    });
  });

  /* Cards services en stagger */
  gsap.utils.toArray('.gsap-reveal-card').forEach((card, i) => {
    gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: i * 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.services-cards',
        start: 'top 78%',
        once: true
      }
    });
  });

  /* ---------- Pull quote : lignes qui se tracent ---------- */
  const pqTop    = document.getElementById('pq-line-top');
  const pqBottom = document.getElementById('pq-line-bottom');
  const pullQuote = document.querySelector('.pull-quote');

  if (pullQuote && pqTop && pqBottom) {
    ScrollTrigger.create({
      trigger: pullQuote,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsap.to(pullQuote, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
        gsap.to([pqTop, pqBottom], {
          width: '100%',
          duration: 1,
          ease: 'power3.out',
          stagger: 0.2,
          delay: 0.3
        });
        gsap.fromTo(pullQuote.querySelector('p'),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: 'power3.out' }
        );
      }
    });
  }

  /* ---------- Signature : révélation clip-path ---------- */
  const signature = document.querySelector('.gsap-signature');
  if (signature) {
    ScrollTrigger.create({
      trigger: signature,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(signature, {
          clipPath: 'inset(0 0% 0 0)',
          duration: 2,
          ease: 'power2.inOut'
        });
      }
    });
  }

  /* ---------- Parallax léger section histoire ---------- */
  const histoireImg = document.querySelector('.histoire-img-placeholder');
  if (histoireImg) {
    gsap.to(histoireImg, {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: {
        trigger: '.section-histoire',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  /* ---------- Bouton magnétique ---------- */
  document.querySelectorAll('[data-magnetic]').forEach((btn) => {
    const RADIUS = 60;
    const STRENGTH = 0.4;

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < RADIUS) {
        gsap.to(btn, {
          x: dx * STRENGTH,
          y: dy * STRENGTH,
          duration: 0.4,
          ease: 'power2.out'
        });
      }
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    });
  });

  /* ---------- Validation formulaire ---------- */
  const form     = document.querySelector('form[name="contact"]');
  const feedback = form ? form.querySelector('.form-feedback') : null;

  const setError = (input, hasError) => {
    input.classList.toggle('error', hasError);
    hasError
      ? input.setAttribute('aria-invalid', 'true')
      : input.removeAttribute('aria-invalid');
  };

  const validateField = (input) => {
    if (input.type === 'date' && !input.required) return true;
    if (!input.required && !input.value.trim()) return true;
    if (input.type === 'email') {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      setError(input, !ok);
      return ok;
    }
    if (input.type === 'tel') {
      const ok = /^[+\d\s().-]{6,}$/.test(input.value.trim());
      setError(input, !ok);
      return ok;
    }
    const ok = input.value.trim().length > 0;
    setError(input, !ok);
    return ok;
  };

  if (form) {
    const fields = form.querySelectorAll('input[required], textarea[required], input[type="email"], input[type="tel"]');
    fields.forEach((f) => {
      f.addEventListener('blur', () => validateField(f));
      f.addEventListener('input', () => { if (f.classList.contains('error')) validateField(f); });
    });

    form.addEventListener('submit', (e) => {
      let allValid = true;
      fields.forEach((f) => { if (!validateField(f)) allValid = false; });
      if (!allValid) {
        e.preventDefault();
        if (feedback) {
          feedback.textContent = 'Merci de vérifier les champs incorrects.';
          feedback.className = 'form-feedback is-error';
        }
        const firstErr = form.querySelector('.error');
        if (firstErr) firstErr.focus();
      } else if (feedback) {
        feedback.textContent = 'Envoi en cours…';
        feedback.className = 'form-feedback';
      }
    });
  }

})();
