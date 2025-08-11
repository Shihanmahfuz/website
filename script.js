/*
  Interactive behaviours for Shihan Mahfuz portfolio
  - Intersection observers to reveal sections and animate skill bars
  - Dark/light theme toggle with persistence
  - Mobile navigation toggler
  - Contact form mailto handling
*/

document.addEventListener('DOMContentLoaded', () => {
  // IntersectionObserver to reveal hidden sections
  const observerOptions = {
    threshold: 0.15,
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        entry.target.classList.remove('hidden');
        // When skills section becomes visible, animate skill bars
        if (entry.target.id === 'skills') {
          animateSkills();
        }
      }
    });
  }, observerOptions);

  document.querySelectorAll('.hidden').forEach((el) => {
    revealObserver.observe(el);
  });

  // Animate progress bars in skills section
  function animateSkills() {
    const bars = document.querySelectorAll('.progress-value');
    bars.forEach((bar) => {
      const target = bar.getAttribute('data-percent');
      bar.style.width = target + '%';
    });
  }

  // Theme toggle functionality
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  // Load theme preference from localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    themeIcon.textContent = '🌜';
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    themeIcon.textContent = isDark ? '🌜' : '🌞';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // Mobile navigation toggle
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    // Close mobile menu when clicking a link
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // Contact form handling: open mailto with prefilled subject & body
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      const subject = encodeURIComponent('Hello from ' + name);
      const body = encodeURIComponent(message + '\n\nFrom: ' + name + ' (' + email + ')');
      window.location.href = `mailto:nm4356@nyu.edu?subject=${subject}&body=${body}`;
    });
  }

  // Scroll spy: highlight current section in nav
  // Include the stats section explicitly because it lies outside of <main>.
  const sections = document.querySelectorAll('main section, #stats');
  const navAnchors = document.querySelectorAll('.nav-links a');
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navAnchors.forEach((link) => {
          link.classList.remove('active');
          const href = link.getAttribute('href').substring(1);
          if (href === entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.2 });

  sections.forEach((section) => {
    spyObserver.observe(section);
  });

  // Ripple effect on buttons: creates a rippling circle on click for micro‑interaction
  document.querySelectorAll('.btn').forEach((button) => {
    button.addEventListener('click', function (e) {
      // ignore default behaviour for links that are anchors to other sections or downloads
      // (ripple will still show but we let the action occur)
      const rect = this.getBoundingClientRect();
      const diameter = Math.max(this.clientWidth, this.clientHeight);
      const radius = diameter / 2;
      // create the span element that will form the ripple
      const circle = document.createElement('span');
      circle.classList.add('ripple');
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      // remove any existing ripple on this button
      const existingRipple = this.querySelector('.ripple');
      if (existingRipple) {
        existingRipple.remove();
      }
      this.appendChild(circle);
      // remove the ripple after animation completes
      setTimeout(() => {
        circle.remove();
      }, 600);
    });
  });

  // Scroll progress bar: update width based on scroll position
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = scrolled + '%';
    });
  }

  // Parallax effect on hero background: move background slower than scroll
  const heroEl = document.querySelector('.hero');
  if (heroEl) {
    window.addEventListener('scroll', () => {
      const offset = window.pageYOffset;
      // adjust background position Y based on scroll; negative moves slower
      heroEl.style.backgroundPositionY = `${offset * 0.3}px`;
    });
  }

  // Interactive tilt effect on hero image and content
  const heroContent = document.querySelector('.hero-content');
  const heroImage = document.querySelector('.hero-image');
  const heroWrapper = document.querySelector('.hero');
  if (heroWrapper && heroContent && heroImage) {
    heroWrapper.addEventListener('mousemove', (e) => {
      const bounds = heroWrapper.getBoundingClientRect();
      const xRel = e.clientX - bounds.left;
      const yRel = e.clientY - bounds.top;
      // Normalize between -0.5 and 0.5
      const xRatio = (xRel / bounds.width) - 0.5;
      const yRatio = (yRel / bounds.height) - 0.5;
      const rotateX = yRatio * 10; // tilt up/down
      const rotateY = -xRatio * 10; // tilt left/right
      heroContent.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      heroImage.style.transform = `rotateX(${rotateX * 1.2}deg) rotateY(${rotateY * 1.2}deg)`;
    });
    heroWrapper.addEventListener('mouseleave', () => {
      heroContent.style.transform = '';
      heroImage.style.transform = '';
    });
  }

  // Colour palette switching functionality
  const paletteToggle = document.getElementById('palette-toggle');
  const paletteOptions = document.getElementById('palette-options');
  if (paletteToggle && paletteOptions) {
    paletteToggle.addEventListener('click', () => {
      paletteOptions.classList.toggle('show');
    });
    // Hide palette when clicking outside
    document.addEventListener('click', (e) => {
      if (!paletteOptions.contains(e.target) && !paletteToggle.contains(e.target)) {
        paletteOptions.classList.remove('show');
      }
    });
    paletteOptions.querySelectorAll('.palette-option').forEach((opt) => {
      opt.addEventListener('click', () => {
        const paletteName = opt.dataset.palette;
        applyPalette(paletteName);
        paletteOptions.classList.remove('show');
      });
    });
  }

  // Define palettes inspired by masculine colour schemes【568018998098856†L131-L181】
  function applyPalette(name) {
    const palettes = {
      default: {
        accent: '#e7473c',
        primary: '#1f1f1f',
        heroImage: 'commanding_bg.png',
      },
      corporate: {
        accent: '#8c8c8c',
        primary: '#1a4d70',
        heroImage: 'corporate_bg.png',
      },
      industrial: {
        accent: '#ff6b00',
        primary: '#2c3539',
        heroImage: 'industrial_bg.png',
      },
      athletic: {
        accent: '#dc143c',
        primary: '#0080ff',
        heroImage: 'athletic_bg.png',
      },
    };
    const selected = palettes[name] || palettes.default;
    // Override CSS variables globally via inline style on html and body.  
    // We set the custom properties on both the root (html) and body so that they
    // take precedence over values defined in :root or .dark selectors.
    const root = document.documentElement;
    const bodyEl = document.body;
    root.style.setProperty('--accent', selected.accent);
    root.style.setProperty('--primary', selected.primary);
    bodyEl.style.setProperty('--accent', selected.accent);
    bodyEl.style.setProperty('--primary', selected.primary);
    // update hero background image
    if (heroEl) {
      heroEl.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('assets/${selected.heroImage}')`;
    }
  }

  // Typewriter effect for tagline
  const typewriterEl = document.getElementById('typewriter');
  if (typewriterEl) {
    /*
      Use a bold set of roles to convey a strong, commanding personal brand.
      Words like "Leader" and "Trailblazer" reinforce confidence and authority.
    */
    const words = ['Leader', 'Entrepreneur', 'Visionary', 'Trailblazer', 'Strategist'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const currentWord = words[wordIndex];
      if (!isDeleting) {
        charIndex++;
        typewriterEl.textContent = currentWord.substring(0, charIndex);
        if (charIndex === currentWord.length) {
          setTimeout(() => {
            isDeleting = true;
            type();
          }, 1200);
          return;
        }
      } else {
        charIndex--;
        typewriterEl.textContent = currentWord.substring(0, charIndex);
        if (charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      }
      setTimeout(type, isDeleting ? 80 : 120);
    }
    type();
  }

  // Stats counters animation: animate numbers when the stats section enters view
  const statsSection = document.getElementById('stats');
  if (statsSection) {
    const statNumbers = statsSection.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          statNumbers.forEach((el) => animateCounter(el));
          statsObserver.unobserve(statsSection);
        }
      });
    }, { threshold: 0.5 });
    statsObserver.observe(statsSection);
  }

  /**
   * Incrementally animate a counter from 0 to its target value.
   * Supports optional multiplier (e.g. millions) and suffix (e.g. '+', 'M+').
   * @param {HTMLElement} el The element to animate.
   */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target) || 0;
    const multiplier = parseFloat(el.dataset.multiplier) || 1;
    const suffix = el.dataset.suffix || '';
    const finalValue = target * multiplier;
    const duration = 1500; // total animation time in ms
    const startTime = performance.now();
    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const current = Math.floor(progress * finalValue);
      // Format numbers: if multiplier >= 1e6, convert to millions with rounding
      let display;
      if (multiplier >= 1000000) {
        // convert to millions and one decimal if needed
        const millions = current / 1000000;
        display = millions.toFixed(millions < 10 ? 1 : 0);
      } else {
        display = current.toString();
      }
      el.textContent = display + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  // Custom cursor follower for a more dynamic, commanding feel
  const follower = document.createElement('div');
  follower.classList.add('cursor-follower');
  document.body.appendChild(follower);
  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    follower.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });
});