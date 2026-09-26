/**
 * Shivendra Gupta - Portfolio Interactive Controller
 * Modern Vanilla JS with zero external dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  initCardSpotlight();
  initMobileMenu();
  initScrollSpy();
  initSkillsFilter();
  initCopyEmail();
  initContactForm();
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
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
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
  const emailButtons = [
    document.getElementById('copyEmailHeroBtn'),
    document.getElementById('contactEmailCard')
  ];

  emailButtons.forEach(btn => {
    if (!btn) return;

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
 * Contact Form Handler
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill out all fields before sending.', '⚠');
      return;
    }

    // Prepare mailto link as direct action
    const mailtoSubject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
    const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    const mailtoUrl = `mailto:gupta.shivendra13@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

    // Open email client
    window.location.href = mailtoUrl;

    showToast('Opening your email client to dispatch the message...', '🚀');
    form.reset();
  });
}
