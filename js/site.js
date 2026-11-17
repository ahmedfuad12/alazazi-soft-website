/**
 * ALAZAZI SOFT | العزعزي سوفت - Official Interactive Scripts
 * Lightweight, accessible, no external dependencies
 */

window.ALAZAZI = window.ALAZAZI || {
  introDone: false,
  callbacks: [],
  onIntroDone: function (fn) {
    if (this.introDone) fn(); else this.callbacks.push(fn);
  },
  completeIntro: function () {
    if (this.introDone) return;
    this.introDone = true;
    document.body.classList.add('go', 'is-ready');
    this.callbacks.forEach(function (fn) { try { fn(); } catch (e) {} });
    this.callbacks.length = 0;
  },
  openDrawer: function () {},
  closeDrawer: function () {},
  debug: {
    theme: document.documentElement.dataset.theme || 'dark',
    drawerOpen: false,
    pointer: { x: 0, y: 0 },
    scroll: { y: 0, progress: 0, velocity: 0 }
  }
};

(function () {
  'use strict';

  // 1. Language Preference Management
  var currentPath = window.location.pathname;
  var currentLang = document.documentElement.lang || (currentPath.indexOf('/en/') !== -1 ? 'en' : 'ar');
  try {
    localStorage.setItem('alazazi_lang', currentLang);
  } catch (e) {}

  // 2. Header Scroll Effect
  var header = document.querySelector('.site-header');
  function handleScroll() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 3. Mobile Navigation Menu
  var mobileToggle = document.querySelector('.mobile-toggle');
  var mainNav = document.querySelector('.main-nav');
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', function (event) {
      event.preventDefault();
      if (window.ALAZAZI && window.ALAZAZI.debug.drawerOpen) {
        window.ALAZAZI.closeDrawer();
      } else if (window.ALAZAZI && window.ALAZAZI.openDrawer) {
        window.ALAZAZI.openDrawer();
      } else {
        var isOpen = mainNav.classList.toggle('open');
        mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }
    });

    var navLinks = mainNav.querySelectorAll('.nav-link, .btn');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 4. Lightbox Modal for Screenshots
  var lightbox = document.getElementById('lightbox-modal');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxClose = document.getElementById('lightbox-close');

  if (lightbox && lightboxImg) {
    var previewTriggers = document.querySelectorAll('[data-preview-src]');
    previewTriggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var src = trigger.getAttribute('data-preview-src');
        if (src) {
          lightboxImg.src = src;
          lightboxImg.alt = trigger.getAttribute('data-preview-alt') || 'Screenshot Preview';
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // 5. Contact Form Handler (WhatsApp Direct Integration)
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var statusBox = document.getElementById('form-status');
      var submitBtn = contactForm.querySelector('button[type="submit"]');

      var nameInput = document.getElementById('sender-name');
      var emailInput = document.getElementById('sender-email');
      var serviceInput = document.getElementById('service-type');
      var messageInput = document.getElementById('message-content');

      var name = (nameInput ? nameInput.value.trim() : '');
      var email = (emailInput ? emailInput.value.trim() : '');
      var service = (serviceInput ? serviceInput.value.trim() : '');
      var message = (messageInput ? messageInput.value.trim() : '');

      if (!name) {
        if (statusBox) {
          statusBox.className = 'form-status error';
          statusBox.textContent = currentLang === 'ar' ? 'يرجى إدخال الاسم الكامل.' : 'Please enter your full name.';
        }
        if (nameInput) nameInput.focus();
        return;
      }

      if (!email || email.indexOf('@') === -1) {
        if (statusBox) {
          statusBox.className = 'form-status error';
          statusBox.textContent = currentLang === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح.' : 'Please enter a valid email address.';
        }
        if (emailInput) emailInput.focus();
        return;
      }

      if (!message) {
        if (statusBox) {
          statusBox.className = 'form-status error';
          statusBox.textContent = currentLang === 'ar' ? 'يرجى كتابة تفاصيل فكرة المشروع.' : 'Please describe your project details.';
        }
        if (messageInput) messageInput.focus();
        return;
      }

      // Build formatted WhatsApp message
      var whatsappText = '';
      if (currentLang === 'ar') {
        whatsappText = 'السلام عليكم ورحمة الله وبركاته\n' +
          'طلب مشروع جديد — العزعزي سوفت\n' +
          '━━━━━━━━━━━━━━━━━━━\n' +
          '👤 الاسم: ' + name + '\n' +
          '✉️ البريد: ' + email + '\n' +
          '🛠️ الخدمة: ' + service + '\n' +
          '━━━━━━━━━━━━━━━━━━━\n' +
          '📝 تفاصيل فكرة المشروع:\n' + message;
      } else {
        whatsappText = 'Hello ALAZAZI SOFT,\n' +
          'New Project Inquiry\n' +
          '━━━━━━━━━━━━━━━━━━━\n' +
          '👤 Name: ' + name + '\n' +
          '✉️ Email: ' + email + '\n' +
          '🛠️ Service: ' + service + '\n' +
          '━━━━━━━━━━━━━━━━━━━\n' +
          '📝 Project Details:\n' + message;
      }

      var whatsappUrl = 'https://wa.me/967774121817?text=' + encodeURIComponent(whatsappText);

      if (statusBox) {
        statusBox.className = 'form-status success';
        statusBox.style.display = 'block';
        statusBox.textContent = currentLang === 'ar'
          ? 'جارٍ فتح واتساب برسالتك المجهزة... يرجى الضغط على زر الإرسال داخل التطبيق.'
          : 'Opening WhatsApp with your formatted message... Please tap send inside WhatsApp.';
      }

      // Open WhatsApp without clearing form inputs
      try {
        var win = window.open(whatsappUrl, '_blank');
        if (!win || win.closed || typeof win.closed === 'undefined') {
          // If popup blocked or on mobile redirect directly
          window.location.href = whatsappUrl;
        }
      } catch (err) {
        window.location.href = whatsappUrl;
      }
    });
  }

})();

