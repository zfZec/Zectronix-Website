window.onload = async () => {
  const startTime = performance.now();
  const preloader = document.querySelector('.preloader');
  const hero = document.querySelector('#hero');
  const services = document.querySelectorAll('.service');
  const overlay = document.querySelector('#service-overlay');
  const overlayContent = document.querySelector('#overlay-content-inner');
  const canvas = document.querySelector('#particle-canvas');
  const ctx = canvas.getContext('2d');
  const toggler = document.querySelector('.navbar-toggler');
  const nav = document.querySelector('.navbar-nav');
  const navbar = document.querySelector('.navbar');

  if (!preloader) {
      console.error('Preloader element not found');
      return;
  }

  // Particle effects
  if (canvas && ctx) {
      let particles = [];
      const particleCount = 100; // Reduced for performance

      function initParticles() {
          canvas.style.width = '100%';
          canvas.style.height = '100%';
          canvas.width = window.innerWidth; // Pixel-perfect rendering
          canvas.height = window.innerHeight;
          particles = [];
          for (let i = 0; i < particleCount; i++) {
              particles.push({
                  x: Math.random() * canvas.width,
                  y: Math.random() * canvas.height,
                  radius: Math.random() * 2 + 1,
                  vx: Math.random() * 0.5 - 0.25,
                  vy: Math.random() * 0.5 - 0.25,
                  opacity: Math.random() * 0.3 + 0.1
              });
          }
          console.log(`Canvas dimensions: ${canvas.width}x${canvas.height}`);
      }

      function animateParticles() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          particles.forEach(p => {
              p.x += p.vx;
              p.y += p.vy;
              if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
              if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(185, 75, 236, ${p.opacity})`; // Purple particles
              ctx.fill();
          });
          requestAnimationFrame(animateParticles);
      }

      canvas.style.visibility = 'hidden'; // Hide until initialized
      initParticles();
      canvas.style.visibility = 'visible'; // Show after initialization
      animateParticles();
      window.addEventListener('resize', () => {
          initParticles();
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
      });
  } else {
      console.warn('Canvas or context not found, skipping particle effects');
  }

  // Load service data from services.json
  let serviceData = {};
  try {
      const response = await fetch('js/services.json');
      if (!response.ok) {
          throw new Error(`Failed to load services.json: ${response.status}`);
      }
      serviceData = await response.json();
      const validKeys = [
          'red-teaming', 'penetration-testing', 'vulnerability-assessments',
          'cyber-risk-management', 'phishing-assessment', 'managed-phishing',
          'security-training', 'password-audit'
      ];
      if (!Object.keys(serviceData).every(key => validKeys.includes(key))) {
          throw new Error('Invalid service data structure');
      }
  } catch (error) {
      console.error('Error loading service data:', error);
      preloader.classList.add('hidden');
      return;
  }

  // Hide preloader and trigger fade-in animations
  const hidePreloader = () => {
      try {
          // Ensure content is visible before hiding preloader
          if (hero) hero.style.visibility = 'visible';
          services.forEach(service => service.style.visibility = 'visible');
          
          requestAnimationFrame(() => {
              preloader.classList.add('hidden');
              const loadTime = performance.now() - startTime;
              console.log(`Preloader hidden after ${loadTime.toFixed(2)}ms`);
              setTimeout(() => {
                  if (hero) {
                      hero.classList.add('loaded');
                  } else {
                      console.warn('Hero element not found');
                  }
                  services.forEach((service, index) => {
                      setTimeout(() => {
                          if (service) {
                              service.classList.add('loaded');
                          }
                      }, index * 100); // Staggered entry animation
                  });
              }, 200); // Reduced delay
          });
      } catch (error) {
          console.error('Error hiding preloader:', error);
          preloader.classList.add('hidden');
      }
  };

  hidePreloader();

  // Reset focus on all service blocks on page load
  document.querySelectorAll('.service').forEach(link => link.blur());

  // Navbar toggle for mobile with debounce
  let toggleTimeout;
  if (toggler && nav) {
      toggler.addEventListener('click', () => {
          clearTimeout(toggleTimeout);
          toggleTimeout = setTimeout(() => {
              nav.classList.toggle('active');
              toggler.setAttribute('aria-expanded', nav.classList.contains('active'));
          }, 100);
      });
  } else {
      console.warn('Navbar toggler or nav not found');
  }

  // Smooth scrolling for nav links
  document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
          e.preventDefault();
          const href = link.getAttribute('href');
          const targetId = href.startsWith('#') ? href : href.split('#')[1];
          if (targetId) {
              const targetElement = document.querySelector(targetId);
              if (targetElement) {
                  targetElement.scrollIntoView({ behavior: 'smooth' });
                  if (nav && nav.classList.contains('active')) {
                      nav.classList.remove('active');
                      toggler.setAttribute('aria-expanded', 'false');
                  }
                  link.blur();
              } else {
                  console.warn(`Target element ${targetId} not found`);
              }
          } else {
              window.location.href = href;
          }
      });
  });

  // Close overlay function
  const closeOverlay = () => {
      overlay.classList.remove('active');
      if (navbar) {
          console.log('Fading in entire navbar on popup close');
          navbar.classList.remove('hidden');
      }
      setTimeout(() => {
          overlay.style.visibility = 'hidden';
          overlayContent.innerHTML = '';
      }, 200); // Match transition duration (0.2s)
  };

  // Service block overlay functionality with focus trapping
  services.forEach(service => {
      service.addEventListener('click', () => {
          // Fade out entire navbar on both desktop and mobile
          if (navbar) {
              console.log('Fading out entire navbar on service click');
              navbar.classList.add('hidden');
          }
          // Reset mobile navbar toggler state
          if (nav && nav.classList.contains('active')) {
              console.log('Resetting mobile navbar toggler state');
              nav.classList.remove('active');
              if (toggler) {
                  toggler.setAttribute('aria-expanded', 'false');
              }
          }
          
          const serviceId = service.getAttribute('data-service-id');
          if (serviceData[serviceId]) {
              overlayContent.innerHTML = serviceData[serviceId] || '<p>Service information is currently unavailable.</p>';
              overlay.style.visibility = 'visible';
              overlay.classList.add('active');
              const focusableElements = overlay.querySelectorAll('[tabindex="0"]');
              const firstFocusable = focusableElements[0];
              const lastFocusable = focusableElements[focusableElements.length - 1];
              overlay.addEventListener('keydown', (e) => {
                  if (e.key === 'Tab') {
                      if (e.shiftKey && document.activeElement === firstFocusable) {
                          e.preventDefault();
                          lastFocusable.focus();
                      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                          e.preventDefault();
                          firstFocusable.focus();
                      }
                  }
              });
              service.blur();
          } else {
              console.warn(`Service data for ${serviceId} not found`);
              overlayContent.innerHTML = '<p>Service information is currently unavailable.</p>';
              overlay.style.visibility = 'visible';
              overlay.classList.add('active');
          }
      });
  });

  // Close overlay on click outside
  overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
          closeOverlay();
      }
  });

  // Close overlay on Esc key
  document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
          closeOverlay();
      }
  });

  // Navbar hide/show on scroll
  let lastScrollTop = 0;
  window.addEventListener('scroll', () => {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop) {
          navbar.classList.add('hidden');
      } else {
          navbar.classList.remove('hidden');
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });
};

// Log stylesheet errors
document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
  link.addEventListener('error', () => {
      console.error(`Stylesheet failed to load: ${link.href}`);
      const preloader = document.querySelector('.preloader');
      if (preloader) {
          preloader.classList.add('hidden');
      }
  });
});