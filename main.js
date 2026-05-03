/* ================================================================
   RAHUL PORTFOLIO
   Key animations:
   1. Hero photo + headline entrance
   2. Hero HORIZONTAL SLIDE on vertical scroll (Serge Studios exact)
   3. Lenis smooth scrollTo for nav links ("that fast thing")
   4. ScrollTrigger reveals throughout
   ================================================================ */


/* ── Custom Cursor ──────────────────────────────────────────── */
const cursorEl = document.getElementById('cursor');
const followerEl = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0, follX = 0, follY = 0;
document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursorEl.style.left = mouseX + 'px'; cursorEl.style.top = mouseY + 'px';
});
(function follow() {
  follX += (mouseX - follX) * .1; follY += (mouseY - follY) * .1;
  followerEl.style.left = follX + 'px'; followerEl.style.top = follY + 'px';
  requestAnimationFrame(follow);
})();
document.querySelectorAll('a,button,summary,.skill-pill,.work-end-link').forEach(el => {
  el.addEventListener('mouseenter', () => { cursorEl.classList.add('hover'); followerEl.classList.add('hover'); });
  el.addEventListener('mouseleave', () => { cursorEl.classList.remove('hover'); followerEl.classList.remove('hover'); });
});

/* ── Lenis smooth scroll ────────────────────────────────────── */
const lenis = new Lenis({
  duration: 1.4,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t))
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* ── GSAP setup ─────────────────────────────────────────────── */
gsap.registerPlugin(ScrollTrigger);

/* ── Navbar: white-glass on hero → dark after hero ──────────── */
ScrollTrigger.create({
  trigger: '#heroOuter',
  start: 'bottom+=0 64px',
  onEnter: () => document.getElementById('navbar').classList.add('dark'),
  onLeaveBack: () => document.getElementById('navbar').classList.remove('dark'),
});


/* ================================================================
   NAV LINK SMOOTH SCROLL
   — "that fast thing": Lenis scrollTo with snappy ease-out quart
   ================================================================ */
/* Hamburger toggle */
const hamburger = document.getElementById('hamburger');
const mobMenu   = document.getElementById('mobMenu');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobMenu.classList.toggle('open');
  });
  mobMenu.querySelectorAll('.mob-menu-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobMenu.classList.remove('open');
    });
  });
}

/* Logo + Home → scroll to very top */
['navLogo', 'navHome', 'mobHome'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('click', e => {
    e.preventDefault();
    lenis.scrollTo(0, { duration: 1.5, easing: t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2 });
  });
});

document.querySelectorAll('a[data-scroll], a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, {
      offset: -64,
      duration: 2.5,
      easing: t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
    });
  });
});

/* ================================================================
   HERO ENTRANCE — photo, brandmark, text, card, arrow
   ================================================================ */
const isMob = window.innerWidth <= 768;

gsap.set('#heroPhoto', {
  opacity: isMob ? 1 : 0,
  scale: 1,
  x: '0%',
});
gsap.set('#heroBrandmark', { opacity: 0, y: -20 });
gsap.set('.hl', { y: '110%' });
gsap.set('.hl-g', { y: '110%' });
gsap.set('.hl', { y: '110%' });
gsap.set('#hlMain', { opacity: 1 });
gsap.set('.hero-stats', { opacity: 0 });
gsap.set('#heroArrow', { opacity: 0 });
gsap.set('.hero-tech-chip', { opacity: 0, scale: 0.8, y: 10 });

/* Load: photo + "I'm Rahul." enters, stays */
const heroTl = gsap.timeline({ delay: 0.05, defaults: { ease: 'power4.out' } });
heroTl
  .to('#heroPhoto', { opacity: 1, scale: 1, duration: isMob ? 0 : 1.4 }, 0)
  .to('#heroBrandmark', { opacity: 1, y: 0, duration: 0.8 }, 0.25)
  .to('.hl-g', { y: '0%', duration: 0.9 }, 0.45)
  .to('#heroArrow', { opacity: 1, duration: 0.6 }, 1.5)
  .to('.hero-tech-chip', { opacity: 1, scale: 1, y: 0, stagger: 0.12, duration: 0.7, ease: 'back.out(1.5)' }, 1.5);

/* Stats appear with "Software engineering..." on scroll step 2 */
gsap.fromTo('.hero-stats',
  { opacity: 0, y: 16 },
  { opacity: 1, y: 0, ease: 'power3.out',
    scrollTrigger: { trigger: '#heroOuter', start: 'top+=30% top', end: 'top+=42% top', scrub: 0.4 }
  }
);

/* Scroll step 1: "I'm Rahul." exits — fromTo so it reverses cleanly on scroll up */
/* Step 1 — "I'm Rahul." exits: 5% → 22% */
gsap.fromTo('.hl-g',
  { y: '0%' },
  { y: '-110%', ease: 'power3.in',
    scrollTrigger: { trigger: '#heroOuter', start: 'top+=5% top', end: 'top+=22% top', scrub: 0.4 }
  }
);

