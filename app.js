/* ═══════════════════════════════════════════════════════
   CIBERSEGURIDAD EN INSTITUCIONES EDUCATIVAS — BYTEWISE
   app.js
═══════════════════════════════════════════════════════ */

const TOTAL = 15;
let currentSlide = 1;
let isAnimating  = false;

/* ── INIT ──────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initDots();
  document.getElementById(`s${currentSlide}`).classList.add('active');
  updateUI();
});

/* ── PARTICLES ─────────────────────────────────────── */
function initParticles() {
  const container = document.getElementById('particles');
  for (let i = 0; i < 18; i++) {
    const p    = document.createElement('div');
    p.className = 'particle';
    const size  = Math.random() * 3 + 1;
    p.style.cssText = `
      left:             ${Math.random() * 100}%;
      width:            ${size}px;
      height:           ${size}px;
      animation-duration:  ${10 + Math.random() * 20}s;
      animation-delay:     ${Math.random() * -20}s;
    `;
    container.appendChild(p);
  }
}

/* ── NAVIGATION DOTS ───────────────────────────────── */
function initDots() {
  const dotsContainer = document.getElementById('dots');
  for (let i = 1; i <= TOTAL; i++) {
    const dot       = document.createElement('div');
    dot.className   = 'dot' + (i === 1 ? ' active' : '');
    dot.title       = `Diapositiva ${i}`;
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }
}

/* ── NAVIGATION ────────────────────────────────────── */

/**
 * Navigate to slide number n.
 * Called by nav buttons, dots, keyboard, and touch events.
 * @param {number} n - target slide (1-based)
 */
function goTo(n) {
  if (n < 1 || n > TOTAL || n === currentSlide || isAnimating) return;
  isAnimating = true;

  const prevSlide = document.getElementById(`s${currentSlide}`);
  const nextSlide = document.getElementById(`s${n}`);

  /* Exit current slide */
  prevSlide.classList.add('exit');
  prevSlide.classList.remove('active');

  setTimeout(() => {
    /* Finish exit */
    prevSlide.classList.remove('exit');

    /* Enter next slide */
    nextSlide.classList.add('active');

    /* Re-trigger card stagger animations */
    nextSlide.querySelectorAll('.cards-animate').forEach(el => {
      el.classList.remove('cards-animate');
      void el.offsetWidth; // force reflow
      el.classList.add('cards-animate');
    });

    /* Re-trigger block animations */
    nextSlide.querySelectorAll('.animate-in').forEach(el => {
      el.classList.remove('animate-in');
      void el.offsetWidth; // force reflow
      el.classList.add('animate-in');
    });

    isAnimating = false;
  }, 420);

  currentSlide = n;
  updateUI();
}

/* ── UI STATE ──────────────────────────────────────── */

/**
 * Sync progress bar, counter, buttons, and dots to currentSlide.
 */
function updateUI() {
  /* Progress bar */
  document.getElementById('progress-bar').style.width =
    `${(currentSlide / TOTAL) * 100}%`;

  /* Slide counter */
  document.getElementById('slide-counter').textContent =
    `${currentSlide} / ${TOTAL}`;

  /* Prev / Next buttons */
  document.getElementById('btn-prev').disabled = currentSlide === 1;
  document.getElementById('btn-next').disabled = currentSlide === TOTAL;

  /* Dot indicators */
  document.querySelectorAll('.dot').forEach((dot, index) => {
    dot.classList.toggle('active', index + 1 === currentSlide);
  });
}

/* ── KEYBOARD ──────────────────────────────────────── */
document.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      goTo(currentSlide + 1);
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
      goTo(currentSlide - 1);
      break;
    case 'Home':
      goTo(1);
      break;
    case 'End':
      goTo(TOTAL);
      break;
  }
});

/* ── TOUCH / SWIPE ─────────────────────────────────── */
let touchStartX = 0;

document.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].clientX;
}, { passive: true });

document.addEventListener('touchend', e => {
  const delta = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(delta) > 50) {
    goTo(currentSlide + (delta > 0 ? 1 : -1));
  }
}, { passive: true });
