(function () {
  'use strict';

  /* ── Menu hamburguer (mobile) ── */
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu   = document.getElementById('mobile-menu');

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('is-open');
      hamburgerBtn.classList.toggle('is-open', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    });

    /* Fecha o menu ao clicar em qualquer link mobile */
    document.querySelectorAll('.mobile-nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('is-open');
        hamburgerBtn.classList.remove('is-open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    });

    /* Fecha o menu ao clicar fora dele */
    document.addEventListener('click', function (event) {
      const clickedInside = hamburgerBtn.contains(event.target) || mobileMenu.contains(event.target);
      if (!clickedInside && mobileMenu.classList.contains('is-open')) {
        mobileMenu.classList.remove('is-open');
        hamburgerBtn.classList.remove('is-open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
      }
    });
  }

  /* ── Header: adiciona classe ao rolar para aumentar opacidade ── */
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 40) {
        header.style.background = 'rgba(10, 10, 10, 0.97)';
        header.style.borderBottomColor = 'rgba(92, 50, 146, 0.5)';
      } else {
        header.style.background = 'rgba(10, 10, 10, 0.85)';
        header.style.borderBottomColor = 'rgba(92, 50, 146, 0.3)';
      }
    }, { passive: true });
  }

})();
