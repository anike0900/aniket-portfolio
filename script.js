/* ==========================================================================
   PORTFOLIO SCRIPT
   Vanilla JS — no dependencies.
   Sections: loader, theme toggle, mobile nav, smooth scroll, sticky navbar,
   active-link highlighting, scroll reveal, typing effect, animated counters,
   skill progress bars, project filtering, contact form validation,
   back-to-top button.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- 1. LOADING SCREEN ---------------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('is-hidden'), 400);
  });
  // Fallback in case 'load' already fired or takes too long
  setTimeout(() => loader.classList.add('is-hidden'), 2500);

  /* ---------------- 2. THEME TOGGLE (dark / light) ---------------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('portfolio-theme');

  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
  } else {
    // Respect OS preference on first visit
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    root.setAttribute('data-theme', prefersLight ? 'light' : 'dark');
  }
  updateThemeButton();

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
    updateThemeButton();
  });

  function updateThemeButton() {
    const isLight = root.getAttribute('data-theme') === 'light';
    themeToggle.setAttribute('aria-pressed', String(isLight));
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
  }

  /* ---------------- 3. MOBILE NAV TOGGLE ---------------- */
  const navToggle = document.getElementById('navToggle');
  const navLinksEl = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinksEl.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile menu after clicking a link
  document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', () => {
      navLinksEl.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------------- 4. STICKY NAVBAR ON SCROLL ---------------- */
  const navbar = document.getElementById('navbar');
  const onScrollNavbar = () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 20);
  };
  document.addEventListener('scroll', onScrollNavbar, { passive: true });
  onScrollNavbar();

  /* ---------------- 5. SMOOTH SCROLL (anchor links) ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------------- 6. ACTIVE NAV LINK HIGHLIGHTING ---------------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinkMap = new Map();
  document.querySelectorAll('.nav__link').forEach(link => {
    navLinkMap.set(link.getAttribute('href').slice(1), link);
  });

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinkMap.forEach(link => link.classList.remove('active'));
        const activeLink = navLinkMap.get(entry.target.id);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => navObserver.observe(section));

  /* ---------------- 7. SCROLL REVEAL ANIMATIONS ---------------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------------- 8. TYPING EFFECT (hero role words) ---------------- */
  const typedEl = document.getElementById('typed');
  const roles = ['web.', 'people.', 'the future.', 'you.'];
  let roleIndex = 0, charIndex = 0, isDeleting = false;

  function typeLoop() {
    const currentWord = roles[roleIndex];

    if (!isDeleting) {
      charIndex++;
      typedEl.textContent = currentWord.slice(0, charIndex);
      if (charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(typeLoop, 1400);
        return;
      }
    } else {
      charIndex--;
      typedEl.textContent = currentWord.slice(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, isDeleting ? 55 : 100);
  }
  if (typedEl) typeLoop();

  /* ---------------- 9. ANIMATED COUNTERS ---------------- */
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.4 });
  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1400;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  /* ---------------- 10. SKILL PROGRESS BARS ---------------- */
  const progressBars = document.querySelectorAll('.progress__fill');
  const progressObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar = entry.target;
      bar.style.width = bar.dataset.percent + '%';
      obs.unobserve(bar);
    });
  }, { threshold: 0.4 });
  progressBars.forEach(bar => progressObserver.observe(bar));

  /* ---------------- 11. PROJECT FILTERING ---------------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !match);
      });
    });
  });

  /* ---------------- 12. CONTACT FORM VALIDATION ---------------- */
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  const fields = {
    name: { el: document.getElementById('name'), error: document.getElementById('nameError') },
    email: { el: document.getElementById('email'), error: document.getElementById('emailError') },
    subject: { el: document.getElementById('subject'), error: document.getElementById('subjectError') },
    message: { el: document.getElementById('message'), error: document.getElementById('messageError') },
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateField(key) {
    const { el, error } = fields[key];
    const value = el.value.trim();
    let message = '';

    if (!value) {
      message = 'This field is required.';
    } else if (key === 'email' && !emailPattern.test(value)) {
      message = 'Enter a valid email address.';
    } else if (key === 'message' && value.length < 10) {
      message = 'Message should be at least 10 characters.';
    }

    error.textContent = message;
    el.closest('.form-group').classList.toggle('has-error', Boolean(message));
    return !message;
  }

  Object.keys(fields).forEach(key => {
    fields[key].el.addEventListener('blur', () => validateField(key));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const results = Object.keys(fields).map(validateField);
    const isValid = results.every(Boolean);

    if (!isValid) {
      successMsg.textContent = '';
      return;
    }

    // No backend: simulate a successful send.
    successMsg.textContent = '✓ Message sent — thanks for reaching out! I\'ll reply soon.';
    form.reset();
    Object.keys(fields).forEach(key => {
      fields[key].el.closest('.form-group').classList.remove('has-error');
      fields[key].error.textContent = '';
    });

    setTimeout(() => { successMsg.textContent = ''; }, 6000);
  });

  /* ---------------- 13. BACK TO TOP BUTTON ---------------- */
  const backToTop = document.getElementById('backToTop');
  document.addEventListener('scroll', () => {
    backToTop.classList.toggle('is-visible', window.scrollY > 500);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------- 14. FOOTER YEAR ---------------- */
  document.getElementById('year').textContent = new Date().getFullYear();

});