document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.querySelector('.preloader');
    const hero = document.querySelector('#hero');
    const services = document.querySelectorAll('.service');

    // Hide preloader
    const hidePreloader = () => {
        try {
            console.log('Hiding preloader...');
            if (hero) {
                hero.style.visibility = 'visible';
                hero.style.opacity = '1';
                hero.classList.add('visible');
            }
            services.forEach(service => {
                service.style.visibility = 'visible';
                service.style.opacity = '1';
                service.classList.add('visible'); // Ensure immediate visibility
                void service.offsetWidth; // Force repaint
            });
            requestAnimationFrame(() => {
                preloader.classList.add('hidden');
                preloader.style.display = 'none';
                console.log('Preloader hidden');
                services.forEach(service => {
                    service.style.willChange = 'transform, opacity';
                    setTimeout(() => service.style.willChange = 'auto', 100);
                });
            });
        } catch (error) {
            console.error('Error hiding preloader:', error.message);
            preloader.classList.add('hidden');
            preloader.style.display = 'none';
        }
    };

    if (preloader) hidePreloader();

    // Force repaint for service boxes to enable hover
    const forceRepaint = () => {
        services.forEach(service => {
            void service.offsetWidth;
            service.style.pointerEvents = 'auto';
        });
    };
    forceRepaint();

    // Debug hover events and reset on unhover (remove in production)
    services.forEach(service => {
        service.addEventListener('mouseenter', () => {
            console.log(`Hover detected on ${service.getAttribute('data-service-id')}`);
        });
        service.addEventListener('mouseleave', () => {
            service.style.transform = 'translateY(0)';
            service.style.animation = 'none';
        });
        // Simulate hover on touch devices
        service.addEventListener('touchstart', () => {
            service.classList.add('hovered');
            setTimeout(() => service.classList.remove('hovered'), 400);
        });
    });
});

window.onload = async () => {
    try {
        const canvas = document.querySelector('#particle-canvas');
        const ctx = canvas?.getContext('2d');
        const navbar = document.querySelector('.navbar');
        const overlay = document.querySelector('#service-overlay');
        const overlayContent = document.querySelector('#overlay-content-inner');

        // Particle effects
        if (canvas && ctx) {
            let particles = [];
            const particleCount = 100;

            function initParticles() {
                canvas.style.width = '100%';
                canvas.style.height = '100%';
                canvas.width = window.innerWidth;
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
                console.log('Particles initialized');
            }

            function animateParticles() {
                if (document.hidden) {
                    requestAnimationFrame(animateParticles);
                    return;
                }
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;
                    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(185, 75, 236, ${p.opacity})`;
                    ctx.fill();
                });
                requestAnimationFrame(animateParticles);
            }

            canvas.style.visibility = 'hidden';
            initParticles();
            canvas.style.visibility = 'visible';
            animateParticles();
            window.addEventListener('resize', () => {
                initParticles();
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            });
        } else {
            console.warn('Canvas or context not found, skipping particle effects');
        }

        // Scroll animations with IntersectionObserver
        const animateElements = document.querySelectorAll('.animate-on-scroll');
        try {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                        console.log(`Element visible: ${entry.target.id || entry.target.className}`);
                    }
                });
            }, {
                threshold: 0.2,
                rootMargin: '0px'
            });

            animateElements.forEach(element => observer.observe(element));

            // Fallback to show elements if observer fails
            setTimeout(() => {
                animateElements.forEach(el => {
                    if (!el.classList.contains('visible')) {
                        el.classList.add('visible');
                        console.log('Fallback: Added visible class to', el.id || el.className);
                    }
                });
            }, 200);
        } catch (error) {
            console.error('Error in IntersectionObserver:', error.message);
            animateElements.forEach(el => el.classList.add('visible'));
        }

        // Load service data
        let serviceData = {};
        try {
            console.log('Fetching services.json...');
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
            if (!Object.keys(serviceData).length || !Object.keys(serviceData).every(key => validKeys.includes(key))) {
                throw new Error('Invalid or empty service data');
            }
            console.log('Services.json loaded successfully');
        } catch (error) {
            console.error('Error loading service data:', error.message);
            serviceData = {};
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
                navbar.classList.remove('hidden');
            }
            setTimeout(() => {
                overlay.style.visibility = 'hidden';
                overlayContent.innerHTML = '';
            }, 200);
        };

        // Service overlay functionality
        const openOverlay = (serviceId) => {
            if (navbar) {
                navbar.classList.add('hidden');
            }
            overlayContent.innerHTML = serviceData[serviceId] || '<p>Service information is currently unavailable.</p>';
            
            // Add close button
            const closeButton = document.createElement('button');
            closeButton.innerText = 'Close';
            closeButton.setAttribute('aria-label', 'Close service overlay');
            closeButton.classList.add('overlay-close');
            overlayContent.prepend(closeButton);
            closeButton.addEventListener('click', closeOverlay);

            overlay.style.visibility = 'visible';
            overlay.classList.add('active');

            // Focus trapping
            const focusableElements = overlay.querySelectorAll('button, [href], [tabindex="0"]');
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
            firstFocusable.focus();
        };

        document.querySelectorAll('.service, .service-cta').forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                openOverlay(element.closest('.service').getAttribute('data-service-id'));
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

        // Log stylesheet errors
        document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
            link.addEventListener('error', () => {
                console.error(`Stylesheet failed to load: ${link.href}`);
            });
        });
    } catch (error) {
        console.error('Error in window.onload:', error.message);
    }
};