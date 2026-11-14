/**
 * ALAZAZI SOFT | العزعزي سوفت - Official Interactive Scripts
 * Lightweight, accessible, no external dependencies
 */

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
    mobileToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close mobile menu when clicking nav links
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