/* =========================================================================
   Creative Experience Layer — progressive enhancements.
   Every feature degrades safely: no feature may hide content permanently.
   ========================================================================= */
(function () {
  'use strict';

  var mq = window.matchMedia || function () { return { matches: false }; };
  var reduced = mq('(prefers-reduced-motion: reduce)').matches;
  var finePointer = mq('(pointer: fine)').matches;
  var isEn = document.documentElement.lang === 'en';

  function make(tag, cls, html) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  /* Scroll progress, active navigation and back-to-top ------------------ */
  var progress = make('div', 'scroll-progress');
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);

  var backTop = make('button', 'back-top', '<svg viewBox="0 0 24 24"><path d="M12 19V5m0 0-6 6m6-6 6 6"/></svg>');
  backTop.type = 'button';
  backTop.setAttribute('aria-label', isEn ? 'Back to top' : 'العودة إلى الأعلى');
  document.body.appendChild(backTop);
  backTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  });

  var navLinks = [].slice.call(document.querySelectorAll('.nav-link[href^="#"]'));
  var navTargets = navLinks.map(function (link) {
    return { link: link, node: document.querySelector(link.getAttribute('href')) };
  }).filter(function (pair) { return !!pair.node; });

  function onScroll() {
    var doc = document.documentElement;
    var max = Math.max(1, doc.scrollHeight - window.innerHeight);
    var ratio = Math.min(1, Math.max(0, window.scrollY / max));
    progress.style.transform = 'scaleX(' + ratio.toFixed(4) + ')';
    backTop.classList.toggle('show', window.scrollY > 700);

    var current = null;
    navTargets.forEach(function (pair) {
      if (pair.node.getBoundingClientRect().top <= 170) current = pair.link;
    });
    navLinks.forEach(function (link) {
      var active = link === current;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Cinematic entry experience — once per browsing session -------------- */
  if (!reduced) {
    var seen = false;
    try { seen = sessionStorage.getItem('alazazi_intro_seen') === '1'; } catch (e) {}
    if (!seen) {
      try { sessionStorage.setItem('alazazi_intro_seen', '1'); } catch (e) {}
      try { window.scrollTo(0, 0); } catch (e) {}

      var overlay = make('div', 'intro-overlay',
        '<div class="intro-grid"></div>' +
        '<div class="intro-aura one"></div>' +
        '<div class="intro-aura two"></div>' +
        '<div class="intro-core">' +
          '<div class="intro-emblem">' +
            '<svg class="intro-mark" viewBox="0 0 100 100" aria-hidden="true">' +
              '<rect class="intro-stroke intro-frame" pathLength="1" x="6" y="6" width="88" height="88" rx="24"/>' +
              '<path class="intro-stroke intro-arc" pathLength="1" d="M27 34 17 50l10 16M73 34l10 16-10 16"/>' +
              '<path class="intro-stroke intro-violet" pathLength="1" d="M39 63 61 37"/>' +
              '<circle class="intro-stroke intro-core-dot" pathLength="1" cx="50" cy="50" r="10"/>' +
            '</svg>' +
          '</div>' +
          '<div class="intro-kicker">' + (isEn ? 'INITIALIZING EXPERIENCE' : 'تهيئة التجربة الرقمية') + '</div>' +
          '<div class="intro-name">العزعزي سوفت | ALAZAZI SOFT</div>' +
          '<div class="intro-sub">' + (isEn ? 'Crafting a precise digital environment.' : 'نبني بيئة رقمية دقيقة بمواصفات واضحة.') + '</div>' +
          '<div class="intro-progress"><span class="intro-progress-fill"></span></div>' +
          '<div class="intro-meta">' +
            '<span class="intro-percent">0%</span>' +
            '<span>ALAZAZI / SYSTEM</span>' +
          '</div>' +
        '</div>' +
        '<div class="intro-curtain"></div>');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.appendChild(overlay);

      var percentNode = overlay.querySelector('.intro-percent');
      var fillNode = overlay.querySelector('.intro-progress-fill');
      var introStart = 0;
      var introRaf = 0;

      function finishIntro() {
        if (overlay.classList.contains('is-leaving')) return;
        overlay.classList.add('is-leaving');
        window.setTimeout(function () {
          if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
          window.ALAZAZI.completeIntro();
        }, 520);
      }

      function animateIntro(now) {
        if (!introStart) introStart = now;
        var raw = Math.min(1, (now - introStart) / 900);
        var eased = 1 - Math.pow(1 - raw, 3);
        if (fillNode) fillNode.style.width = (eased * 100).toFixed(1) + '%';
        if (percentNode) percentNode.textContent = Math.round(eased * 100) + '%';
        if (raw < 1) introRaf = window.requestAnimationFrame(animateIntro);
        else finishIntro();
      }

      introRaf = window.requestAnimationFrame(animateIntro);
      window.setTimeout(finishIntro, 1150);
      window.setTimeout(function () {
        try { window.cancelAnimationFrame(introRaf); } catch (e) {}
        window.ALAZAZI.completeIntro();
      }, 2600);
    } else {
      window.ALAZAZI.completeIntro();
    }
  } else {
    window.ALAZAZI.completeIntro();
  }

  /* Hero: staggered entrance, data-field canvas, magnetic actions ------- */
  var hero = document.querySelector('.hero-section');
  if (hero) {
    var heroNodes = hero.querySelectorAll('.section-badge, .hero-title, .hero-desc, .hero-buttons, .hero-visual');
    [].forEach.call(heroNodes, function (node, i) {
      node.classList.add('hero-reveal');
      node.style.setProperty('--d', (0.08 * i).toFixed(2) + 's');
    });
    window.ALAZAZI.onIntroDone(function () { document.body.classList.add('is-ready'); });
    window.setTimeout(function () { document.body.classList.add('is-ready'); }, 2600);

    var cue = make('div', 'hero-scroll-cue', isEn ? 'Scroll' : 'اسحب للأسفل');
    cue.setAttribute('aria-hidden', 'true');
    hero.appendChild(cue);

    if (!reduced) {
      var canvas = make('canvas');
      canvas.id = 'hero-net';
      canvas.setAttribute('aria-hidden', 'true');
      hero.insertBefore(canvas, hero.firstChild);
      var ctx = canvas.getContext && canvas.getContext('2d');

      if (ctx) {
        var width = 1, height = 1, dots = [];
        var pointer = { x: -9999, y: -9999 };
        var running = false, raf = 0;
        var lastScrollY = window.scrollY || 0;
        var scrollVelocity = 0;
        window.addEventListener('scroll', function () {
          var y = window.scrollY || 0;
          scrollVelocity += (y - lastScrollY) * 0.65;
          lastScrollY = y;
        }, { passive: true });

        function resizeCanvas() {
          var rect = hero.getBoundingClientRect();
          width = Math.max(1, rect.width);
          height = Math.max(1, rect.height);
          var dpr = Math.min(2, window.devicePixelRatio || 1);
          canvas.width = Math.round(width * dpr);
          canvas.height = Math.round(height * dpr);
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          var count = Math.min(70, Math.max(18, Math.floor(width * height / 17000)));
          dots = [];
          for (var i = 0; i < count; i += 1) {
            dots.push({
              x: Math.random() * width,
              y: Math.random() * height,
              vx: (Math.random() - 0.5) * 0.32,
              vy: (Math.random() - 0.5) * 0.32,
              r: Math.random() * 1.3 + 0.9
            });
          }
        }

        function drawFrame() {
          scrollVelocity *= 0.94;
          var energy = Math.min(1, Math.abs(scrollVelocity) / 26);
          ctx.clearRect(0, 0, width, height);

          if (pointer.x > -1000) {
            var halo = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 130);
            halo.addColorStop(0, 'rgba(0,210,255,' + (0.09 + energy * 0.08).toFixed(3) + ')');
            halo.addColorStop(1, 'rgba(0,210,255,0)');
            ctx.fillStyle = halo;
            ctx.beginPath();
            ctx.arc(pointer.x, pointer.y, 130, 0, Math.PI * 2);
            ctx.fill();
          }

          for (var i = 0; i < dots.length; i += 1) {
            var p = dots[i];
            p.x += p.vx + scrollVelocity * 0.012;
            p.y += p.vy - scrollVelocity * 0.018;
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
            var dx = p.x - pointer.x;
            var dy = p.y - pointer.y;
            var d2 = dx * dx + dy * dy;
            if (d2 < 14000 && d2 > 1) {
              var force = (0.9 + energy * 0.5) / Math.sqrt(d2 + 1);
              p.x += dx * force;
              p.y += dy * force;
            }
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0,210,255,' + (0.55 + energy * 0.25).toFixed(3) + ')';
            ctx.fill();
            for (var j = i + 1; j < dots.length; j += 1) {
              var q = dots[j];
              var lx = p.x - q.x;
              var ly = p.y - q.y;
              var l2 = lx * lx + ly * ly;
              if (l2 < 12500) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(q.x, q.y);
                ctx.strokeStyle = 'rgba(124,108,255,' + ((0.2 + energy * 0.22) * (1 - l2 / 12500)).toFixed(3) + ')';
                ctx.lineWidth = 0.7 + energy * 0.4;
                ctx.stroke();
              }
            }
            if (d2 < 24000) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(pointer.x, pointer.y);
              ctx.strokeStyle = 'rgba(0,210,255,' + ((0.34 + energy * 0.16) * (1 - d2 / 24000)).toFixed(3) + ')';
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
          window.ALAZAZI.debug.scroll.velocity = scrollVelocity;
          if (running) raf = window.requestAnimationFrame(drawFrame);
        }

        function startField() {
          if (!running) { running = true; raf = window.requestAnimationFrame(drawFrame); }
        }
        function stopField() {
          running = false;
          if (raf) window.cancelAnimationFrame(raf);
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        hero.addEventListener('pointermove', function (e) {
          var rect = hero.getBoundingClientRect();
          pointer.x = e.clientX - rect.left;
          pointer.y = e.clientY - rect.top;
          window.ALAZAZI.debug.pointer.x = pointer.x;
          window.ALAZAZI.debug.pointer.y = pointer.y;
        }, { passive: true });
        hero.addEventListener('pointerleave', function () {
          pointer.x = -9999;
          pointer.y = -9999;
        });
        if ('IntersectionObserver' in window) {
          new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) startField(); else stopField();
            });
          }, { threshold: 0 }).observe(hero);
        } else {
          startField();
        }
        document.addEventListener('visibilitychange', function () {
          if (document.hidden) stopField(); else startField();
        });
      }

      [].forEach.call(hero.querySelectorAll('.btn'), function (btn) {
        btn.addEventListener('pointermove', function (e) {
          var rect = btn.getBoundingClientRect();
          var x = e.clientX - rect.left - rect.width / 2;
          var y = e.clientY - rect.top - rect.height / 2;
          btn.style.transform = 'translate(' + (x * 0.16).toFixed(1) + 'px,' + (y * 0.24).toFixed(1) + 'px)';
        }, { passive: true });
        btn.addEventListener('pointerleave', function () { btn.style.transform = ''; });
      });
    }
  }

  /* Capability marquee built from the real service titles --------------- */
  var serviceTitles = [].map.call(document.querySelectorAll('.service-card h3'), function (heading) {
    return heading.textContent.trim();
  });
  if (serviceTitles.length && hero && hero.parentNode) {
    var items = '';
    for (var pass = 0; pass < 2; pass += 1) {
      serviceTitles.forEach(function (title) { items += '<span>' + title + '</span>'; });
    }
    var marquee = make('div', 'tech-marquee', '<div class="tech-marquee-track">' + items + '</div>');
    marquee.setAttribute('aria-hidden', 'true');
    hero.parentNode.insertBefore(marquee, hero.nextSibling);
  }

  /* Scroll reveals with a timed safety net ------------------------------ */
  var revealSelector = '.section-header, .service-card, .pillar-card, .why-item, .process-card, .value-item, .project-featured-card, .project-secondary-card, .founder-box, .contact-info-card, .contact-form-box, .footer-top > div';
  var revealNodes = [].slice.call(document.querySelectorAll(revealSelector));
  revealNodes.forEach(function (node, i) {
    node.classList.add('revealable');
    node.style.setProperty('--d', ((i % 4) * 0.09).toFixed(2) + 's');
  });
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealNodes.forEach(function (node) { revealObserver.observe(node); });
  } else {
    revealNodes.forEach(function (node) { node.classList.add('in'); });
  }

  /* Spatial card interaction ------------------------------------------- */
  if (finePointer && !reduced) {
    var tiltNodes = [].slice.call(document.querySelectorAll('.service-card, .pillar-card, .why-item, .process-card, .project-featured-card, .project-secondary-card, .value-item, .contact-info-card'));
    tiltNodes.forEach(function (card) {
      card.classList.add('tilt-card');
      card.addEventListener('pointermove', function (e) {
        var rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width;
        var py = (e.clientY - rect.top) / rect.height;
        card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
        card.style.setProperty('--rx', ((0.5 - py) * 6).toFixed(2) + 'deg');
        card.style.setProperty('--ry', ((px - 0.5) * 6).toFixed(2) + 'deg');
      }, { passive: true });
      card.addEventListener('pointerleave', function () {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
        card.style.setProperty('--mx', '50%');
        card.style.setProperty('--my', '50%');
      });
    });
  }

  /* Ambient cursor glow ------------------------------------------------- */
  if (finePointer && !reduced) {
    var glow = make('div', 'cursor-glow');
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);
    var tx = -500, ty = -500, cx = -500, cy = -500;
    var glowRunning = false, glowRaf = 0;

    function followCursor() {
      glowRunning = true;
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      glow.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px)';
      glowRaf = window.requestAnimationFrame(followCursor);
    }
    window.addEventListener('pointermove', function (e) {
      tx = e.clientX - 210;
      ty = e.clientY - 210;
      if (!glowRunning) followCursor();
      glow.classList.add('visible');
    }, { passive: true });
    document.addEventListener('mouseleave', function () { glow.classList.remove('visible'); });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        glowRunning = false;
        if (glowRaf) window.cancelAnimationFrame(glowRaf);
      } else if (!glowRunning) {
        followCursor();
      }
    });
  }

})();

