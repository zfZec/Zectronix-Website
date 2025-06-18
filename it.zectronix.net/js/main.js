document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.querySelector('.preloader');
    const hero = document.querySelector('#hero');
    const services = document.querySelectorAll('.service');
    const contactInfo = document.querySelector('.contact-info');

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
                service.classList.add('visible');
                void service.offsetWidth;
            });
            if (contactInfo) {
                contactInfo.style.visibility = 'visible';
                contactInfo.style.opacity = '1';
                contactInfo.classList.add('visible');
            }
            requestAnimationFrame(() => {
                preloader.classList.add('hidden');
                preloader.style.display = 'none';
                console.log('Preloader hidden');
                services.forEach(service => {
                    service.style.willChange = 'transform, opacity';
                    setTimeout(() => service.style.willChange = 'auto', 100);
                });
                if (contactInfo) {
                    contactInfo.style.willChange = 'transform, opacity';
                    setTimeout(() => contactInfo.style.willChange = 'auto', 100);
                }
            });
        } catch (error) {
            console.error('Error hiding preloader:', error.message);
            preloader.classList.add('hidden');
            preloader.style.display = 'none';
        }
    };

    if (preloader) hidePreloader();

    // Force repaint for service and contact boxes to enable hover
    const forceRepaint = () => {
        services.forEach(service => {
            void service.offsetWidth;
            service.style.pointerEvents = 'auto';
        });
        if (contactInfo) {
            void contactInfo.offsetWidth;
            contactInfo.style.pointerEvents = 'auto';
        }
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

    if (contactInfo) {
        contactInfo.addEventListener('mouseenter', () => {
            console.log(`Hover detected on contact-info`);
        });
        contactInfo.addEventListener('mouseleave', () => {
            contactInfo.style.transform = 'translateY(0)';
            contactInfo.style.animation = 'none';
        });
        contactInfo.addEventListener('touchstart', () => {
            contactInfo.classList.add('hovered');
            setTimeout(() => contactInfo.classList.remove('hovered'), 400);
        });
    }
});

