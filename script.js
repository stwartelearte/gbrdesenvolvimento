(function () {
  'use strict';

  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  const links = document.querySelectorAll('a[href^="#"]');
  const reveals = document.querySelectorAll('.reveal');
  const whyCards = document.querySelectorAll('.why-card');

  /* ---- Mobile menu ---- */
  function closeMenu() {
    if (!toggle || !nav) return;
    nav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
  }

  function toggleMenu() {
    if (!toggle || !nav) return;
    const open = nav.classList.toggle('is-open');
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }

  if (toggle) {
    toggle.addEventListener('click', toggleMenu);
  }

  /* ---- Expandable differential cards ---- */
  whyCards.forEach(function (card) {
    card.addEventListener('click', function () {
      var willOpen = !card.classList.contains('is-active');

      whyCards.forEach(function (otherCard) {
        otherCard.classList.remove('is-active');
        otherCard.setAttribute('aria-expanded', 'false');
      });

      if (willOpen) {
        card.classList.add('is-active');
        card.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---- Smooth scroll for anchor links ---- */
  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      closeMenu();

      var top = target.getBoundingClientRect().top + window.scrollY - (header ? header.offsetHeight : 0) - 12;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ---- Scroll reveal with IntersectionObserver ---- */
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    reveals.forEach(function (el) { observer.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }
})();
