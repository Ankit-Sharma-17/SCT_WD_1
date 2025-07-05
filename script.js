// --- Advanced Dark Mode Toggle and Main JS Entrypoint ---
// ADVANCED DARK MODE TOGGLE
var darkModeToggle = document.getElementById('theme-toggle');
var favicon = document.querySelector('link[rel="icon"]') || document.querySelector('link[rel="shortcut icon"]');
var themeMeta = document.querySelector('meta[name="theme-color"]');
var toastTimeout;

// Toast notification
function showToast(msg) {
  let toast = document.getElementById('darkmode-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'darkmode-toast';
    toast.style.position = 'fixed';
    toast.style.bottom = '2.5rem';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = 'rgba(30,41,59,0.95)';
    toast.style.color = '#fff';
    toast.style.fontSize = '1rem';
    toast.style.padding = '0.7rem 1.5rem';
    toast.style.borderRadius = '2rem';
    toast.style.boxShadow = '0 2px 16px rgba(0,0,0,0.18)';
    toast.style.zIndex = '9999';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => { toast.style.opacity = '0'; }, 1800);
}

// Animate body background and color
function animateModeTransition() {
  document.body.style.transition = 'background 0.5s, color 0.5s';
  setTimeout(() => {
    document.body.style.transition = '';
  }, 600);
}

// Set favicon for mode (optional, fallback safe)
function setFavicon(isDark) {
  if (!favicon) return;
  // Example: swap between two favicons (add your own dark/favicon if desired)
  // favicon.href = isDark ? 'favicon-dark.svg' : 'favicon-light.svg';
}

// Set meta theme-color for mobile browser
function setThemeColor(isDark) {
  if (!themeMeta) {
    themeMeta = document.createElement('meta');
    themeMeta.name = 'theme-color';
    document.head.appendChild(themeMeta);
  }
  themeMeta.setAttribute('content', isDark ? '#18181b' : '#f8fafc');
}

// System color scheme detection
function getSystemPref() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Main setDarkMode function
function setDarkMode(enabled, show = false) {
  animateModeTransition();
  if (enabled) {
    document.documentElement.classList.add('dark');
    if (darkModeToggle) {
      var iconSpan = darkModeToggle.querySelector('.icon i');
      var textSpan = darkModeToggle.querySelector('.toggle-text');
      if (iconSpan) iconSpan.className = 'fas fa-sun';
      if (textSpan) textSpan.textContent = 'Light Mode';
    }
    setFavicon(true);
    setThemeColor(true);
    if (show) showToast('🌙 Dark mode enabled');
  } else {
    document.documentElement.classList.remove('dark');
    if (darkModeToggle) {
      var iconSpan = darkModeToggle.querySelector('.icon i');
      var textSpan = darkModeToggle.querySelector('.toggle-text');
      if (iconSpan) iconSpan.className = 'fas fa-moon';
      if (textSpan) textSpan.textContent = 'Dark Mode';
    }
    setFavicon(false);
    setThemeColor(false);
    if (show) showToast('☀️ Light mode enabled');
  }
  localStorage.setItem('mainIndexDarkMode', enabled ? '1' : '0');
}

// Initialize dark mode when DOM is ready
function initializeDarkMode() {
  // Re-find the toggle button in case it wasn't available before
  darkModeToggle = document.getElementById('theme-toggle');
  
  // Initial mode: user > system > default
  var saved = localStorage.getItem('mainIndexDarkMode');
  var initialDark = saved === '1' ? true : (saved === '0' ? false : getSystemPref());
  setDarkMode(initialDark);

  // Listen for system color scheme changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (localStorage.getItem('mainIndexDarkMode') === null) {
        setDarkMode(e.matches, true);
      }
    });
  }

  // Toggle on button click
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', function() {
      var isDark = document.documentElement.classList.contains('dark');
      setDarkMode(!isDark, true);
    });
  }

  // Keyboard shortcut: Ctrl+J
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
      var isDark = document.documentElement.classList.contains('dark');
      setDarkMode(!isDark, true);
    }
  });
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeDarkMode);
} else {
  initializeDarkMode();
}

