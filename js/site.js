/**
 * ALAZAZI SOFT | العزعزي سوفت - Official Interactive Experience (V2.6 Ultra)
 * High-performance, accessible, vanilla JavaScript with zero external dependencies
 */

(function () {
  'use strict';

  // 1. Accessibility & Environment Checks
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isFinePointer = window.matchMedia('(pointer: fine)').matches;
  var currentPath = window.location.pathname;
  var currentLang = document.documentElement.lang || (currentPath.indexOf('/en/') !== -1 ? 'en' : 'ar');

  try {
    localStorage.setItem('alazazi_lang', currentLang);
  } catch (e) {}

  // 2. Ultra Preloader Experience
  var preloader = document.getElementById('site-preloader');
  var isPageSeen = false;
  try {
    isPageSeen = sessionStorage.getItem('alazazi_seen') === '1';
  } catch (e) {}

  function finishPreloader() {
    if (preloader) {
      preloader.classList.add('out');
      setTimeout(function () {
        if (preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }
      }, 700);
    }
    document.body.classList.add('page-ready');
    try {
      sessionStorage.setItem('alazazi_seen', '1');
    } catch (e) {}
  }

  if (preloader) {
    if (prefersReducedMotion || isPageSeen) {
      // Instant display for returning visitors or reduced-motion preference
      finishPreloader();
    } else {
      // Sleek intro duration (1.4s) on first visit
      setTimeout(finishPreloader, 1400);
    }
  } else {
    document.body.classList.add('page-ready');
  }

  // 3. Top Scroll Reading Progress & Header Scroll Effect
  var scrollBar = document.getElementById('scroll-progress');
  var header = document.querySelector('.site-header');
  var backToTop = document.getElementById('back-to-top');

  function onScroll() {
    var scrollY = window.scrollY || window.pageYOffset;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Progress bar scale
    if (scrollBar && docHeight > 0) {
      var progress = Math.min(1, Math.max(0, scrollY / docHeight));
      scrollBar.style.transform = 'scaleX(' + progress + ')';
    }

    // Header blur state
    if (header) {
      if (scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTop) {
      if (scrollY > 500) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  // 4. Mobile Navigation Menu
  var mobileToggle = document.querySelector('.mobile-toggle');
  var mainNav = document.querySelector('.main-nav');
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    var navLinks = mainNav.querySelectorAll('.nav-link, .btn');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 5. Interactive Constellation Canvas in Hero
  var heroCanvas = document.getElementById('hero-canvas');
  var heroSection = document.querySelector('.hero-section');

  if (heroCanvas && heroSection && !prefersReducedMotion) {
    var ctx = heroCanvas.getContext('2d');
    var particles = [];
    var particleCount = window.innerWidth < 768 ? 32 : 64;
    var maxDistance = 110;
    var mouse = { x: -1000, y: -1000, radius: 140 };
    var animFrameId = null;
    var isHeroVisible = true;

    function resizeCanvas() {
      heroCanvas.width = heroSection.offsetWidth;
      heroCanvas.height = heroSection.offsetHeight;
    }

    function createParticles() {
      particles = [];
      for (var i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * heroCanvas.width,
          y: Math.random() * heroCanvas.height,
          vx: (Math.random() - 0.5) * 0.7,
          vy: (Math.random() - 0.5) * 0.7,
          radius: Math.random() * 1.8 + 1.2,
          baseAlpha: Math.random() * 0.45 + 0.35
        });
      }
    }

    function drawNetwork() {
      if (!isHeroVisible) return;
      ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);

      // Update and draw particles
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce
        if (p.x < 0 || p.x > heroCanvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > heroCanvas.height) p.vy *= -1;

        // Mouse interaction
        var dx = mouse.x - p.x;
        var dy = mouse.y - p.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          var force = (mouse.radius - dist) / mouse.radius;
          p.x -= (dx / dist) * force * 1.5;
          p.y -= (dy / dist) * force * 1.5;
        }

        // Render point
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 210, 255, ' + p.baseAlpha + ')';
        ctx.fill();

        // Connect nearby points
        for (var j = i + 1; j < particles.length; j++) {
          var p2 = particles[j];
          var dxx = p.x - p2.x;
          var dyy = p.y - p2.y;
          var d = Math.sqrt(dxx * dxx + dyy * dyy);

          if (d < maxDistance) {
            var alpha = (1 - d / maxDistance) * 0.22;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = 'rgba(0, 210, 255, ' + alpha + ')';
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }

        // Connect point to mouse
        if (dist < mouse.radius) {
          var mAlpha = (1 - dist / mouse.radius) * 0.35;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = 'rgba(56, 225, 255, ' + mAlpha + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      animFrameId = requestAnimationFrame(drawNetwork);
    }

    resizeCanvas();
    createParticles();
    drawNetwork();

    window.addEventListener('resize', function () {
      resizeCanvas();
      createParticles();
    });

    heroSection.addEventListener('pointermove', function (e) {
      var rect = heroSection.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    heroSection.addEventListener('pointerleave', function () {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    // Pause canvas loop when scrolled out of view
    if ('IntersectionObserver' in window) {
      var heroObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          isHeroVisible = entry.isIntersecting;
          if (isHeroVisible && !animFrameId) {
            drawNetwork();
          }
        });
      }, { threshold: 0.05 });
      heroObserver.observe(heroSection);
    }
  }

  // 6. Dynamic Typewriter Capability in Hero
  var typewriterEl = document.getElementById('hero-typewriter');
  if (typewriterEl) {
    var phrases = currentLang === 'ar' ? [
      'تطبيقات هواتف ذكية متكاملة وعالية الأداء',
      'أنظمة سحابية وبرمجيات مخصصة لتنظيم الأعمال',
      'منصات رقمية متينة تجمع السرعة وسهولة الاستخدام',
      'حلول برمجية متطورة تُصنع لتعمل وتُبنى لتتطور'
    ] : [
      'Native & Cross-Platform Mobile Applications',
      'Enterprise Cloud Software & Custom Systems',
      'High-Performance & Scalable Web Platforms',
      'Digital Solutions Built to Work and Engineered to Scale'
    ];

    if (prefersReducedMotion) {
      typewriterEl.textContent = phrases[0];
    } else {
      var phraseIndex = 0;
      var charIndex = 0;
      var isDeleting = false;
      var typeSpeed = 65;

      function typeLoop() {
        var currentText = phrases[phraseIndex];
        if (isDeleting) {
          typewriterEl.textContent = currentText.substring(0, charIndex--);
          typeSpeed = 35;
        } else {
          typewriterEl.textContent = currentText.substring(0, charIndex++);
          typeSpeed = 65;
        }

        if (!isDeleting && charIndex > currentText.length) {
          isDeleting = true;
          typeSpeed = 2200; // Pause after typing complete phrase
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          typeSpeed = 450;
        }

        setTimeout(typeLoop, typeSpeed);
      }

      setTimeout(typeLoop, 800);
    }
  }

  // 7. Enterprise Tech Hub: Tabs & Interactive Console
  var terminalWindow = document.querySelector('.hero-terminal-window');
  if (terminalWindow) {
    var tabBtns = terminalWindow.querySelectorAll('.term-tab');
    var panes = terminalWindow.querySelectorAll('.term-pane');

    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetTab = btn.getAttribute('data-tab');

        tabBtns.forEach(function (b) { b.classList.remove('active'); });
        panes.forEach(function (p) { p.classList.remove('active'); });

        btn.classList.add('active');
        var targetPane = document.getElementById('pane-' + targetTab);
        if (targetPane) targetPane.classList.add('active');
      });
    });

    // Console Interactive Logic
    var consoleOut = document.getElementById('console-output');
    var chipBtns = terminalWindow.querySelectorAll('.c-chip');

    var consoleResponses = {
      ar: {
        services: [
          '❯ services.list()',
          '• تطوير تطبيقات الهواتف (Android / Cross-Platform)',
          '• بناء الأنظمة السحابية والبرمجيات المخصصة',
          '• تصميم وتطوير المواقع والمنصات الرقمية'
        ],
        stack: [
          '❯ architecture.stack()',
          '• اللغات: Kotlin · Java · PHP · JavaScript / TypeScript · SQL',
          '• المنصات: Android Studio · Node.js · Cloud APIs · MySQL',
          '• المعايير: Clean Architecture · REST APIs · End-to-End Security'
        ],
        security: [
          '❯ security.verify()',
          '• تشفير البيانات محلياً وسحابياً بأحدث المعايير القياسية',
          '• حماية الصلاحيات وإدارة الجلسات ومنع الثغرات',
          '• نسخ احتياطي مؤتمت وضمان الاستمرارية العالية'
        ],
        whatsapp: [
          '❯ contact.openWhatsApp()',
          'جارٍ تجهيز الاتصال المباشر مع فريق العزعزي سوفت...'
        ]
      },
      en: {
        services: [
          '❯ services.list()',
          '• Mobile App Engineering (Android & Cross-Platform)',
          '• Custom Enterprise Software & Cloud Infrastructure',
          '• High-Performance Digital Platforms & Websites'
        ],
        stack: [
          '❯ architecture.stack()',
          '• Tech: Kotlin · Java · PHP · TypeScript · SQL',
          '• Tools: Android Studio · Node.js · REST APIs · MySQL',
          '• Standards: Clean Architecture · High Availability · Robust Security'
        ],
        security: [
          '❯ security.verify()',
          '• Advanced local & in-transit data encryption',
          '• Role-based authentication & hardened sessions',
          '• Automated disaster recovery & 99.9% uptime compliance'
        ],
        whatsapp: [
          '❯ contact.openWhatsApp()',
          'Opening direct WhatsApp channel with ALAZAZI SOFT team...'
        ]
      }
    };

    chipBtns.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var cmd = chip.getAttribute('data-cmd');
        if (!consoleOut) return;

        if (cmd === 'clear') {
          consoleOut.innerHTML = '<div class="c-line c-dim">/* Console cleared */</div>';
          return;
        }

        var lines = (consoleResponses[currentLang] && consoleResponses[currentLang][cmd]) || [];
        lines.forEach(function (lineText, idx) {
          var div = document.createElement('div');
          div.className = 'c-line ' + (idx === 0 ? 'c-cyan' : 'c-text');
          div.textContent = lineText;
          consoleOut.appendChild(div);
        });

        consoleOut.scrollTop = consoleOut.scrollHeight;

        if (cmd === 'whatsapp') {
          setTimeout(function () {
            var msg = currentLang === 'ar' ? 'السلام عليكم، أود الاستفسار عن خدمات العزعزي سوفت.' : 'Hello, I would like to inquire about ALAZAZI SOFT services.';
            window.open('https://wa.me/967774121817?text=' + encodeURIComponent(msg), '_blank');
          }, 600);
        }
      });
    });
  }

  // 8. 3D Tilt & Cursor Spotlight on Cards
  var interactiveCards = document.querySelectorAll('.card-interactive, .service-card, .value-item, .process-step, .why-card, .project-featured-card, .hero-terminal-window');
  var activeHoverCard = null;

  if (isFinePointer && !prefersReducedMotion) {
    document.addEventListener('pointermove', function (e) {
      var target = e.target.closest && e.target.closest('.card-interactive, .service-card, .value-item, .process-step, .why-card, .project-featured-card, .hero-terminal-window');

      if (activeHoverCard && activeHoverCard !== target) {
        activeHoverCard.style.setProperty('--rx', '0deg');
        activeHoverCard.style.setProperty('--ry', '0deg');
      }

      activeHoverCard = target;
      if (!target) return;

      var rect = target.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width;
      var py = (e.clientY - rect.top) / rect.height;

      target.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
      target.style.setProperty('--my', (py * 100).toFixed(1) + '%');

      // Subtle 3D perspective rotation
      var rx = ((0.5 - py) * 6).toFixed(2) + 'deg';
      var ry = ((px - 0.5) * 6).toFixed(2) + 'deg';
      target.style.setProperty('--rx', rx);
      target.style.setProperty('--ry', ry);
    });

    document.addEventListener('pointerleave', function () {
      if (activeHoverCard) {
        activeHoverCard.style.setProperty('--rx', '0deg');
        activeHoverCard.style.setProperty('--ry', '0deg');
      }
    });
  }

  // 9. Desktop Ambient Cursor Follower
  if (isFinePointer && !prefersReducedMotion) {
    var cursorGlow = document.createElement('div');
    cursorGlow.id = 'cursor-glow';
    document.body.appendChild(cursorGlow);

    var curX = window.innerWidth / 2;
    var curY = window.innerHeight / 2;
    var tgtX = curX;
    var tgtY = curY;

    window.addEventListener('pointermove', function (e) {
      tgtX = e.clientX;
      tgtY = e.clientY;
    });

    function loopCursorGlow() {
      curX += (tgtX - curX) * 0.12;
      curY += (tgtY - curY) * 0.12;
      cursorGlow.style.transform = 'translate(' + (curX - 210) + 'px, ' + (curY - 210) + 'px)';
      requestAnimationFrame(loopCursorGlow);
    }
    loopCursorGlow();
  }

  // 10. HUD Site Toast Notification Utility
  var toastEl = document.getElementById('site-toast');
  var toastTimer = null;
  function showToast(msg, duration) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.id = 'site-toast';
      toastEl.className = 'site-toast';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('show');
    }, duration || 2200);
  }
  window.showToast = showToast;

  // 11. Copy to Clipboard Utility for Phones & Emails
  var copyButtons = document.querySelectorAll('[data-copy]');
  copyButtons.forEach(function (btn) {
    btn.addEventListener('click', async function () {
      var textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;
      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast(currentLang === 'ar' ? 'تم النسخ إلى الحافظة: ' + textToCopy : 'Copied to clipboard: ' + textToCopy);
      } catch (err) {
        showToast(textToCopy);
      }
    });
  });

  // 12. Lightbox Modal for Screenshots
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

  // 13. Contact Form Handler (WhatsApp Direct Integration)
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var statusBox = document.getElementById('form-status');

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
        whatsappText = 'السلام عليكم ورحمة الله وبركاته
