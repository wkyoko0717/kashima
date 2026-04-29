/**
 * プチ鹿島 Official Website — main.js
 * GSAP 3 + ScrollTrigger / Custom Cursor / Slider / Counters
 */

(() => {
  'use strict';

  // ──────────────────────────────────────────────
  // 0. GSAP SETUP
  // ──────────────────────────────────────────────
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  // ──────────────────────────────────────────────
  // 1. LOADER
  // ──────────────────────────────────────────────
  const initLoader = () => {
    const loader = document.getElementById('loader');
    const bar = document.getElementById('loaderBar');
    const subText = document.getElementById('loaderSub');
    if (!loader) return;

    // 開発用：セッション内2回目以降はローダーをスキップ
    if (sessionStorage.getItem('loaderDone')) {
      loader.remove();
      document.body.classList.remove('is-loading');
      initHeroEntrance();
      return;
    }

    const messages = ['読み込み中...', '新聞を開いています...', '準備完了'];
    let msgIdx = 0;

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(loader, {
          yPercent: -100,
          duration: 0.9,
          ease: 'expo.inOut',
          onComplete: () => {
            loader.remove();
            document.body.classList.remove('is-loading');
            sessionStorage.setItem('loaderDone', '1');
            initHeroEntrance();
          }
        });
      }
    });

    // progress bar fill
    tl.to(bar, {
      width: '100%',
      duration: 2.2,
      ease: 'power2.inOut',
      onUpdate() {
        const p = Math.round(this.progress() * 100);
        if (p > 60 && msgIdx === 0) { msgIdx++; subText.textContent = messages[1]; }
        if (p > 90 && msgIdx === 1) { msgIdx++; subText.textContent = messages[2]; }
      }
    });
  };

  // ──────────────────────────────────────────────
  // 2. HERO ENTRANCE (after loader)
  // ──────────────────────────────────────────────
  const initHeroEntrance = () => {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    // Badge
    tl.from('.hero__badge', { opacity: 0, y: 20, duration: .9 }, 0.1)

      // Label line + rule
      .from('.hl__label', {
        opacity: 0,
        x: -30,
        duration: .85,
        onStart() { this.targets()[0].style.overflow = 'visible'; }
      }, 0.25)
      .from('.hl__rule', { scaleX: 0, transformOrigin: 'left', duration: .7 }, 0.45)

      // Big name — letter by letter feel via clip + translate
      .from('.hl__name', {
        opacity: 0,
        y: 60,
        duration: 1.1,
        ease: 'expo.out',
        onStart() { this.targets()[0].style.overflow = 'visible'; }
      }, 0.5)

      .from('.hero__subtitle', { opacity: 0, y: 12, duration: .7 }, 0.8)
      .from('.hero__tagline', { opacity: 0, x: -20, duration: .8 }, 0.95)
      .from('.hero__scroll-cta', { opacity: 0, y: 10, duration: .6 }, 1.1)

      // Photo slide up
      .from('.hero__photo, .hero__photo-placeholder', {
        opacity: 0,
        y: 80,
        duration: 1.3,
        ease: 'expo.out'
      }, 0.4)

      // Fragments stagger in
      .from('.fragment', {
        opacity: 0,
        scale: .88,
        stagger: .15,
        duration: 1,
        ease: 'expo.out'
      }, 0.6)

      // BG words
      .from('.bg-word', {
        opacity: 0,
        stagger: .1,
        duration: 1.2
      }, 0.2)

      // scroll indicator
      .from('.hero__scroll-indicator', { opacity: 0, duration: .6 }, 1.4);
  };

  // ──────────────────────────────────────────────
  // 3. CUSTOM CURSOR
  // ──────────────────────────────────────────────
  const initCursor = () => {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    if (!cursor || !follower || window.matchMedia('(max-width:1023px)').matches) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    window.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(cursor, { x: mouseX, y: mouseY, duration: .08, ease: 'none' });
    });

    // Smooth follower via RAF
    const followMouse = () => {
      followerX += (mouseX - followerX) * .1;
      followerY += (mouseY - followerY) * .1;
      gsap.set(follower, { x: followerX, y: followerY });
      requestAnimationFrame(followMouse);
    };
    followMouse();

    // Hover states
    const hoverEls = document.querySelectorAll('a, button, [data-tilt], .book-card__cover');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('is-hover');
        gsap.to(follower, { scale: 2.2, borderColor: 'rgba(90,159,212,.8)', duration: .35 });
        gsap.to(cursor.querySelector('span'), { scale: .4, duration: .2 });
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-hover');
        gsap.to(follower, { scale: 1, borderColor: 'rgba(90,159,212,.5)', duration: .35 });
        gsap.to(cursor.querySelector('span'), { scale: 1, duration: .2 });
      });
    });
  };

  // ──────────────────────────────────────────────
  // 4. INK SPLASH on click
  // ──────────────────────────────────────────────
  const initInkSplash = () => {
    document.addEventListener('click', e => {
      for (let i = 0; i < 6; i++) {
        const dot = document.createElement('div');
        dot.className = 'ink-splash';
        document.body.appendChild(dot);
        const angle = (Math.random() * 360) * (Math.PI / 180);
        const dist = 30 + Math.random() * 60;
        gsap.set(dot, { x: e.clientX, y: e.clientY, scale: 0 });
        gsap.to(dot, {
          x: e.clientX + Math.cos(angle) * dist,
          y: e.clientY + Math.sin(angle) * dist,
          scale: .5 + Math.random(),
          opacity: 0,
          duration: .6 + Math.random() * .4,
          ease: 'power2.out',
          onComplete: () => dot.remove()
        });
      }
    });
  };

  // ──────────────────────────────────────────────
  // 5. HEADER — scroll detection + mobile nav
  // ──────────────────────────────────────────────
  const initHeader = () => {
    const header = document.getElementById('siteHeader');
    const toggle = document.getElementById('navToggle');
    const nav = document.getElementById('siteNav');
    if (!header) return;

    // Scroll class
    ScrollTrigger.create({
      start: 'top+=60 top',
      onEnter: () => header.classList.add('is-scrolled'),
      onLeaveBack: () => header.classList.remove('is-scrolled')
    });

    // Mobile nav toggle
    if (toggle && nav) {
      toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('is-open');
        toggle.classList.toggle('is-active', isOpen);
        toggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      // Close on nav link click
      nav.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          nav.classList.remove('is-open');
          toggle.classList.remove('is-active');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const offset = header.offsetHeight;
        gsap.to(window, {
          scrollTo: { y: target, offsetY: offset },
          duration: 1.2,
          ease: 'expo.inOut'
        });
      });
    });
  };

  // ──────────────────────────────────────────────
  // 6. HERO PARALLAX (ScrollTrigger)
  // ──────────────────────────────────────────────
  const initHeroParallax = () => {
    // BG large words — site-bg-words に統一済み

    // Fragments — subtle parallax
    const fragSpeeds = [.15, -.1, .2, -.15];
    document.querySelectorAll('.fragment').forEach((frag, i) => {
      gsap.to(frag, {
        yPercent: fragSpeeds[i % fragSpeeds.length] * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5
        }
      });
    });

    // Hero photo — parallax disabled (photo stays fixed)
    gsap.to('.hero__photo, .hero__photo-placeholder', {
      yPercent: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // Vertical accent text parallax
    gsap.to('.hero__vertical-text', {
      y: -60,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  };

  // ──────────────────────────────────────────────
  // 7. SECTION REVEALS (ScrollTrigger stagger)
  // ──────────────────────────────────────────────
  const initReveal = () => {
    // Section headers
    gsap.utils.toArray('.section-header').forEach(el => {
      gsap.from(el.children, {
        opacity: 0,
        y: 30,
        stagger: .12,
        duration: .9,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      });
    });

    // About layout
    gsap.from('.about__lead', {
      opacity: 0,
      y: 24,
      duration: 1,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.about__lead', start: 'top 88%' }
    });
    gsap.from('.about__cols p', {
      opacity: 0,
      y: 20,
      stagger: .15,
      duration: .85,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.about__cols', start: 'top 88%' }
    });
    gsap.from('.about__meta', {
      opacity: 0,
      y: 16,
      duration: .7,
      scrollTrigger: { trigger: '.about__meta', start: 'top 90%' }
    });

    // Stat cards — slide up stagger
    gsap.from('.stat-card', {
      opacity: 0,
      y: 40,
      stagger: .15,
      duration: .9,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.about__stats-col', start: 'top 85%' }
    });

    // Media blocks
    gsap.from('.media-block', {
      opacity: 0,
      y: 40,
      stagger: .15,
      duration: .9,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.media__grid', start: 'top 85%' }
    });

    // Timeline items
    gsap.utils.toArray('.tl-item').forEach((item, i) => {
      gsap.from(item, {
        opacity: 0,
        x: i % 2 === 0 ? -30 : 30,
        duration: .85,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      });
    });

    // Event cards
    gsap.from('.event-card', {
      opacity: 0,
      y: 30,
      stagger: .12,
      duration: .85,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.events__list', start: 'top 85%' }
    });

    // SNS links
    gsap.fromTo('.sns-link',
      { opacity: 0, x: -20 },
      {
        opacity: 1,
        x: 0,
        stagger: .1,
        duration: .7,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: '.sns-links',
          start: 'top 95%',
          toggleActions: 'play none none none',
          once: true
        }
      }
    );

    // Contact block
    gsap.from('.contact-block', {
      opacity: 0,
      y: 20,
      duration: .85,
      scrollTrigger: { trigger: '.contact-block', start: 'top 88%' }
    });

    // Books slider
    gsap.from('.book-card', {
      opacity: 0,
      y: 50,
      stagger: .1,
      duration: 1,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.books__slider', start: 'top 88%' }
    });

    // Marquee divider
    gsap.from('.marquee-divider', {
      opacity: 0,
      scaleX: .9,
      transformOrigin: 'left',
      duration: .7,
      scrollTrigger: { trigger: '.marquee-divider', start: 'top 95%' }
    });
  };

  // ──────────────────────────────────────────────
  // 8. COUNTER ANIMATION
  // ──────────────────────────────────────────────
  const initCounters = () => {
    document.querySelectorAll('.stat-card__num').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      if (isNaN(target)) return;
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          gsap.to({ val: 0 }, {
            val: target,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate() { el.textContent = Math.round(this.targets()[0].val); },
            onComplete() { el.textContent = target; }
          });
        }
      });
    });
  };

  // ──────────────────────────────────────────────
  // 9. BOOK COVER 3D TILT
  // ──────────────────────────────────────────────
  const initBookTilt = () => {
    document.querySelectorAll('[data-tilt]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const rotY = ((e.clientX - cx) / (rect.width / 2)) * 12;
        const rotX = -((e.clientY - cy) / (rect.height / 2)) * 12;
        gsap.to(el, {
          rotateX: rotX,
          rotateY: rotY,
          transformStyle: 'preserve-3d',
          duration: .3,
          ease: 'power2.out'
        });
        // Shine follow
        const shine = el.querySelector('.book-cover__shine');
        if (shine) {
          const pX = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
          const pY = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
          shine.style.background =
            `radial-gradient(circle at ${pX}% ${pY}%, rgba(255,255,255,.25), transparent 60%)`;
        }
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { rotateX: 0, rotateY: 0, duration: .6, ease: 'expo.out' });
        const shine = el.querySelector('.book-cover__shine');
        if (shine) shine.style.background = '';
      });
    });
  };

  // ──────────────────────────────────────────────
  // 10. BOOKS SLIDER (drag + buttons)
  // ──────────────────────────────────────────────
  const initBooksSlider = () => {
    const slider = document.getElementById('booksSlider');
    const prevBtn = document.getElementById('booksPrev');
    const nextBtn = document.getElementById('booksNext');
    const dotsWrap = document.getElementById('booksDots');
    if (!slider) return;

    const cards = slider.querySelectorAll('.book-card');
    const count = cards.length;
    let current = 0;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    // Build dots
    const dots = [];
    if (dotsWrap) {
      cards.forEach((_, i) => {
        const d = document.createElement('button');
        d.className = 'dot' + (i === 0 ? ' is-active' : '');
        d.setAttribute('aria-label', `${i + 1}枚目へ`);
        d.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(d);
        dots.push(d);
      });
    }

    const updateDots = (idx) => {
      dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
    };

    const goTo = (idx) => {
      current = Math.max(0, Math.min(idx, count - 1));
      const card = cards[current];
      gsap.to(slider, {
        scrollLeft: card.offsetLeft - slider.offsetLeft - 32,
        duration: .7,
        ease: 'expo.inOut'
      });
      updateDots(current);
    };

    prevBtn?.addEventListener('click', () => goTo(current - 1));
    nextBtn?.addEventListener('click', () => goTo(current + 1));

    // Drag / swipe
    const onDown = (e) => {
      isDown = true;
      slider.classList.add('is-dragging');
      startX = (e.pageX ?? e.touches[0].pageX) - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };
    const onUp = () => {
      if (!isDown) return;
      isDown = false;
      slider.classList.remove('is-dragging');
      // snap to nearest
      let closest = 0, minDist = Infinity;
      cards.forEach((c, i) => {
        const dist = Math.abs(c.offsetLeft - slider.scrollLeft - 32);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      goTo(closest);
    };
    const onMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = (e.pageX ?? e.touches[0].pageX) - slider.offsetLeft;
      const walk = (x - startX) * 1.4;
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener('mousedown', onDown);
    slider.addEventListener('touchstart', onDown, { passive: true });
    slider.addEventListener('mouseup', onUp);
    slider.addEventListener('touchend', onUp);
    slider.addEventListener('mouseleave', onUp);
    slider.addEventListener('mousemove', onMove);
    slider.addEventListener('touchmove', onMove, { passive: false });
  };

  // ──────────────────────────────────────────────
  // 11. NEWSPAPER COLUMN LINES parallax
  // ──────────────────────────────────────────────
  const initColumnParallax = () => {
    gsap.utils.toArray('.section__col-lines span').forEach((line, i) => {
      gsap.fromTo(line,
        { scaleY: 0, transformOrigin: 'top' },
        {
          scaleY: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: line.parentElement,
            start: 'top 80%',
            toggleActions: 'play none none none'
          },
          delay: i * .08
        }
      );
    });
  };

  // ──────────────────────────────────────────────
  // 12. FLOATING NEWSPAPER TEXT (HERO special FX)
  //     Words "浮いて消える" effect every few secs
  // ──────────────────────────────────────────────
  const initFloatingWords = () => {
    const hero = document.querySelector('.hero');
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const headlines = [
      '号外', '速報', '芸人が新聞を読む理由', '笑いで時事を切る',
      'BREAKING', 'EXTRA', '記者会見', '国会中継', '全紙比較',
      '笑えない笑い話', '時事漫談', '毎朝5紙'
    ];

    const spawn = () => {
      const word = document.createElement('div');
      word.textContent = headlines[Math.floor(Math.random() * headlines.length)];
      Object.assign(word.style, {
        position: 'absolute',
        fontFamily: '"Noto Serif JP", serif',
        fontSize: (0.7 + Math.random() * 1.1).toFixed(2) + 'rem',
        fontWeight: Math.random() > .5 ? '900' : '300',
        color: 'rgba(255,255,255,0)',
        letterSpacing: '.05em',
        pointerEvents: 'none',
        zIndex: 1,
        left: (5 + Math.random() * 85) + '%',
        top: (10 + Math.random() * 75) + '%',
        whiteSpace: 'nowrap',
        userSelect: 'none',
      });
      hero.appendChild(word);

      const col = Math.random() > .5
        ? `rgba(90,159,212,${(0.1 + Math.random() * .18).toFixed(2)})`
        : `rgba(255,255,255,${(0.06 + Math.random() * .1).toFixed(2)})`;

      gsap.timeline({ onComplete: () => word.remove() })
        .to(word, {
          color: col,
          y: -(30 + Math.random() * 50),
          duration: 2.5 + Math.random(),
          ease: 'power2.out'
        })
        .to(word, {
          color: 'rgba(255,255,255,0)',
          duration: 1.2,
          ease: 'power1.in'
        }, '-=1');
    };

    // Start spawning once hero is visible, stop when scrolled away
    const trigger = ScrollTrigger.create({
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      onEnter: () => {
        spawn();
        window._floatInterval = setInterval(spawn, 2200);
      },
      onLeave: () => clearInterval(window._floatInterval),
      onEnterBack: () => {
        spawn();
        window._floatInterval = setInterval(spawn, 2200);
      },
      onLeaveBack: () => clearInterval(window._floatInterval)
    });
  };

  // ──────────────────────────────────────────────
  // 13. TIMELINE LINE DRAW
  // ──────────────────────────────────────────────
  const initTimelineDraw = () => {
    const line = document.querySelector('.timeline::before');
    // CSS pseudo element — animate via clipPath on wrapper instead
    const tl = document.querySelector('.timeline');
    if (!tl) return;

    gsap.from(tl, {
      '--tl-progress': '0%',
      duration: 0,
    });

    // Highlight current dot
    const currentDot = document.querySelector('.tl-item--current .tl-item__dot');
    if (currentDot) {
      ScrollTrigger.create({
        trigger: currentDot,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          gsap.from(currentDot, {
            scale: 0,
            duration: .5,
            ease: 'back.out(2)'
          });
        }
      });
    }
  };

  // ──────────────────────────────────────────────

    // ── 全体背景BGワード パララックス（視差速度を変えて奥行き演出）
    const siteBgWords = document.querySelectorAll('.site-bg-word');
    const siteBgSpeeds = [-1.0, -1.0, -1.0, -1.0];
    siteBgWords.forEach((word, i) => {
      gsap.to(word, {
        yPercent: siteBgSpeeds[i] * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 2
        }
      });
    });

  // 14. SECTION BG PIN (background fixed fx)
  //     Books section gets a subtle pan
  // ──────────────────────────────────────────────
  const initBgPin = () => {
    // Media section: slight tint shift on scroll
    gsap.fromTo('.media',
      { backgroundPositionY: '0%' },
      {
        backgroundPositionY: '12%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.media',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  };

  // ──────────────────────────────────────────────
  // 15. FOOTER REVEAL
  // ──────────────────────────────────────────────
  const initFooter = () => {
    gsap.from('.footer-brand, .footer-nav, .site-footer__bottom', {
      opacity: 0,
      y: 20,
      stagger: .15,
      duration: .8,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.site-footer', start: 'top 90%' }
    });
  };

  // ──────────────────────────────────────────────
  // 16. ACTIVE NAV HIGHLIGHT on scroll
  // ──────────────────────────────────────────────
  const initActiveNav = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    const setActive = (id) => {
      navLinks.forEach(a => {
        a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
      });
    };

    sections.forEach(sec => {
      ScrollTrigger.create({
        trigger: sec,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => setActive(sec.id),
        onEnterBack: () => setActive(sec.id)
      });
    });
  };

  // ──────────────────────────────────────────────
  // 17. STAT CARD GLINT on hover
  // ──────────────────────────────────────────────
  const initStatCardGlint = () => {
    document.querySelectorAll('.stat-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.fromTo(card, {
          boxShadow: '0 0 0px rgba(90,159,212,0)'
        }, {
          boxShadow: '0 0 30px rgba(90,159,212,.35)',
          duration: .4,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut'
        });
      });
    });
  };

  // ──────────────────────────────────────────────
  // 18. NEWSPAPER FRAGMENT TILT on mousemove
  // ──────────────────────────────────────────────
  const initFragmentTilt = () => {
    if (window.matchMedia('(max-width:1279px)').matches) return;
    const fragments = document.querySelectorAll('.fragment, .np-fragment');
    window.addEventListener('mousemove', e => {
      const mx = (e.clientX / window.innerWidth - .5) * 2;
      const my = (e.clientY / window.innerHeight - .5) * 2;
      fragments.forEach((frag, i) => {
        const factor = [.008, .012, .006, .01][i] ?? .009;
        gsap.to(frag, {
          x: mx * 20 * (i % 2 === 0 ? 1 : -1),
          y: my * 15 * (i % 2 === 0 ? 1 : -1),
          rotateZ: mx * 1.5 * factor * 100,
          duration: 1.2,
          ease: 'power2.out'
        });
      });
    });
  };

  // ──────────────────────────────────────────────
  // INIT ALL
  // ──────────────────────────────────────────────
  const init = () => {
    initLoader();
    initCursor();
    initInkSplash();
    initHeader();
    initHeroParallax();
    initReveal();
    initCounters();
    initBookTilt();
    initBooksSlider();
    initColumnParallax();
    // initFloatingWords(); // 一時オフ
    initTimelineDraw();
    initBgPin();
    initFooter();
    initActiveNav();
    initStatCardGlint();
    initFragmentTilt();
  };

  // Run after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
