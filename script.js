const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const internalLinks = document.querySelectorAll('a[href^="#"]');
const revealElements = document.querySelectorAll('.reveal');
const proposalForm = document.querySelector('#proposal-form');
const formFeedback = document.querySelector('#form-feedback');

function getHeaderHeight() {
  return header ? header.offsetHeight : 0;
}

function closeMenu() {
  if (!menuToggle || !siteNav) return;
  document.body.classList.remove('menu-open');
  siteNav.classList.remove('is-open');
  siteNav.style.transform = '';
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
}

function toggleMenu() {
  if (!menuToggle || !siteNav) return;
  const isOpen = siteNav.classList.toggle('is-open');
  document.body.classList.toggle('menu-open', isOpen);
  siteNav.style.transform = isOpen ? 'translateY(0)' : '';
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
}

if (menuToggle) {
  menuToggle.addEventListener('click', toggleMenu);
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenu();
  }
});

internalLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    closeMenu();

    const top = target.getBoundingClientRect().top + window.scrollY - getHeaderHeight() - 12;
    window.scrollTo({
      top,
      behavior: 'smooth',
    });
  });
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.14,
  });

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

if (proposalForm) {
  proposalForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(proposalForm);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const message = String(formData.get('message') || '').trim();

    const whatsappMessage = [
      'Olá, GBR Desenvolvimento! Gostaria de solicitar uma proposta.',
      name ? `Nome: ${name}` : '',
      email ? `E-mail: ${email}` : '',
      phone ? `WhatsApp: ${phone}` : '',
      message ? `Mensagem: ${message}` : '',
    ].filter(Boolean).join('\n');

    if (formFeedback) {
      formFeedback.textContent = 'Abrindo WhatsApp com sua solicitação...';
    }

    const url = `https://wa.me/5549999266308?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank', 'noopener');
  });
}
