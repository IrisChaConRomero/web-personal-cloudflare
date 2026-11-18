/* ============================================================
   IRIS CHACÓN ROMERO — Sitio Web Personal
   script.js
   ============================================================ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────
     1. BARRA DE NAVEGACIÓN — scroll y sección activa
  ────────────────────────────────────────── */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  function handleNavbarScroll() {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Resaltar sección activa en el menú
  function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY  = window.scrollY + 120;

    sections.forEach((section) => {
      const id   = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (!link) return;

      const top    = section.offsetTop;
      const height = section.offsetHeight;

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach((l) => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', () => {
    handleNavbarScroll();
    highlightActiveSection();
  }, { passive: true });

  handleNavbarScroll();

  /* ──────────────────────────────────────────
     2. MENÚ MÓVIL (hamburguesa)
  ────────────────────────────────────────── */
  const hamburger   = document.getElementById('hamburger');
  const navLinksEl  = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinksEl.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinksEl.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksEl.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ──────────────────────────────────────────
     3. ANIMACIÓN DE ENTRADA AL HACER SCROLL
  ────────────────────────────────────────── */
  const revealElements = document.querySelectorAll(
    '.about-grid, .services-grid, .projects-grid, ' +
    '.service-card, .project-card, .social-buttons, ' +
    '.about-stats, .contact-subtitle'
  );

  revealElements.forEach((el) => {
    el.classList.add('reveal');
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const children = entry.target.querySelectorAll(
            '.service-card, .project-card'
          );

          if (children.length) {
            children.forEach((child, i) => {
              setTimeout(() => {
                child.classList.add('visible');
              }, i * 120);
            });
          }

          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ──────────────────────────────────────────
     4. EFECTO TILT EN TARJETAS
  ────────────────────────────────────────── */
  const tiltCards = document.querySelectorAll('.project-card, .service-card');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left - rect.width  / 2;
      const y      = e.clientY - rect.top  - rect.height / 2;
      const rotateX = -(y / (rect.height / 2)) * 4;
      const rotateY =  (x / (rect.width  / 2)) * 4;

      card.style.transform =
        `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ──────────────────────────────────────────
     5. PARALLAX SUAVE EN PORTADA
  ────────────────────────────────────────── */
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');

  if (orb1 && orb2) {
    document.addEventListener('mousemove', (e) => {
      const { clientX: x, clientY: y } = e;
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;

      orb1.style.transform = `translate(${dx * 20}px, ${dy * 20}px)`;
      orb2.style.transform = `translate(${-dx * 15}px, ${-dy * 15}px)`;
    }, { passive: true });
  }

  /* ──────────────────────────────────────────
     6. EFECTO DE ESCRITURA EN SUBTÍTULO
  ────────────────────────────────────────── */
  const tagline = document.querySelector('.hero-tagline');
  if (tagline) {
    const lines = [
      'Creadora de TalentPulse · Full Stack Developer.',
      'Arquitectura Backend, Frontend React y Despliegue Cloud.',
    ];

    const fullText = tagline.innerHTML;

    setTimeout(() => {
      tagline.innerHTML = '';
      let lineIdx   = 0;
      let charIdx   = 0;
      let isDeleting = false;
      let isPaused   = false;

      function type() {
        if (isPaused) return;

        const currentLine = lines[lineIdx];

        if (!isDeleting) {
          tagline.textContent = currentLine.substring(0, charIdx + 1);
          charIdx++;

          if (charIdx === currentLine.length) {
            if (lineIdx === lines.length - 1) {
              setTimeout(() => {
                tagline.innerHTML = fullText;
              }, 800);
              return;
            }
            isPaused = true;
            setTimeout(() => {
              isPaused = false;
              isDeleting = true;
              type();
            }, 1400);
            return;
          }
        } else {
          tagline.textContent = currentLine.substring(0, charIdx - 1);
          charIdx--;

          if (charIdx === 0) {
            isDeleting = false;
            lineIdx++;
          }
        }

        const speed = isDeleting ? 30 : 55;
        setTimeout(type, speed);
      }

      type();
    }, 1200);
  }

  /* ──────────────────────────────────────────
     7. CONTADOR ANIMADO DE ESTADÍSTICAS
  ────────────────────────────────────────── */
  function animateCounter(el) {
    const numericText = el.textContent.replace(/\D/g, '');
    if (!numericText) return;
    const target = parseInt(numericText, 10);
    if (isNaN(target)) return;
    const suffix = el.textContent.replace(/[\d]/g, '');
    let current  = 0;
    const step   = Math.max(1, Math.ceil(target / 40));
    const timer  = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = suffix.startsWith('+') ? `+${current}` : `${current}${suffix}`;
    }, 40);
  }

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  const statsSection = document.querySelector('.about-stats');
  if (statsSection) statsObserver.observe(statsSection);

  /* ──────────────────────────────────────────
     8. MODAL DETALLES DE TALENTPULSE
  ────────────────────────────────────────── */
  const masterModal = document.getElementById('master-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const bubbleTriggers = [
    document.getElementById('card-bubble-trigger'),
    document.getElementById('learning-bubble-trigger')
  ];

  function openMasterModal() {
    if (!masterModal) return;
    masterModal.classList.add('active');
    masterModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMasterModal() {
    if (!masterModal) return;
    masterModal.classList.remove('active');
    masterModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  bubbleTriggers.forEach((trigger) => {
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        openMasterModal();
      });
    }
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeMasterModal);
  }

  if (masterModal) {
    masterModal.addEventListener('click', (e) => {
      if (e.target === masterModal) {
        closeMasterModal();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && masterModal.classList.contains('active')) {
        closeMasterModal();
      }
    });
  }

  /* ──────────────────────────────────────────
     9. AMPLIAR FOTOGRAFÍA DE PERFIL AL HACER CLIC
  ────────────────────────────────────────── */
  const photoTrigger  = document.getElementById('profile-photo-trigger');
  const photoLightbox = document.getElementById('photo-lightbox');

  function openPhotoLightbox() {
    if (!photoLightbox) return;
    photoLightbox.classList.add('active');
    photoLightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closePhotoLightbox() {
    if (!photoLightbox) return;
    photoLightbox.classList.remove('active');
    photoLightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (photoTrigger && photoLightbox) {
    photoTrigger.addEventListener('click', () => {
      if (photoLightbox.classList.contains('active')) {
        closePhotoLightbox();
      } else {
        openPhotoLightbox();
      }
    });

    photoTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openPhotoLightbox();
      }
    });

    photoLightbox.addEventListener('click', closePhotoLightbox);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && photoLightbox.classList.contains('active')) {
        closePhotoLightbox();
      }
    });
  }

})();

