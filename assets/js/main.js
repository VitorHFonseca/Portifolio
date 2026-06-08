// ===== LOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1600);
});

// ===== PARTICLES =====
const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x     = Math.random() * canvas.width;
    this.y     = Math.random() * canvas.height;
    this.size  = Math.random() * 1.5 + .3;
    this.speedX = (Math.random() - .5) * .4;
    this.speedY = (Math.random() - .5) * .4;
    this.opacity = Math.random() * .5 + .1;
    this.color = Math.random() > .5 ? '242,200,17' : '0,120,212';
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });

  // Lines between close particles
  particles.forEach((a, i) => {
    particles.slice(i + 1).forEach(b => {
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist < 100) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(242,200,17,${.06 * (1 - dist / 100)})`;
        ctx.lineWidth = .5;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    });
  });

  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== NAVBAR =====
const navbar    = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  backToTop.classList.toggle('visible', window.scrollY > 400);
});

backToTop.addEventListener('click', () =>
  window.scrollTo({ top: 0, behavior: 'smooth' })
);

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(l =>
  l.addEventListener('click', () => navLinks.classList.remove('open'))
);

// ===== TYPED TEXT =====
const phrases = [
  'Power BI Developer',
  'N8N Automation Expert',
  'Power Automate Specialist',
  'Data Analytics Engineer',
  'Business Intelligence Lead'
];
const phrases = [
  'Power BI Developer',
  'N8N Automation Expert',
  'Power Automate Specialist',
  'Database Engineer',          // ← NOVO
  'Data Analytics Engineer',
  'Business Intelligence Lead'
];
let phraseIndex = 0, charIndex = 0, deleting = false;
const typedEl = document.getElementById('typedText');

function typeWriter() {
  const current = phrases[phraseIndex];
  if (!deleting) {
    typedEl.textContent = current.substring(0, ++charIndex);
    if (charIndex === current.length) { deleting = true; setTimeout(typeWriter, 2000); return; }
  } else {
    typedEl.textContent = current.substring(0, --charIndex);
    if (charIndex === 0) { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; }
  }
  setTimeout(typeWriter, deleting ? 50 : 90);
}
typeWriter();

// ===== COUNTER =====
function animateCounter(el) {
  const target = +el.getAttribute('data-target');
  let current  = 0;
  const step   = target / 60;
  const timer  = setInterval(() => {
    current += step;
    if (current >= target) { el.textContent = target; clearInterval(timer); }
    else el.textContent = Math.floor(current);
  }, 22);
}

// ===== SKILL BARS =====
function animateSkills() {
  document.querySelectorAll('.skill-fill').forEach(bar => {
    bar.style.width = bar.getAttribute('data-width') + '%';
  });
}

// ===== AOS (Animate on Scroll) =====
const aosObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (!entry.isIntersecting) return;
    setTimeout(() => {
      entry.target.classList.add('aos-visible');
    }, entry.target.dataset.delay || 0);
    aosObserver.unobserve(entry.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll('[data-aos]').forEach((el, i) => {
  el.dataset.delay = i * 80;
  aosObserver.observe(el);
});

// ===== SECTION OBSERVER =====
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
    if (entry.target.classList.contains('skills')) animateSkills();
    sectionObserver.unobserve(entry.target);
  });
}, { threshold: 0.2 });

document.querySelectorAll('section').forEach(s => sectionObserver.observe(s));

// ===== FILTER PROJECTS =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');
    document.querySelectorAll('.project-card').forEach(card => {
      card.classList.toggle('hidden',
        filter !== 'all' && card.getAttribute('data-category') !== filter
      );
    });
  });
});

// ===== AUTOMATION TABS =====
document.querySelectorAll('.auto-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.auto-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auto-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.getAttribute('data-tab')).classList.add('active');
  });
});

// ===== GALLERY FILTER =====
document.querySelectorAll('.gallery-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.gallery-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-gfilter');
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.classList.toggle('hidden',
        filter !== 'all' && item.getAttribute('data-gcat') !== filter
      );
    });
  });
});

// ===== LIGHTBOX =====
document.querySelectorAll('.gallery-item:not(.gallery-video)').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('.gallery-img');
    if (!img || img.style.display === 'none') return;
    document.getElementById('lightboxImg').src = img.src;
    document.getElementById('lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

// Play vídeo ao clicar
document.querySelectorAll('.gallery-video').forEach(item => {
  item.addEventListener('click', () => {
    const vid = item.querySelector('.gallery-vid');
    if (!vid) return;
    if (vid.paused) { vid.play(); item.querySelector('.gallery-hover').style.opacity = '0'; }
    else { vid.pause(); item.querySelector('.gallery-hover').style.opacity = '1'; }
  });
});

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

// ===== MODAL =====
function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  document.querySelectorAll('.modal.open, .lightbox.open').forEach(m => {
    m.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ===== FORM =====
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
  btn.disabled  = true;
  setTimeout(() => {
    formSuccess.style.display = 'block';
    contactForm.reset();
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensagem';
    btn.disabled  = false;
    setTimeout(() => formSuccess.style.display = 'none', 5000);
  }, 1500);
});

// ===== ACTIVE NAV =====
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
  });
  navAnchors.forEach(a => {
    const active = a.getAttribute('href') === `#${current}`;
    a.style.color      = active ? 'var(--primary)' : '';
    a.style.background = active ? 'rgba(242,200,17,.08)' : '';
  });
});