window.onload = async () => {
    try {
        const canvas = document.querySelector('#particle-canvas');
        const ctx = canvas?.getContext('2d');
        const navbar = document.querySelector('.navbar');
        const serviceOverlay = document.querySelector('#service-overlay');
        const contactOverlay = document.querySelector('#contact-overlay');
        const serviceOverlayContent = serviceOverlay?.querySelector('#overlay-content-inner');
        const contactOverlayContent = contactOverlay?.querySelector('#overlay-content-inner');

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
        const closeOverlay = (overlay) => {
            overlay.classList.remove('active');
            if (navbar) {
                navbar.classList.remove('hidden');
            }
            document.body.style.overflow = ''; // Restore main page scrolling
            setTimeout(() => {
                overlay.style.visibility = 'hidden';
                const contentInner = overlay.querySelector('#overlay-content-inner');
                if (contentInner) contentInner.innerHTML = '';
            }, 200);
        };

        // Service overlay functionality
        const openServiceOverlay = (serviceId) => {
            if (navbar) {
                navbar.classList.add('hidden');
            }
            document.body.style.overflow = 'hidden'; // Prevent main page scrolling
            if (serviceOverlayContent) {
                serviceOverlayContent.innerHTML = serviceData[serviceId] || '<p>Service information is currently unavailable.</p>';
                
                // Add close button
                const closeButton = document.createElement('button');
                closeButton.innerText = 'Close';
                closeButton.setAttribute('aria-label', 'Close service overlay');
                closeButton.classList.add('overlay-close');
                serviceOverlayContent.prepend(closeButton);
                closeButton.addEventListener('click', () => closeOverlay(serviceOverlay));

                serviceOverlay.style.visibility = 'visible';
                serviceOverlay.classList.add('active');

                // Focus trapping
                const focusableElements = serviceOverlay.querySelectorAll('button, [href], [tabindex="0"]');
                const firstFocusable = focusableElements[0];
                const lastFocusable = focusableElements[focusableElements.length - 1];
                serviceOverlay.addEventListener('keydown', (e) => {
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
            }
        };

        // Contact overlay functionality
        const openContactOverlay = () => {
            if (navbar) {
                navbar.classList.add('hidden');
            }
            document.body.style.overflow = 'hidden'; // Prevent main page scrolling
            if (contactOverlayContent) {
                const formWrapper = document.createElement('div');
                formWrapper.className = 'contact-form-container';
                formWrapper.innerHTML = `
                    <h2 class="contact-form-title">Send Us a Message</h2>
                    <p class="contact-form-summary">Fill out the form below, and our team will get back to you promptly.</p>
                    <form id="contactForm" action="mailto:contact@zectronix.net" method="post" enctype="text/plain">
                        <div class="form-group">
                            <label for="name">Your Name</label>
                            <input type="text" id="name" name="name" class="contact-input" autocomplete="name" required aria-required="true">
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" class="contact-input" autocomplete="email" required aria-required="true">
                        </div>
                        <div class="form-group">
                            <label for="urgency">Urgency</label>
                            <select id="urgency" name="urgency" class="contact-input contact-input-select" required aria-required="true">
                                <option value="" disabled selected>Select urgency level</option>
                                <option value="Low">Low: General inquiry</option>
                                <option value="Medium">Medium: Standard request</option>
                                <option value="High">High: Time-sensitive issue</option>
                                <option value="Emergency">Emergency: Immediate cybersecurity threat</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="subject">Subject</label>
                            <input type="text" id="subject" name="subject" class="contact-input" autocomplete="off" required aria-required="true">
                        </div>
                        <div class="form-group">
                            <label for="message">Your Message</label>
                            <textarea id="message" name="message" class="contact-input" rows="5" required aria-required="true"></textarea>
                        </div>
                        <div class="form-group">
                            <button type="submit" class="contact-button">Send Message</button>
                        </div>
                    </form>
                `;
                contactOverlayContent.innerHTML = '';
                contactOverlayContent.appendChild(formWrapper);

                // Add close button
                const closeButton = document.createElement('button');
                closeButton.innerText = 'Close';
                closeButton.setAttribute('aria-label', 'Close contact form overlay');
                closeButton.classList.add('overlay-close');
                contactOverlayContent.prepend(closeButton);
                closeButton.addEventListener('click', () => closeOverlay(contactOverlay));

                contactOverlay.style.visibility = 'visible';
                contactOverlay.classList.add('active');

                // Focus trapping
                const focusableElements = contactOverlay.querySelectorAll('button, input, textarea, select, [href], [tabindex="0"]');
                const firstFocusable = focusableElements[0];
                const lastFocusable = focusableElements[focusableElements.length - 1];
                contactOverlay.addEventListener('keydown', (e) => {
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
            } else {
                contactOverlayContent.innerHTML = '<p>Contact form is currently unavailable.</p>';
            }
        };

        // Attach event listeners for services
        document.querySelectorAll('.service, .service-cta').forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                openServiceOverlay(element.closest('.service').getAttribute('data-service-id'));
            });
        });

        // Attach event listener for contact info
        const contactInfo = document.querySelector('.contact-info');
        if (contactInfo) {
            contactInfo.addEventListener('click', (e) => {
                // Prevent opening overlay if clicking email link
                if (e.target.closest('.contact-info-item a')) {
                    return;
                }
                e.preventDefault();
                openContactOverlay();
            });
            contactInfo.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openContactOverlay();
                }
            });
        }

        // Close overlays on click outside
        [serviceOverlay, contactOverlay].forEach(overlay => {
            if (overlay) {
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) {
                        closeOverlay(overlay);
                    }
                });
            }
        });

        // Close overlays on Esc key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (serviceOverlay?.classList.contains('active')) {
                    closeOverlay(serviceOverlay);
                }
                if (contactOverlay?.classList.contains('active')) {
                    closeOverlay(contactOverlay);
                }
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