' +
          'طلب مشروع جديد — العزعزي سوفت
' +
          '━━━━━━━━━━━━━━━━━━━
' +
          '👤 الاسم: ' + name + '
' +
          '✉️ البريد: ' + email + '
' +
          '🛠️ الخدمة: ' + service + '
' +
          '━━━━━━━━━━━━━━━━━━━
' +
          '📝 تفاصيل فكرة المشروع:
' + message;
      } else {
        whatsappText = 'Hello ALAZAZI SOFT,
' +
          'New Project Inquiry
' +
          '━━━━━━━━━━━━━━━━━━━
' +
          '👤 Name: ' + name + '
' +
          '✉️ Email: ' + email + '
' +
          '🛠️ Service: ' + service + '
' +
          '━━━━━━━━━━━━━━━━━━━
' +
          '📝 Project Details:
' + message;
      }

      var whatsappUrl = 'https://wa.me/967774121817?text=' + encodeURIComponent(whatsappText);

      if (statusBox) {
        statusBox.className = 'form-status success';
        statusBox.style.display = 'block';
        statusBox.textContent = currentLang === 'ar'
          ? 'جارٍ فتح واتساب برسالتك المجهزة... يرجى الضغط على زر الإرسال داخل التطبيق.'
          : 'Opening WhatsApp with your formatted message... Please tap send inside WhatsApp.';
      }

      showToast(currentLang === 'ar' ? 'جارٍ فتح واتساب...' : 'Opening WhatsApp...', 1800);

      // Open WhatsApp without clearing form inputs
      try {
        var win = window.open(whatsappUrl, '_blank');
        if (!win || win.closed || typeof win.closed === 'undefined') {
          window.location.href = whatsappUrl;
        }
      } catch (err) {
        window.location.href = whatsappUrl;
      }
    });
  }

})();
