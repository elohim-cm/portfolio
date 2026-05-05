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
window.addEventListener('scroll', () => {
  const h = document.documentElement.scrollHeight - window.innerHeight;
  const pct = window.scrollY / h;
  scrollProgress.style.transform = `scaleX(${pct})`;
});

// ---- NAVBAR ----
const navbar = document.getElementById('navbar');
setTimeout(() => navbar.classList.add('visible'), 300);

// Active link on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) current = s.id;
  });
  navLinks.forEach(l => {
    l.classList.remove('active');
    if (l.getAttribute('href') === '#' + current) l.classList.add('active');
  });
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

// ---- TYPEWRITER ----
const phrases = [
  'Full-stack architectures sans framework',
  'Marketplaces sécurisées avec verification workflow',
  'SPAs performantes et accessibles',
  'APIs REST + databases optimisées',
  'OWASP-compliant security par défaut'
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
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ---- PROJECT MODALS ----
const modalOverlays = document.querySelectorAll('.project-modal-overlay');

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('open');
  document.body.classList.add('modal-open');
}

function closeModal(modal) {
  modal.classList.remove('open');
  document.body.classList.remove('modal-open');
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