/* Step 2 — "Software engineering..." enters: 25% → 42% */
gsap.fromTo('.hl',
  { y: '110%' },
  { y: '0%', stagger: 0.08, ease: 'power3.out',
    scrollTrigger: { trigger: '#heroOuter', start: 'top+=25% top', end: 'top+=42% top', scrub: 0.4 }
  }
);

/* Step 3 — slide 2 exits left: 72% → 84%, rests empty 84→100% before About */
gsap.fromTo('.s2-headline',
  { x: '0%' },
  { x: '-120%', ease: 'power3.in',
    scrollTrigger: { trigger: '#heroOuter', start: 'top+=72% top', end: 'top+=84% top', scrub: 0.4 }
  }
);

/* Perpetual bubble float — y + x drift + subtle rotation for organic feel */
gsap.to('#chipAngular', { y: -14, x: 6, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2.5 });
gsap.to('#chipAngular', { rotation: 2, duration: 3.4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2.5 });
gsap.to('#chipPython', { y: 12, x: -8, duration: 3.2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2.8 });
gsap.to('#chipPython', { rotation: -2, duration: 3.8, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2.8 });
gsap.to('#chipNode', { y: -10, x: 5, duration: 3.0, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 3.0 });
gsap.to('#chipNode', { rotation: 1.5, duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 3.0 });

/* Gentle card float after entrance */
gsap.to('#heroCard', {
  y: -10, duration: 2.8, repeat: -1, yoyo: true,
  ease: 'sine.inOut', delay: 2.1
});

/* ================================================================
   HERO HORIZONTAL SLIDE  (the Serge Studios signature scroll effect)

   Architecture:
   - #heroOuter is 200vh tall
   - .hero is position:sticky top:0 (stays at top for 200vh of scroll)
   - #heroSlides is 200vw wide flex row (slide1 | slide2)
   - GSAP scrubs #heroSlides x from 0 to -100vw
     as user scrolls through the SECOND 100vh of #heroOuter

   Result: the content horizontally slides from slide1 → slide2
   while the photo stays centered (it's outside the slides container)
   ================================================================ */
/* ================================================================
   RESPONSIVE ANIMATIONS — gsap.matchMedia
   ================================================================ */
// Hero slides transition works for all screens
gsap.to('#heroSlides', {
  x: '-100vw',
  ease: 'none',
  scrollTrigger: {
    trigger: '#heroOuter',
    start: 'top+=50% top',
    end:   'top+=65% top',
    scrub: 0.4,
  }
});

// Photo zoom+pan logic
const mm = gsap.matchMedia();

mm.add("(min-width: 769px)", () => {
  // Desktop: Horizontal pan
  gsap.fromTo('#heroPhoto',
    { scale: 1, x: '0%' },
    {
      scale: 1.12,
      x: '28%',
      ease: 'none',
      scrollTrigger: {
        trigger: '#heroOuter',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.6,
      }
    }
  );
  // Desktop specific tweaks if any
});

mm.add("(max-width: 768px)", () => {
  // Mobile: pan via object-position so image always fills screen, no gaps
  const photo = document.getElementById('heroPhoto');
  const proxy = { pos: 50 };
  gsap.fromTo(proxy,
    { pos: 50 },
    { pos: 80, ease: 'none',
      onUpdate: () => { photo.style.objectPosition = proxy.pos + '% center'; },
      scrollTrigger: { trigger: '#heroOuter', start: 'top top', end: 'bottom bottom', scrub: 0.8 }
    }
  );
});

// Horizontal work track — desktop only
mm.add("(min-width: 769px)", () => {
  const track = document.querySelector('.horizontal-track');
  const hSection = document.querySelector('.horizontal-section');
  if (track && hSection) {
    gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth) + 80,
      ease: 'none',
      scrollTrigger: {
        trigger: hSection,
        start: 'top top',
        end: () => '+=' + (track.scrollWidth - window.innerWidth + 80),
        scrub: 1.2, pin: true, anticipatePin: 1, invalidateOnRefresh: true,
      }
    });
  }
});

// Refresh triggers after logic is set
ScrollTrigger.refresh();

/* ================================================================
   SCROLL REVEAL — all sections
   ================================================================ */

/* Helper: clip-up reveal for big headlines */
function revealTitle(el, trigger, delay = 0) {
  gsap.from(el, {
    y: 60, opacity: 0, duration: 1.0, delay,
    ease: 'power4.out',
    scrollTrigger: { trigger, start: 'top 85%', toggleActions: 'play none none none' }
  });
}

/* Helper: fade-up for body copy / labels */
function fadeUp(el, trigger, delay = 0, stagger = 0) {
  gsap.from(el, {
    y: 30, opacity: 0, duration: 0.8, delay, stagger,
    ease: 'power3.out',
    scrollTrigger: { trigger, start: 'top 88%', toggleActions: 'play none none none' }
  });
}

