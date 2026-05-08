/* =========================================================
   La Ronde des Robes — JS
   - Header sticky : ombre au scroll
   - Menu mobile (hamburger, accessible)
   - Scroll reveal animations (IntersectionObserver)
   - Validation formulaire côté client
   - Fermeture du menu mobile au clic sur un lien
   ========================================================= */

(function () {
  'use strict';

  /* ---------- Header : ombre au scroll ---------- */
  const header = document.getElementById('site-header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 8) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Menu mobile ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.getElementById('nav-list');

  const closeMenu = () => {
    if (!navToggle || !navList) return;
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Ouvrir le menu');
    navList.classList.remove('is-open');
  };

  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Ouvrir le menu' : 'Fermer le menu');
      navList.classList.toggle('is-open', !isOpen);
    });

    navList.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el) => io.observe(el));
  } else {
    // Fallback : tout afficher
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Validation formulaire ---------- */
  const form = document.querySelector('form[name="contact"]');
  const feedback = form ? form.querySelector('.form-feedback') : null;

  const setError = (input, hasError) => {
    input.classList.toggle('error', hasError);
    if (hasError) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  };

  const validateField = (input) => {
    if (!input.required && !input.value.trim()) return true;
    if (input.type === 'email') {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      setError(input, !emailOk);
      return emailOk;
    }
    if (input.type === 'tel') {
      const telOk = /^[+\d\s().-]{6,}$/.test(input.value.trim());
      setError(input, !telOk);
      return telOk;
    }
    const ok = input.value.trim().length > 0;
    setError(input, !ok);
    return ok;
  };

  if (form) {
    const fields = form.querySelectorAll('input[required], textarea[required], input[type="email"], input[type="tel"]');

    fields.forEach((field) => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('error')) validateField(field);
      });
    });

    form.addEventListener('submit', (e) => {
      let allValid = true;
      fields.forEach((field) => {
        if (!validateField(field)) allValid = false;
      });

      if (!allValid) {
        e.preventDefault();
        if (feedback) {
          feedback.textContent = 'Merci de vérifier les champs en rouge.';
          feedback.className = 'form-feedback is-error';
        }
        const firstError = form.querySelector('.error');
        if (firstError) firstError.focus();
      } else if (feedback) {
        feedback.textContent = 'Envoi en cours…';
        feedback.className = 'form-feedback';
      }
    });
  }

  /* ---------- Année dynamique footer (si l'élément existe) ---------- */
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

})();