// Rest of the script needs DOM to be ready
function initializeRestOfScript() {
  // Loader Spinner
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hide');
      setTimeout(() => loader.style.display = 'none', 400);
    }, 800);
  }

  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Mobile menu toggle for new navbar
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('opacity-0');
      mobileMenu.classList.toggle('pointer-events-none');
      mobileMenu.classList.toggle('scale-95');
      mobileMenu.classList.toggle('opacity-100');
      mobileMenu.classList.toggle('pointer-events-auto');
      mobileMenu.classList.toggle('scale-100');
    });
    
    // Close menu when clicking on mobile links
    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('opacity-0', 'pointer-events-none', 'scale-95');
        mobileMenu.classList.remove('opacity-100', 'pointer-events-auto', 'scale-100');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileMenuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.add('opacity-0', 'pointer-events-none', 'scale-95');
        mobileMenu.classList.remove('opacity-100', 'pointer-events-auto', 'scale-100');
      }
    });
  }

  // Smooth scroll for anchor links (optional, for modern feel)
  document.documentElement.style.scrollBehavior = 'smooth';

  // Button Ripple Effect
  function addRipple(e) {
    const btn = e.currentTarget;
    const circle = document.createElement('span');
    circle.classList.add('ripple');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    circle.style.width = circle.style.height = size + 'px';
    circle.style.left = (e.clientX - rect.left - size/2) + 'px';
    circle.style.top = (e.clientY - rect.top - size/2) + 'px';
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  }
  document.querySelectorAll('.cta-btn, .theme-toggle').forEach(btn => {
    btn.addEventListener('click', addRipple);
  });

  // Scroll-reveal animations
  const revealElements = document.querySelectorAll('.animate-fadein, .animate-up, .animate-left, .animate-right');
  if (window.IntersectionObserver && revealElements.length > 0) {
    const observer = new window.IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationDelay = entry.target.getAttribute('style')?.match(/animation-delay:(.*?);/)?.[1] || '0s';
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealElements.forEach(el => {
      observer.observe(el);
    });
    // Add .revealed to trigger CSS animations
    const style = document.createElement('style');
    style.innerHTML = `
    .animate-fadein.revealed { opacity: 1; animation: fadeIn 1.2s forwards; }
    .animate-up.revealed { opacity: 1; transform: translateY(0); animation: slideUp 1s forwards; }
    .animate-left.revealed { opacity: 1; transform: translateX(0); animation: slideLeft 1s forwards; }
    .animate-right.revealed { opacity: 1; transform: translateX(0); animation: slideRight 1s forwards; }
    `;
    document.head.appendChild(style);
  }

  // FAB (Floating Action Button) - Scroll to Top
  const fab = document.getElementById('fab');
  if (fab) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        fab.style.display = 'flex';
      } else {
        fab.style.display = 'none';
      }
    });
    fab.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    fab.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        fab.click();
      }
    });
  }

  // Accessibility: Keyboard nav for nav links
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    link.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        link.click();
      }
    });
  });

  // Form validation and submission feedback
  const form = document.getElementById('contact-form');
  if (form) {
    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const messageInput = form.querySelector('#message');
    const formStatus = document.getElementById('form-status');

    function validateEmail(email) {
      const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      return re.test(email);
    }

    function showError(input, message) {
      const errorSpan = input.nextElementSibling;
      if (errorSpan) errorSpan.textContent = message;
      input.setAttribute('aria-invalid', 'true');
    }

    function clearError(input) {
      const errorSpan = input.nextElementSibling;
      if (errorSpan) errorSpan.textContent = '';
      input.removeAttribute('aria-invalid');
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      if (nameInput && nameInput.value.trim() === '') {
        showError(nameInput, 'Name is required.');
        valid = false;
      } else if (nameInput) {
        clearError(nameInput);
      }

      if (emailInput && !validateEmail(emailInput.value.trim())) {
        showError(emailInput, 'Please enter a valid email.');
        valid = false;
      } else if (emailInput) {
        clearError(emailInput);
      }

      if (messageInput && messageInput.value.trim() === '') {
        showError(messageInput, 'Message cannot be empty.');
        valid = false;
      } else if (messageInput) {
        clearError(messageInput);
      }

      if (valid && formStatus) {
        formStatus.textContent = 'Sending message...';
        formStatus.style.color = 'var(--color-primary)';
        // Simulate sending message
        setTimeout(() => {
          formStatus.textContent = 'Message sent successfully!';
          formStatus.style.color = '#10b981';
          form.reset();
          setTimeout(() => {
            formStatus.textContent = '';
          }, 3000);
        }, 1500);
      }
    });

    // Real-time validation
    [nameInput, emailInput, messageInput].forEach(input => {
      if (input) {
        input.addEventListener('blur', () => {
          if (input.value.trim() === '') {
            showError(input, 'This field is required.');
          } else if (input === emailInput && !validateEmail(input.value.trim())) {
            showError(input, 'Please enter a valid email.');
          } else {
            clearError(input);
          }
        });
      }
    });
  }

  // Newsletter form
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const subscribeBtn = newsletterForm.querySelector('.subscribe-button');
    
    if (emailInput && subscribeBtn) {
      subscribeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (emailInput.value.trim() && validateEmail(emailInput.value.trim())) {
          subscribeBtn.textContent = 'Subscribed!';
          subscribeBtn.style.background = '#10b981';
          emailInput.value = '';
          setTimeout(() => {
            subscribeBtn.textContent = 'Subscribe';
            subscribeBtn.style.background = '';
          }, 2000);
        }
      });
    }
  }

  // FAB Menu functionality
  function openFabMenu() {
    const fabMenu = document.getElementById('fab-menu');
    if (fabMenu) {
      fabMenu.classList.add('open');
    }
  }

  function closeFabMenu() {
    const fabMenu = document.getElementById('fab-menu');
    if (fabMenu) {
      fabMenu.classList.remove('open');
    }
  }

  // FAB menu event listeners
  const fabMenuBtn = document.getElementById('fab-menu-btn');
  if (fabMenuBtn) {
    fabMenuBtn.addEventListener('click', openFabMenu);
  }

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#fab-menu') && !e.target.closest('#fab-menu-btn')) {
      closeFabMenu();
    }
  });
}

// Run the rest of the script when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeRestOfScript);
} else {
  initializeRestOfScript();
}