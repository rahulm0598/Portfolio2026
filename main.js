/* ================================================================
   RAHUL PORTFOLIO
   Key animations:
   1. Hero photo + headline entrance
   2. Hero HORIZONTAL SLIDE on vertical scroll (Serge Studios exact)
   3. Lenis smooth scrollTo for nav links ("that fast thing")
   4. ScrollTrigger reveals throughout
   ================================================================ */


/* ── Custom Cursor — transform-only, runs on the GSAP ticker ── */
const cursorEl = document.getElementById('cursor');
const followerEl = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0, follX = 0, follY = 0;
document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
}, { passive: true });
gsap.ticker.add(() => {
  follX += (mouseX - follX) * .12; follY += (mouseY - follY) * .12;
  cursorEl.style.transform = `translate3d(${mouseX}px,${mouseY}px,0) translate(-50%,-50%)`;
  followerEl.style.transform = `translate3d(${follX}px,${follY}px,0) translate(-50%,-50%)`;
});
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
ScrollTrigger.config({ ignoreMobileResize: true });

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Split-text helpers (vanilla SplitText) ─────────────────── */
/* Wraps every char in .char spans — preserves <br> and child elements */
function wrapChars(node) {
  [...node.childNodes].forEach(child => {
    if (child.nodeType === 3) {
      const frag = document.createDocumentFragment();
      [...child.textContent].forEach(ch => {
        const s = document.createElement('span');
        s.className = 'char';
        s.textContent = ch === ' ' ? ' ' : ch;
        frag.appendChild(s);
      });
      node.replaceChild(frag, child);
    } else if (child.nodeType === 1 && child.tagName !== 'BR') {
      wrapChars(child);
    }
  });
}

/* Wraps every word in .w spans — preserves <em> etc. */
function wrapWords(node) {
  [...node.childNodes].forEach(child => {
    if (child.nodeType === 3) {
      const frag = document.createDocumentFragment();
      child.textContent.split(/(\s+)/).forEach(part => {
        if (!part.trim()) { frag.appendChild(document.createTextNode(part)); return; }
        const s = document.createElement('span');
        s.className = 'w';
        s.textContent = part;
        frag.appendChild(s);
      });
      node.replaceChild(frag, child);
    } else if (child.nodeType === 1) {
      wrapWords(child);
    }
  });
}

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
gsap.set('#hlMain', { opacity: 1 });
gsap.set('.hero-stats', { opacity: 0 });
gsap.set('#heroArrow', { opacity: 0 });
gsap.set('.hero-tech-chip', { opacity: 0, scale: 0.8, y: 10 });

/* Load: photo + "I'm Rahul." enters, stays — paused, fired by preloader */
gsap.set('#heroPhoto', { scale: isMob ? 1 : 1.08 });
const heroTl = gsap.timeline({ paused: true, defaults: { ease: 'power4.out' } });
heroTl
  .to('#heroPhoto', { opacity: 1, scale: 1, duration: isMob ? 0 : 1.6 }, 0)
  .to('#heroBrandmark', { opacity: 1, y: 0, duration: 0.8 }, 0.25)
  .to('.hl-g', { y: '0%', duration: 0.9 }, 0.45)
  .to('#heroArrow', { opacity: 1, duration: 0.6 }, 1.5)
  .to('.hero-tech-chip', { opacity: 1, scale: 1, y: 0, stagger: 0.12, duration: 0.7, ease: 'back.out(1.5)' }, 1.5);

/* ================================================================
   PRELOADER — counter ticks to 100, name exits, curtain lifts
   ================================================================ */
const preEl = document.getElementById('preloader');
const preCountEl = document.getElementById('preCounter');
const preNameEl = document.getElementById('preName');

if (reduceMotion) {
  preEl.style.display = 'none';
  heroTl.progress(1);
} else {
  wrapChars(preNameEl);
  gsap.set('#preName .char', { yPercent: 120 });
  lenis.stop();

  const cnt = { v: 0 };
  gsap.timeline({
    onComplete: () => { preEl.style.display = 'none'; lenis.start(); }
  })
    .to('#preName .char', { yPercent: 0, stagger: 0.04, duration: 0.7, ease: 'power4.out' }, 0)
    .to(cnt, {
      v: 100, duration: 1.5, ease: 'power2.inOut',
      onUpdate: () => { preCountEl.textContent = Math.round(cnt.v); }
    }, 0)
    .to('#preName .char', { yPercent: -120, stagger: 0.03, duration: 0.5, ease: 'power3.in' }, 1.3)
    .to('.pre-counter', { opacity: 0, duration: 0.3 }, 1.5)
    .to(preEl, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, 1.7)
    .add(() => heroTl.play(), 2.0);
}

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