/* ── ABOUT ── */
gsap.from('.about-section .section-label', {
  x: -24, opacity: 0, duration: 0.7, ease: 'power3.out',
  scrollTrigger: { trigger: '.about-section', start: 'top 85%', toggleActions: 'play none none none' }
});
revealTitle('#aboutText', '.about-section', 0.1);
fadeUp('.about-row', '.about-section', 0.25);

/* ── SKILLS ── */
gsap.from('.skills-header .section-label', {
  x: -24, opacity: 0, duration: 0.7, ease: 'power3.out',
  scrollTrigger: { trigger: '.skills-header', start: 'top 88%', toggleActions: 'play none none none' }
});
revealTitle('.skills-section .section-title', '.skills-header', 0.1);
gsap.from('.marquee-row', {
  opacity: 0, y: 28, stagger: 0.15, duration: 0.9, ease: 'power3.out',
  scrollTrigger: { trigger: '.skills-section', start: 'top 80%', toggleActions: 'play none none none' }
});

/* ── WORK ── */
gsap.from('.work-header .section-label', {
  x: -24, opacity: 0, duration: 0.7, ease: 'power3.out',
  scrollTrigger: { trigger: '.work-header', start: 'top 88%', toggleActions: 'play none none none' }
});
revealTitle('.work-header .section-title', '.work-header', 0.1);

/* Mobile-only: work cards stagger in vertically */
if (window.innerWidth <= 768) {
  gsap.from('.work-card', {
    opacity: 0, y: 40, stagger: 0.12, duration: 0.85, ease: 'power3.out',
    scrollTrigger: { trigger: '.horizontal-track', start: 'top 82%', toggleActions: 'play none none none' }
  });
}

/* ── TESTIMONIALS ── */
gsap.from('.testimonials-section .section-label', {
  x: -24, opacity: 0, duration: 0.7, ease: 'power3.out',
  scrollTrigger: { trigger: '.testimonials-section', start: 'top 85%', toggleActions: 'play none none none' }
});
gsap.set('.t-card', { y: 36 });
gsap.to('.t-card', {
  opacity: 1, y: 0, stagger: 0.1, duration: 0.85, ease: 'power3.out',
  scrollTrigger: { trigger: '.testimonials-grid', start: 'top 78%', toggleActions: 'play none none reverse' }
});

/* ── FAQ ── */
gsap.from('.faq-section .section-label', {
  x: -24, opacity: 0, duration: 0.7, ease: 'power3.out',
  scrollTrigger: { trigger: '.faq-section', start: 'top 88%', toggleActions: 'play none none none' }
});
revealTitle('.faq-section .section-title', '.faq-section', 0.1);
gsap.from('.faq-item', {
  opacity: 0, y: 18, stagger: 0.06, duration: 0.7, ease: 'power2.out',
  scrollTrigger: { trigger: '.faq-list', start: 'top 80%', toggleActions: 'play none none reverse' }
});

/* ── MAGNETIC BUTTONS
   ================================================================ */
document.querySelectorAll('.magnetic').forEach(btn => {
  const s = 0.38;
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * s, y: (e.clientY - r.top - r.height / 2) * s, duration: .4, ease: 'power2.out' });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: .7, ease: 'elastic.out(1,.35)' });
  });
});

/* ================================================================
   CARD 04 — live counter animation
   ================================================================ */
const chartValEl = document.getElementById('chartVal');
if (chartValEl) {
  setInterval(() => {
    const base = 2400;
    const val = base + Math.floor(Math.random() * 200 - 100);
    chartValEl.textContent = val.toLocaleString();
  }, 1200);
}

/* ================================================================
   FOOTER
   ================================================================ */
gsap.from('.footer-logo', {
  y: 40, opacity: 0, duration: 1.0, ease: 'power4.out',
  scrollTrigger: { trigger: '.footer', start: 'top 88%', toggleActions: 'play none none none' }
});
gsap.from('.footer-brand p, .footer-contacts', {
  y: 24, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out',
  scrollTrigger: { trigger: '.footer', start: 'top 85%', toggleActions: 'play none none none' }
});
gsap.from('.footer-cta-text', {
  y: 40, opacity: 0, duration: 1.0, ease: 'power4.out',
  scrollTrigger: { trigger: '.footer-cta', start: 'top 90%', toggleActions: 'play none none none' }
});
gsap.from('.footer-btn', {
  y: 20, opacity: 0, duration: 0.7, delay: 0.2, ease: 'power3.out',
  scrollTrigger: { trigger: '.footer-cta', start: 'top 90%', toggleActions: 'play none none none' }
});
gsap.from('.footer-bottom', {
  opacity: 0, y: 16, duration: 0.7, ease: 'power2.out',
  scrollTrigger: { trigger: '.footer-bottom', start: 'top 95%', toggleActions: 'play none none none' }
});
