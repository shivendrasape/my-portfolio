/**
 * Shivendra Gupta - Portfolio Interactive Controller
 * Modern Vanilla JS with zero external dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initCardSpotlight();
  initMobileMenu();
  initScrollSpy();
  initSkillsFilter();
  initCopyEmail();
});

/**
 * Interactive Glass Card Spotlight
 * Moves a subtle radial highlight under the mouse cursor inside glass panels
 */
function initCardSpotlight() {
  const cards = document.querySelectorAll('.glass-panel');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/**
 * Mobile Navigation Menu Toggle
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  
  if (!menuBtn || !navLinks) return;

  menuBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', isOpen.toString());
  });

  // Close menu when clicking any nav link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
      navLinks.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * ScrollSpy for Active Navigation Link
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
}

/**
 * Interactive Skills Filter
 */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button state
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'none';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
          card.style.transform = 'none';
        }
      });
    });
  });
}

/**
 * Toast Notification Helper
 */
function showToast(message, icon = '✓') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span style="color: var(--accent-cyan); font-weight: 700;">${icon}</span> <span>${message}</span>`;
  
  container.appendChild(toast);

  // Trigger entrance transition
  setTimeout(() => toast.classList.add('show'), 10);

  // Auto remove after 3.5s
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, 3500);
}

/**
 * Email Clipboard Copy Handler
 */
function initCopyEmail() {
  const emailButtons = document.querySelectorAll('[data-email]');

  emailButtons.forEach(btn => {
    const email = btn.getAttribute('data-email') || 'gupta.shivendra13@gmail.com';

    const handleCopy = () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email)
          .then(() => showToast(`Copied ${email} to clipboard!`, '✓'))
          .catch(() => fallbackCopy(email));
      } else {
        fallbackCopy(email);
      }
    };

    btn.addEventListener('click', handleCopy);

    // Keyboard support for non-button interactive elements
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleCopy();
      }
    });
  });
}

function fallbackCopy(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(`Copied ${text} to clipboard!`, '✓');
  } catch (err) {
    showToast(`Email: ${text}`, '✉');
  }
  document.body.removeChild(textArea);
}

/**
 * Theme Toggle Controller (Dark / Light Theme Switcher)
 * Respects system preference, persists choice, updates meta theme-color
 */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  const metaTheme = document.getElementById('metaThemeColor');

  const getSystemTheme = () => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const updateMetaColor = (theme) => {
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#060913' : '#f8fafc');
    }
  };

  const applyTheme = (theme, showNotification = false) => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('portfolio-theme', theme);
    } catch (e) {}
    updateMetaColor(theme);

    if (toggleBtn) {
      const nextTheme = theme === 'dark' ? 'light' : 'dark';
      toggleBtn.setAttribute('aria-label', `Switch to ${nextTheme} theme`);
      toggleBtn.setAttribute('title', `Switch to ${nextTheme} theme`);
    }

    if (showNotification) {
      showToast(`Switched to ${theme === 'dark' ? 'Dark' : 'Light'} theme`, theme === 'dark' ? '🌙' : '☀️');
    }
  };

  // Sync initial theme
  const activeTheme = document.documentElement.getAttribute('data-theme') || (function() {
    try {
      return localStorage.getItem('portfolio-theme');
    } catch (e) {
      return null;
    }
  })() || getSystemTheme();
  
  applyTheme(activeTheme, false);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const target = current === 'dark' ? 'light' : 'dark';
      applyTheme(target, true);
    });
  }

  // React to OS-level theme changes if user hasn't explicitly saved a choice
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      let saved = null;
      try {
        saved = localStorage.getItem('portfolio-theme');
      } catch (err) {}
      if (!saved) {
        applyTheme(e.matches ? 'dark' : 'light', false);
      }
    });
  }
}
