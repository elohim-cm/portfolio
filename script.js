import Lenis from 'https://cdn.jsdelivr.net/npm/lenis@latest/dist/lenis.mjs';

// ---- LENIS / SMOOTH SCROLL PREMIUM ----
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const lenis = new Lenis({
  duration: prefersReducedMotion ? 0 : 1.35,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: !prefersReducedMotion,
  syncTouch: !prefersReducedMotion,
  wheelMultiplier: 0.85,
  touchMultiplier: 1.4,
  infinite: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);



// ---- CUSTOM CURSOR ----
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top = mouseY + 'px';
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;
  ring.style.left = ringX + 'px';
  ring.style.top = ringY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .tech-card, .project-card, .service-card, .stat-card').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hover'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
});

// ---- SCROLL PROGRESS ----
const scrollProgress = document.getElementById('scrollProgress');
function updateScrollProgress(scrollY) {
  const h = document.documentElement.scrollHeight - window.innerHeight;
  const pct = h > 0 ? scrollY / h : 0;
  scrollProgress.style.transform = `scaleX(${pct})`;
}

// ---- NAVBAR ----
const navbar = document.getElementById('navbar');
setTimeout(() => navbar.classList.add('visible'), 300);

// Active link on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');
function updateActiveNav(scrollY) {
  let current = '';
  sections.forEach(section => {
    if (scrollY >= section.offsetTop - 220) {
      current = section.id;
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');

    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}
lenis.on('scroll', ({ scroll }) => {
  updateScrollProgress(scroll);
  updateActiveNav(scroll);
});

// ---- MOBILE MENU ----
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
menuToggle.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ---- SCROLL REVEAL ----
const revealEls = document.querySelectorAll('.reveal');
const sectionLines = document.querySelectorAll('.section-line');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));
sectionLines.forEach(el => revealObserver.observe(el));

// Sécurité : afficher directement les éléments du hero
document.querySelectorAll('.hero .reveal').forEach(el => {
  el.classList.add('revealed');
});

// ---- TYPEWRITER ----
const phrases = [
  'Architectures web performantes et scalables',
  'Marketplaces sécurisées sur-mesure',
  'SPAs performantes et accessibles',
  'Backend PHP pensé pour la scalabilité',
  'APIs REST + databases optimisées',
  'Sécurité et performance dès la conception'
];
let phraseIdx = 0, charIdx = 0, isDeleting = false;
const typeEl = document.getElementById('typewriterText');

function typewrite() {
  const current = phrases[phraseIdx];
  if (!isDeleting) {
    typeEl.textContent = current.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      isDeleting = true;
      setTimeout(typewrite, 2000);
      return;
    }
    setTimeout(typewrite, 60);
  } else {
    typeEl.textContent = current.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(typewrite, 400);
      return;
    }
    setTimeout(typewrite, 30);
  }
}
setTimeout(typewrite, 1000);

// ---- SMOOTH SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    const target = document.querySelector(href);

    if (!target) return;

    e.preventDefault();

    lenis.scrollTo(target, {
      offset: -90,
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  });
});

// ---- PROJECT MODALS ----
const modalOverlays = document.querySelectorAll('.project-modal-overlay');

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('open');
  document.body.classList.add('modal-open');
  lenis.stop(); // Stop scroll when modal is open
}

function closeModal(modal) {
  modal.classList.remove('open');
  document.body.classList.remove('modal-open');
  lenis.start(); // Start scroll when modal is closed
}

document.querySelectorAll('.project-details-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const modalId = btn.getAttribute('data-modal');
    if (modalId) openModal(modalId);
  });
});

modalOverlays.forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal(overlay);
  });
  const closeBtn = overlay.querySelector('.project-modal-close');
  if (closeBtn) closeBtn.addEventListener('click', () => closeModal(overlay));
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    modalOverlays.forEach(overlay => {
      if (overlay.classList.contains('open')) closeModal(overlay);
    });
  }
});
class ProjectCarousel {
  constructor() {
    this.carousels = new Map();
    this.autoplayIntervals = new Map();
    this.init();
  }

  init() {
    document.querySelectorAll('[data-carousel]').forEach((carousel) => {
      const id = carousel.dataset.carousel;
      const totalSlides = carousel.querySelectorAll('.carousel-slide').length;
      this.carousels.set(id, {
        element: carousel,
        currentSlide: 0,
        totalSlides: totalSlides,
        isAutoPlaying: false,
      });

      if (totalSlides > 1) {
        this.setupEventListeners(id);
        this.startAutoPlay(id);
      }
    });
  }