/* Perpetual bubble float — paused when hero scrolls out of view */
const chipTweens = [
  gsap.to('#chipAngular', { y: -14, x: 6, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2.5 }),
  gsap.to('#chipAngular', { rotation: 2, duration: 3.4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2.5 }),
  gsap.to('#chipPython', { y: 12, x: -8, duration: 3.2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2.8 }),
  gsap.to('#chipPython', { rotation: -2, duration: 3.8, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2.8 }),
  gsap.to('#chipNode', { y: -10, x: 5, duration: 3.0, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 3.0 }),
  gsap.to('#chipNode', { rotation: 1.5, duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 3.0 }),
];
ScrollTrigger.create({
  trigger: '#heroOuter',
  start: 'top bottom',
  end: 'bottom top',
  onToggle: self => chipTweens.forEach(t => self.isActive ? t.play() : t.pause()),
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

/* ================================================================
   SCROLL-VELOCITY SKEW — content leans with scroll speed (desktop)
   ================================================================ */
mm.add("(min-width: 769px)", () => {
  const setters = [...document.querySelectorAll('.marquee-row, .testimonials-grid')]
    .map(el => gsap.quickSetter(el, 'skewY', 'deg'));
  const proxy = { skew: 0 };
  const clamp = gsap.utils.clamp(-5, 5);
  const apply = () => setters.forEach(set => set(proxy.skew));
  const st = ScrollTrigger.create({
    onUpdate(self) {
      const skew = clamp(self.getVelocity() / -450);
      if (Math.abs(skew) > Math.abs(proxy.skew)) {
        proxy.skew = skew;
        gsap.to(proxy, { skew: 0, duration: 0.8, ease: 'power3.out', overwrite: true, onUpdate: apply });
      }
    }
  });
  return () => st.kill();
});

/* ================================================================
   OFFSCREEN ANIMATION PAUSE — infinite CSS animations (shimmer,
   marquee, card demos) stop painting when section not visible
   ================================================================ */
const animIO = new IntersectionObserver(entries => {
  entries.forEach(en => en.target.classList.toggle('anim-off', !en.isIntersecting));
}, { rootMargin: '120px' });
document.querySelectorAll('.hero, .marquee-row, .wc-media, .hero-arrow')
  .forEach(el => animIO.observe(el));

// Refresh triggers after logic is set
ScrollTrigger.refresh();

/* ================================================================
   SCROLL REVEAL — all sections
   ================================================================ */

/* Helper: char-stagger mask reveal for big headlines */
function revealTitle(el, trigger, delay = 0) {
  const t = typeof el === 'string' ? document.querySelector(el) : el;
  if (!t) return;
  wrapChars(t);
  gsap.from(t.querySelectorAll('.char'), {
    yPercent: 120, stagger: 0.028, duration: 0.9, delay,
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
/* Word-by-word brighten as you scroll through the paragraph */
const aboutTextEl = document.getElementById('aboutText');
wrapWords(aboutTextEl);
gsap.fromTo('#aboutText .w',
  { opacity: 0.12 },
  { opacity: 1, stagger: 0.05, ease: 'none',
    scrollTrigger: { trigger: '.about-section', start: 'top 75%', end: 'center 45%', scrub: 0.5 }
  }
);
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
  let chartVisible = false;
  new IntersectionObserver(([en]) => { chartVisible = en.isIntersecting; })
    .observe(chartValEl);
  setInterval(() => {
    if (!chartVisible) return;
    const base = 2400;
    const val = base + Math.floor(Math.random() * 200 - 100);
    chartValEl.textContent = val.toLocaleString();
  }, 1200);
}

/* ================================================================
   FOOTER
   ================================================================ */
const footerBigEl = document.querySelector('.footer-big');
wrapChars(footerBigEl);
gsap.from('.footer-big .char', {
  yPercent: 120, stagger: 0.02, duration: 0.9, ease: 'power4.out',
  scrollTrigger: { trigger: '.footer', start: 'top 80%', toggleActions: 'play none none none' }
});
gsap.from('.footer-btn', {
  y: 20, opacity: 0, duration: 0.7, delay: 0.25, ease: 'power3.out',
  scrollTrigger: { trigger: '.footer', start: 'top 85%', toggleActions: 'play none none none' }
});
gsap.from('.footer-grid > div', {
  y: 24, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out',
  scrollTrigger: { trigger: '.footer-grid', start: 'top 92%', toggleActions: 'play none none none' }
});