/* =========================================================================
   Experience System v3 — real controls, not decorative class names.
   Theme persistence · off-canvas drawer · reactive ambient background.
   ========================================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  var isEn = root.lang === 'en';
  var A = window.ALAZAZI;
  var THEME_KEY = 'alazazi_theme';

  function el(tag, cls, html) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  /* Theme system --------------------------------------------------------- */
  var themeButtons = [];
  var themeLabels = [];
  var metaTheme = document.querySelector('meta[name="theme-color"]');

  function storedTheme() {
    try {
      var value = localStorage.getItem(THEME_KEY);
      if (value === 'light' || value === 'dark') return value;
    } catch (e) {}
    return 'dark';
  }

  function applyTheme(theme, persist) {
    root.dataset.theme = theme;
    if (metaTheme) metaTheme.setAttribute('content', theme === 'light' ? '#f4f7fc' : '#040818');
    themeButtons.forEach(function (button) {
      button.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
      button.setAttribute('aria-label', theme === 'light'
        ? (isEn ? 'Switch to dark mode' : 'التبديل إلى الوضع الليلي')
        : (isEn ? 'Switch to light mode' : 'التبديل إلى الوضع النهاري'));
    });
    themeLabels.forEach(function (label) {
      label.textContent = theme === 'light'
        ? (isEn ? 'Dark mode' : 'الوضع الليلي')
        : (isEn ? 'Light mode' : 'الوضع النهاري');
    });
    if (persist) {
      try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
    }
    A.debug.theme = theme;
  }

  var moonIcon = '<svg class="icon-moon" viewBox="0 0 24 24"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg>';
  var sunIcon = '<svg class="icon-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';

  var headerTheme = el('button', 'theme-toggle', moonIcon + sunIcon);
  headerTheme.type = 'button';
  var headerContainer = document.querySelector('.header-container');
  if (headerContainer) headerContainer.appendChild(headerTheme);
  themeButtons.push(headerTheme);

  function toggleTheme() {
    applyTheme(root.dataset.theme === 'light' ? 'dark' : 'light', true);
  }
  headerTheme.addEventListener('click', toggleTheme);
  applyTheme(storedTheme(), false);

  /* Side drawer ---------------------------------------------------------- */
  var trigger = document.querySelector('.mobile-toggle');
  var brandImage = document.querySelector('.brand-logo-img');
  var logoSrc = brandImage ? brandImage.getAttribute('src') : '../assets/brand/logo-original.png';
  var activeCta = document.querySelector('.header-actions .btn');
  var ctaHref = activeCta ? activeCta.getAttribute('href') : '#contact';
  var ctaText = activeCta ? activeCta.textContent.trim() : (isEn ? 'Start Project' : 'ابدأ مشروعك');

  var backdrop = el('div', 'drawer-backdrop');
  backdrop.setAttribute('aria-hidden', 'true');
  document.body.appendChild(backdrop);

  var drawer = el('aside', 'site-drawer');
  drawer.id = 'site-drawer';
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-modal', 'true');
  drawer.setAttribute('aria-labelledby', 'drawer-title');
  drawer.setAttribute('aria-hidden', 'true');
  drawer.innerHTML =
    '<div class="drawer-head">' +
      '<div class="drawer-brand">' +
        '<img src="' + logoSrc + '" alt="">' +
        '<div><strong id="drawer-title">ALAZAZI SOFT</strong><span>Software Studio</span></div>' +
      '</div>' +
      '<button class="drawer-close" type="button" aria-label="' + (isEn ? 'Close menu' : 'إغلاق القائمة') + '">' +
        '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>' +
      '</button>' +
    '</div>' +
    '<div class="drawer-body">' +
      '<div class="drawer-eyebrow">' + (isEn ? 'NAVIGATION' : 'التنقل الرئيسي') + '</div>' +
      '<nav class="drawer-nav" aria-label="' + (isEn ? 'Drawer navigation' : 'قائمة التنقل') + '"></nav>' +
      '<div class="drawer-divider"></div>' +
      '<div class="drawer-eyebrow">' + (isEn ? 'EXPLORE' : 'صفحات إضافية') + '</div>' +
      '<div class="drawer-nav drawer-quick"></div>' +
      '<div class="drawer-divider"></div>' +
      '<div class="drawer-tools"></div>' +
      '<a class="drawer-cta" href="' + ctaHref + '">' + ctaText + '</a>' +
      '<div class="drawer-meta">' +
        (isEn
          ? 'Practical software products, built with clarity and designed to evolve.'
          : 'منتجات برمجية عملية، تُبنى بوضوح وتُصمم لتتطور.') +
      '</div>' +
    '</div>';
  document.body.appendChild(drawer);

  var drawerNav = drawer.querySelector('.drawer-nav');
  var quickNav = drawer.querySelector('.drawer-quick');
  var drawerTools = drawer.querySelector('.drawer-tools');
  var drawerClose = drawer.querySelector('.drawer-close');

  [].forEach.call(document.querySelectorAll('.main-nav .nav-link'), function (link) {
    var item = el('a');
    item.href = link.getAttribute('href');
    item.textContent = link.textContent.trim();
    if (link.classList.contains('active')) item.className = 'active';
    drawerNav.appendChild(item);
  });

  var quickPages = isEn
    ? [['services.html', 'Services'], ['projects.html', 'Projects'], ['contact.html', 'Contact']]
    : [['services.html', 'خدماتنا'], ['projects.html', 'مشاريعنا'], ['contact.html', 'تواصل معنا']];
  quickPages.forEach(function (pair) {
    var item = el('a');
    item.href = pair[0];
    item.textContent = pair[1];
    quickNav.appendChild(item);
  });

  var drawerTheme = el('button', 'drawer-tool', moonIcon + '<span data-theme-label></span>');
  drawerTheme.type = 'button';
  drawerTheme.addEventListener('click', toggleTheme);
  themeButtons.push(drawerTheme);
  themeLabels.push(drawerTheme.querySelector('[data-theme-label]'));

  var drawerLang = el('a', 'drawer-tool', '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>');
  drawerLang.href = isEn ? '../ar/index.html' : '../en/index.html';
  drawerLang.appendChild(el('span', '', isEn ? 'العربية' : 'English'));
  drawerTools.appendChild(drawerTheme);
  drawerTools.appendChild(drawerLang);
  applyTheme(root.dataset.theme, false);

  var lastFocus = null;

  function openDrawer() {
    if (A.debug.drawerOpen) return;
    lastFocus = document.activeElement;
    backdrop.classList.add('open');
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-open');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    A.debug.drawerOpen = true;
    window.setTimeout(function () { drawerClose.focus(); }, 180);
  }

  function closeDrawer() {
    if (!A.debug.drawerOpen) return;
    backdrop.classList.remove('open');
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drawer-open');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    A.debug.drawerOpen = false;
    window.setTimeout(function () {
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }, 200);
  }

  A.openDrawer = openDrawer;
  A.closeDrawer = closeDrawer;

  if (trigger) {
    trigger.setAttribute('aria-controls', 'site-drawer');
    trigger.setAttribute('aria-label', isEn ? 'Open navigation panel' : 'فتح اللوحة الجانبية');
  }

  drawerClose.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  [].forEach.call(drawer.querySelectorAll('a[href]'), function (link) {
    link.addEventListener('click', function () {
      if (link.getAttribute('href').charAt(0) === '#') closeDrawer();
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && A.debug.drawerOpen) closeDrawer();
  });

  drawer.addEventListener('keydown', function (event) {
    if (event.key !== 'Tab') return;
    var focusable = [].slice.call(drawer.querySelectorAll('a[href], button:not([disabled])'))
      .filter(function (node) { return node.offsetParent !== null; });
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  /* Reactive ambient background ----------------------------------------- */
  var ambient = el('div', 'ambient-bg');
  ambient.setAttribute('aria-hidden', 'true');
  ambient.innerHTML = '<div class="ambient-grid"></div><div class="ambient-orb ambient-orb-a"></div>' +
    '<div class="ambient-orb ambient-orb-b"></div><div class="ambient-orb ambient-orb-c"></div>';
  document.body.insertBefore(ambient, document.body.firstChild);

  var targetX = 0, targetY = 0, currentX = 0, currentY = 0;
  var scrollY = window.scrollY || 0;
  var lastScrollY = scrollY;
  var velocity = 0;
  var ambientRaf = 0;

  window.addEventListener('pointermove', function (event) {
    targetX = (event.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
    targetY = (event.clientY / Math.max(1, window.innerHeight)) * 2 - 1;
  }, { passive: true });

  window.addEventListener('scroll', function () {
    var y = window.scrollY || 0;
    velocity = y - lastScrollY;
    lastScrollY = y;
    scrollY = y;
  }, { passive: true });

  function ambientLoop() {
    currentX += (targetX - currentX) * 0.07;
    currentY += (targetY - currentY) * 0.07;
    velocity *= 0.9;
    var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    var progress = Math.min(1, Math.max(0, scrollY / max));

    var shift = scrollY * 0.12 + velocity * 3;
    ambient.style.setProperty('--grid-x', (currentX * 14).toFixed(1) + 'px');
    ambient.style.setProperty('--grid-y', (currentY * 14 + shift).toFixed(1) + 'px');
    ambient.style.setProperty('--orb-a-x', (currentX * 38).toFixed(1) + 'px');
    ambient.style.setProperty('--orb-a-y', (currentY * 30 + shift * 0.22).toFixed(1) + 'px');
    ambient.style.setProperty('--orb-b-x', (currentX * -30).toFixed(1) + 'px');
    ambient.style.setProperty('--orb-b-y', (currentY * -24 - shift * 0.14).toFixed(1) + 'px');
    ambient.style.setProperty('--orb-c-x', (currentX * 22).toFixed(1) + 'px');
    ambient.style.setProperty('--orb-c-y', (currentY * 36 + shift * 0.1).toFixed(1) + 'px');
    root.style.setProperty('--pointer-x', currentX.toFixed(3));
    root.style.setProperty('--pointer-y', currentY.toFixed(3));
    root.style.setProperty('--scroll-progress', progress.toFixed(4));
    root.style.setProperty('--scroll-velocity', velocity.toFixed(2));

    A.debug.pointer.x = Number(currentX.toFixed(3));
    A.debug.pointer.y = Number(currentY.toFixed(3));
    A.debug.scroll.y = scrollY;
    A.debug.scroll.progress = Number(progress.toFixed(4));
    A.debug.scroll.velocity = Number(velocity.toFixed(2));

    ambientRaf = window.requestAnimationFrame(ambientLoop);
  }
  ambientLoop();

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (ambientRaf) window.cancelAnimationFrame(ambientRaf);
    } else {
      ambientLoop();
    }
  });
})();
