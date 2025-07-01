// Loader Spinner
window.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hide');
      setTimeout(() => loader.style.display = 'none', 400);
    }, 800);
  }
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Hamburger menu for mobile
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  hamburger.classList.toggle('active');
});

// Close menu on link click (mobile)
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
  });
});

// Smooth scroll for anchor links (optional, for modern feel)
document.documentElement.style.scrollBehavior = 'smooth';

// Dark/Light Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
function setTheme(dark) {
  if (dark) {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    themeToggle.setAttribute('aria-label', 'Switch to light mode');
  } else {
    document.body.classList.remove('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.setAttribute('aria-label', 'Switch to dark mode');
  }
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}
const savedTheme = localStorage.getItem('theme');
setTheme(savedTheme ? savedTheme === 'dark' : prefersDark);
themeToggle.addEventListener('click', () => {
  setTheme(!document.body.classList.contains('dark-mode'));
});

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

// Accessibility: Hamburger menu keyboard support
hamburger.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    hamburger.click();
  }
});

// Scroll-reveal animations
const revealElements = document.querySelectorAll('.animate-fadein, .animate-up, .animate-left, .animate-right');
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

// FAB (Floating Action Button) - Scroll to Top
const fab = document.getElementById('fab');
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

// Accessibility: Keyboard nav for nav links and FAB
const links = document.querySelectorAll('.nav-link');
links.forEach(link => {
  link.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      link.click();
    }
  });
});
fab.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    fab.click();
  }
});

// Form validation and submission feedback
const form = document.getElementById('contact-form');
const nameInput = form.querySelector('#name');
const emailInput = form.querySelector('#email');
const messageInput = form.querySelector('#message');
const formStatus = document.getElementById('form-status');

function validateEmail(email) {
  const re = /^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/;
  return re.test(email);
}

function showError(input, message) {
  const errorSpan = input.nextElementSibling;
  errorSpan.textContent = message;
  input.setAttribute('aria-invalid', 'true');
}

function clearError(input) {
  const errorSpan = input.nextElementSibling;
  errorSpan.textContent = '';
  input.removeAttribute('aria-invalid');
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  if (nameInput.value.trim() === '') {
    showError(nameInput, 'Name is required.');
    valid = false;
  } else {
    clearError(nameInput);
  }

  if (!validateEmail(emailInput.value.trim())) {
    showError(emailInput, 'Please enter a valid email.');
    valid = false;
  } else {
    clearError(emailInput);
  }

  if (messageInput.value.trim() === '') {
    showError(messageInput, 'Message cannot be empty.');
    valid = false;
  } else {
    clearError(messageInput);
  }

  if (valid) {
    formStatus.textContent = 'Sending message...';
    formStatus.style.color = 'var(--color-primary)';
    // Simulate sending message
    setTimeout(() => {
      formStatus.textContent = 'Message sent successfully!';
      formStatus.style.color = 'green';
      form.reset();
    }, 1500);
  } else {
    formStatus.textContent = '';
  }
});

// SVG Redirect Button for Contact Section
const contactSvgBtn = document.getElementById('contact-svg-btn');
if (contactSvgBtn) {
  contactSvgBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'contact-success.html';
  });
}