  setupEventListeners(carouselId) {
    const carousel = this.carousels.get(carouselId);
    const element = carousel.element;

    // Boutons précédent/suivant
    element
      .querySelector('.carousel-prev')
      ?.addEventListener('click', () => this.prevSlide(carouselId));
    element
      .querySelector('.carousel-next')
      ?.addEventListener('click', () => this.nextSlide(carouselId));

    // Indicateurs
    element.querySelectorAll('.indicator').forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(carouselId, index));
    });

    // Pause autoplay au hover
    element.addEventListener('mouseenter', () => this.stopAutoPlay(carouselId));
    element.addEventListener('mouseleave', () => this.startAutoPlay(carouselId));

    // Clavier (flèches)
    element.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prevSlide(carouselId);
      if (e.key === 'ArrowRight') this.nextSlide(carouselId);
    });

    let touchStartX = 0;
    let touchEndX = 0;

    element.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    element.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;

      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.nextSlide(carouselId);
        } else {
          this.prevSlide(carouselId);
        }
      }
    }, { passive: true });
  }

  goToSlide(carouselId, slideIndex) {
    const carousel = this.carousels.get(carouselId);
    carousel.currentSlide = slideIndex;
    this.updateCarousel(carouselId);
    this.resetAutoPlay(carouselId);
  }

  nextSlide(carouselId) {
    const carousel = this.carousels.get(carouselId);
    carousel.currentSlide =
      (carousel.currentSlide + 1) % carousel.totalSlides;
    this.updateCarousel(carouselId);
    this.resetAutoPlay(carouselId);
  }

  prevSlide(carouselId) {
    const carousel = this.carousels.get(carouselId);
    carousel.currentSlide =
      (carousel.currentSlide - 1 + carousel.totalSlides) %
      carousel.totalSlides;
    this.updateCarousel(carouselId);
    this.resetAutoPlay(carouselId);
  }

  updateCarousel(carouselId) {
    const carousel = this.carousels.get(carouselId);
    const { element, currentSlide } = carousel;

    // Update track position
    const track = element.querySelector('.carousel-track');
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Update slides
    element.querySelectorAll('.carousel-slide').forEach((slide, index) => {
      slide.classList.toggle('active', index === currentSlide);
    });

    // Update indicators
    element.querySelectorAll('.indicator').forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentSlide);
    });
  }

  startAutoPlay(carouselId) {
    const carousel = this.carousels.get(carouselId);
    if (!carousel) return;
    if (this.autoplayIntervals.has(carouselId)) return;
    carousel.isAutoPlaying = true;
    const intervalId = setInterval(() => {this.nextSlide(carouselId);}, 3000);
    this.autoplayIntervals.set(carouselId, intervalId);
  }

  stopAutoPlay(carouselId) {
    const carousel = this.carousels.get(carouselId);
    if (!carousel) return;
    const intervalId = this.autoplayIntervals.get(carouselId);
    if (intervalId) {clearInterval(intervalId); this.autoplayIntervals.delete(carouselId); }
    carousel.isAutoPlaying = false;
  }

  resetAutoPlay(carouselId) {
    this.stopAutoPlay(carouselId);
    this.startAutoPlay(carouselId);
  }
}

// Initialiser au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  new ProjectCarousel();
});

// ---- CONTACT FORM ----
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const contactSubmit = document.getElementById('contactSubmit');

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);

    const payload = {
      name: formData.get('name')?.trim(),
      email: formData.get('email')?.trim(),
      subject: formData.get('subject')?.trim(),
      message: formData.get('message')?.trim(),
      source: 'Formulaire portfolio Elohim Warren',
    };

    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      formStatus.textContent = 'Veuillez remplir tous les champs.';
      formStatus.className = 'form-status error';
      return;
    }

    contactSubmit.disabled = true;
    contactSubmit.textContent = 'Envoi en cours...';

    formStatus.textContent = '';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de l’envoi.');
      }

      formStatus.textContent = 'Message envoyé avec succès. Je vous répondrai rapidement.';
      formStatus.className = 'form-status success';

      contactForm.reset();
    } catch (error) {
      formStatus.textContent = 'Une erreur est survenue. Veuillez réessayer ou me contacter directement par whatsapp.';
      formStatus.className = 'form-status error';
    } finally {
      contactSubmit.disabled = false;
      contactSubmit.textContent = 'Envoyer le message';
    }
  });
}