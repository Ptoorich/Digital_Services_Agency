/* ============================================
   THE BLADE & CO. — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- HAMBURGER MENU (ALL SCREEN SIZES) ----------
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
  });

  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('open');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      navToggle.classList.remove('active');
      navMenu.classList.remove('open');
      socialsDropdown.classList.remove('open');
    }
  });

  // ---------- SOCIALS DROPDOWN ----------
  const socialsBtn = document.getElementById('socialsBtn');
  const socialsDropdown = document.getElementById('socialsDropdown');

  socialsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    socialsDropdown.classList.toggle('open');
    navMenu.classList.remove('open');
    navToggle.classList.remove('active');
  });

  document.addEventListener('click', (e) => {
    if (!socialsDropdown.contains(e.target) && !socialsBtn.contains(e.target)) {
      socialsDropdown.classList.remove('open');
    }
  });

  // ---------- STICKY NAV SCROLL EFFECT ----------
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  // ---------- ACTIVE NAV LINK ON SCROLL ----------
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightNav() {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', highlightNav);

  // ---------- TESTIMONIALS CAROUSEL ----------
  const track = document.getElementById('testimonialsTrack');
  const cards = track.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let autoPlay;

  function goToSlide(index) {
    currentSlide = index;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.index));
      resetAutoPlay();
    });
  });

  function nextSlide() {
    goToSlide((currentSlide + 1) % cards.length);
  }

  function resetAutoPlay() {
    clearInterval(autoPlay);
    autoPlay = setInterval(nextSlide, 5000);
  }

  autoPlay = setInterval(nextSlide, 5000);

  // Swipe support for testimonials
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentSlide < cards.length - 1) {
        goToSlide(currentSlide + 1);
      } else if (diff < 0 && currentSlide > 0) {
        goToSlide(currentSlide - 1);
      }
      resetAutoPlay();
    }
  }, { passive: true });

  // ---------- BOOKING FORM ----------
  const form = document.getElementById('bookingForm');
  const success = document.getElementById('bookingSuccess');

  // Set minimum date to today
  const dateInput = document.getElementById('bookDate');
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name = document.getElementById('bookName').value.trim();
    const phone = document.getElementById('bookPhone').value.trim();
    const service = document.getElementById('bookService').value;
    const date = document.getElementById('bookDate').value;
    const time = document.getElementById('bookTime').value;
    const notes = document.getElementById('bookNotes').value.trim();

    if (!name || !phone || !service || !date || !time) return;

    // Format the WhatsApp message
    const serviceLabels = {
      'signature-cut': 'Signature Cut — R250',
      'fade-taper': 'Fade & Taper — R300',
      'beard-sculpt': 'Beard Sculpt — R200',
      'hot-towel-shave': 'Hot Towel Shave — R220',
      'kids-cut': 'Kids Cut — R150',
      'full-works': 'The Full Works — R650'
    };

    const dateFormatted = new Date(date + 'T00:00:00').toLocaleDateString('en-ZA', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
    });

    let msg = `Hi The Blade & Co.! I'd like to book an appointment.%0A%0A`;
    msg += `Name: ${encodeURIComponent(name)}%0A`;
    msg += `Phone: ${encodeURIComponent(phone)}%0A`;
    msg += `Service: ${encodeURIComponent(serviceLabels[service] || service)}%0A`;
    msg += `Date: ${encodeURIComponent(dateFormatted)}%0A`;
    msg += `Time: ${encodeURIComponent(time)}%0A`;
    if (notes) msg += `Notes: ${encodeURIComponent(notes)}%0A`;

    // Show success message
    form.style.display = 'none';
    success.classList.add('show');

    // Open WhatsApp with booking details
    setTimeout(() => {
      window.open(`https://wa.me/27721234567?text=${msg}`, '_blank');
    }, 500);
  });

  // ---------- LIGHTBOX ----------
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  // "View Style" buttons on pricing cards
  document.querySelectorAll('.view-style').forEach(btn => {
    btn.addEventListener('click', () => {
      openLightbox(btn.dataset.image);
    });
  });

  // Gallery items also open lightbox
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) openLightbox(img.src);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });

  // ---------- SCROLL REVEAL ANIMATIONS ----------
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.service-card, .pricing-card, .gallery-item, .info-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Stagger the grid children
  document.querySelectorAll('.services-grid, .pricing-grid, .gallery-grid').forEach(grid => {
    const children = grid.children;
    Array.from(children).forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.08}s`;
    });
  });

});
