// ===== LOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1800);
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
    this.size  = Math.random() * 1.5 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.4 + 0.1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width ||
        this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(242,200,17,${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });

  // linhas entre partículas próximas
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(242,200,17,${0.06 * (1 - dist / 100)})`;
        ctx.lineWidth   = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== NAVBAR =====
const navbar    = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  backToTop.classList.toggle('visible', window.scrollY > 400);

  // active link
  const sections = document.querySelectorAll('section[id]');
  sections.forEach(sec => {
    const top    = sec.offsetTop - 100;
    const bottom = top + sec.offsetHeight;
    const link   = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
    if (link) link.classList.toggle('active', window.scrollY >= top && window.scrollY < bottom);
  });
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
  'Database Engineer',
  'Data Analytics Engineer',
  'Business Intelligence Lead'
];

let phraseIndex = 0, charIndex = 0, deleting = false;
const typedEl = document.getElementById('typedText');

function typeText() {
  if (!typedEl) return;
  const current = phrases[phraseIndex];

  if (deleting) {
    typedEl.textContent = current.substring(0, charIndex--);
    if (charIndex < 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(typeText, 500);
      return;
    }
  } else {
    typedEl.textContent = current.substring(0, charIndex++);
    if (charIndex > current.length) {
      deleting = true;
      setTimeout(typeText, 2000);
      return;
    }
  }
  setTimeout(typeText, deleting ? 60 : 100);
}
typeText();

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { el.textContent = target; clearInterval(timer); return; }
    el.textContent = Math.floor(current);
  }, 16);
}

// ===== AOS (Animate on Scroll) =====
const aosEls = document.querySelectorAll('[data-aos]');
const aosObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('aos-visible');

      // skill bars
      e.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });

      // counters
      e.target.querySelectorAll('.stat-number').forEach(n => animateCounter(n));
      aosObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

aosEls.forEach(el => aosObserver.observe(el));

// counters no hero (visível sem scroll)
const heroSection = document.getElementById('hero');
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.stat-number').forEach(n => animateCounter(n));
      heroObserver.disconnect();
    }
  });
}, { threshold: 0.3 });
if (heroSection) heroObserver.observe(heroSection);

// skill bars visíveis sem data-aos
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      skillObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.skill-card, .db-tech-card').forEach(c => skillObserver.observe(c));

// ===== FILTER PROJETOS =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !show);
    });
  });
});

// ===== AUTOMATION TABS =====
document.querySelectorAll('.auto-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.auto-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auto-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});

// ===== GALLERY FILTER =====
document.querySelectorAll('.gallery-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.gallery-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.gfilter;
    document.querySelectorAll('.gallery-item').forEach(item => {
      const show = filter === 'all' || item.dataset.gcat === filter;
      item.classList.toggle('hidden', !show);
    });
  });
});

// ===== LIGHTBOX =====
function openLightbox(src, alt) {
  const lb  = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  img.src = src;
  img.alt = alt || '';
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.gallery-item:not(.gallery-video)').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('.gallery-img');
    if (img && img.style.display !== 'none') openLightbox(img.src, img.alt);
  });
});

// play vídeo ao clicar
document.querySelectorAll('.gallery-video').forEach(item => {
  item.addEventListener('click', () => {
    const vid = item.querySelector('.gallery-vid');
    if (vid) {
      vid.style.display = 'block';
      item.querySelector('.gallery-placeholder').style.display = 'none';
      vid.play();
    }
  });
});

// ===== MODAIS =====
function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}

// fechar com ESC
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  document.querySelectorAll('.modal.open').forEach(m => {
    m.classList.remove('open');
    document.body.style.overflow = '';
  });
  closeLightbox();
});

// ===== CONTACT FORM =====
document.getElementById('contactForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const success = document.getElementById('formSuccess');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensagem';
    btn.disabled  = false;
    success.style.display = 'block';
    e.target.reset();
    setTimeout(() => success.style.display = 'none', 4000);
  }, 1500);
});

// ===== DATABASE — anima cards ao entrar na viewport =====
const dbObserver = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => {
        e.target.classList.add('aos-visible');
        // anima skill bars dentro do card
        e.target.querySelectorAll('.skill-fill').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
      }, i * 120);
      dbObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.db-tech-card, .db-code, .db-competencies').forEach(el => {
  dbObserver.observe(el);
});

// ===== DATABASE — query typing effect =====
(function dbQueryEffect() {
  const codeEl = document.querySelector('.database .code-body code');
  if (!codeEl) return;

  const originalHTML = codeEl.innerHTML;
  codeEl.innerHTML   = '';
  let visible = false;

  const queryObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !visible) {
        visible = true;
        let i = 0;
        const plain = originalHTML;
        const words = plain.split(/(?<=\s)|(?=\s)/);
        codeEl.innerHTML = '';

        const timer = setInterval(() => {
          if (i >= words.length) { clearInterval(timer); return; }
          codeEl.innerHTML += words[i];
          i++;
        }, 18);
        queryObserver.disconnect();
      }
    });
  }, { threshold: 0.4 });

  const dbSection = document.getElementById('database');
  if (dbSection) queryObserver.observe(dbSection);
})();