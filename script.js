/* Small interactive behaviors: menu toggle, smooth scroll, reveal animations, project modal,
   form submission stub (demo) and resume download.
   This is vanilla JS (no frameworks). */

document.addEventListener('DOMContentLoaded', () => {
  // dynamic year
  document.getElementById('year').textContent = new Date().getFullYear();

  // mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('main-nav');
  menuToggle?.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    nav.style.display = expanded ? '' : 'flex';
  });

  // smooth anchor scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth', block:'start'});
      // collapse mobile menu after clicking
      if (window.innerWidth < 980 && nav) {
        nav.style.display = '';
        menuToggle?.setAttribute('aria-expanded','false');
      }
    });
  });

  // scroll reveal (simple)
  const revealEls = document.querySelectorAll('[data-animate]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12});

  revealEls.forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity .6s ease, transform .6s cubic-bezier(.2,.9,.3,1)';
    revealObserver.observe(el);
  });

  // floating hero cards animation (parallax on mouse)
  const hero = document.querySelector('.hero-visual');
  if (hero) {
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width - 0.5;
      const cy = (e.clientY - r.top) / r.height - 0.5;
      document.querySelectorAll('.device-card').forEach((card, i) => {
        const depth = (i+1) * 6;
        card.style.transform = `translate(${cx * depth}px, ${cy * depth}px) rotate(${(i-1) * 3}deg)`;
      });
    });
    hero.addEventListener('mouseleave', () => {
      document.querySelectorAll('.device-card').forEach((card, i) => {
        card.style.transform = '';
      });
    });
  }

  // project modal
  const modal = document.getElementById('projectModal');
  const modalTitle = document.getElementById('projTitle');
  const modalDesc = document.getElementById('projDesc');
  const modalTech = document.getElementById('projTech');
  const modalLink = document.getElementById('projLink');

  document.querySelectorAll('.project .btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const data = btn.getAttribute('data-project');
      try {
        const p = JSON.parse(data);
        modalTitle.textContent = p.title || 'Project';
        modalDesc.textContent = p.desc || '';
        modalTech.textContent = (p.tech || []).join(' • ');
        modalLink.href = p.link || '#';
        openModal();
      } catch (err) {
        console.error('Invalid project data', err);
      }
    });
  });

  function openModal(){
    modal.setAttribute('aria-hidden','false');
    // trap focus minimal
    const close = modal.querySelector('.modal-close');
    close.focus();
  }

  document.querySelectorAll('.modal-close, .modal').forEach(el => {
    el.addEventListener('click', (ev) => {
      if (ev.target === el || ev.target.classList.contains('modal-close')) {
        modal.setAttribute('aria-hidden','true');
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') modal.setAttribute('aria-hidden','true');
  });

  // contact form demo submission (no backend)
  const form = document.getElementById('contactForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending...';
    // demo behaviour — replace this with your backend or Formspree hook
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = 'Send message';
      alert('Thanks! I received your message (demo). Replace client-side stub with a real endpoint.');
      form.reset();
    }, 900);
  });

  // download resume (demo PDF creation)
  document.getElementById('downloadResume')?.addEventListener('click', () => {
    // create a small resume text file as demo; replace with a real resume URL
    const resume = [
      'Alex Dev — Web Developer',
      'Email: hello@alex.dev',
      'Stack: React, Node, Mongo, Express, Shopify, WordPress',
      'Availability: Contract / Retainer'
    ].join('\n\n');
    const blob = new Blob([resume], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Alex-Dev-Resume.txt';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  });

});
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  // Hire Me modal
  const hireModal = document.getElementById('hireMeModal');
  const openBtns = [document.getElementById('openHireModal'), document.getElementById('openHireModal2')];
  const closeBtn = hireModal.querySelector('.modal-close');
  const form = document.getElementById('hireForm');

  openBtns.forEach(btn => btn?.addEventListener('click', () => hireModal.setAttribute('aria-hidden', 'false')));
  closeBtn.addEventListener('click', () => hireModal.setAttribute('aria-hidden', 'true'));
  hireModal.addEventListener('click', e => { if (e.target === hireModal) hireModal.setAttribute('aria-hidden', 'true'); });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('clientName').value.trim();
    const email = document.getElementById('clientEmail').value.trim();
    const msg = document.getElementById('clientMsg').value.trim();
    const subject = encodeURIComponent(`Hire Request from ${name}`);
    const body = encodeURIComponent(`Hi Sharjeel,\n\nMy name is ${name} (${email}).\n\n${msg}\n\n— Sent from your portfolio`);
    window.location.href = `mailto:sharjeel.graphics.web@gmail.com?subject=${subject}&body=${body}`;
    hireModal.setAttribute('aria-hidden', 'true');
    form.reset();
  });
});
// === Animated "Hey, I'm Sharjeel Ahmad" Typing Effect ===
const animatedTitle = document.getElementById('animatedTitle');
const fullText = "Hey, I'm Sharjeel Ahmad";
let index = 0;

function typeEffect() {
  if (index < fullText.length) {
    animatedTitle.textContent += fullText.charAt(index);
    index++;
    setTimeout(typeEffect, 90); // typing speed
  } else {
    // after typing, activate gradient sweep animation
    animatedTitle.classList.add('gradient-fade');
  }
}
setTimeout(typeEffect, 600); // start delay
