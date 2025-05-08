document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.querySelector('.preloader');
    const hero = document.querySelector('#hero');
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    // Hide preloader
    const hidePreloader = () => {
        try {
            if (hero) {
                hero.style.visibility = 'visible';
                hero.style.opacity = '1';
                hero.classList.add('visible');
            }
            animateElements.forEach(element => {
                element.style.visibility = 'visible';
                element.style.opacity = '1';
                element.classList.add('visible');
                void element.offsetWidth; // Force repaint
            });
            requestAnimationFrame(() => {
                preloader.classList.add('hidden');
                preloader.style.display = 'none';
                animateElements.forEach(element => {
                    element.style.willChange = 'transform, opacity';
                    setTimeout(() => element.style.willChange = 'auto', 100);
                });
            });
        } catch (error) {
            console.error('Error hiding preloader:', error.message);
            preloader.classList.add('hidden');
            preloader.style.display = 'none';
        }
    };

    if (preloader) hidePreloader();
});

window.onload = async () => {
    try {
        const canvas = document.querySelector('#particle-canvas');
        const ctx = canvas?.getContext('2d');
        const audio = document.getElementById('music');
        const toggle = document.getElementById('audio-toggle');
        const animateElements = document.querySelectorAll('.animate-on-scroll');

        // Particle effects with optimizations
        if (canvas && ctx) {
            let particles = [];
            const particleCount = 75; // Reduced from 100 to 50 for better performance
            let isAnimating = false;

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
            }

            function animateParticles() {
                if (document.hidden || !isAnimating) return; // Skip animation if hidden or not intersecting
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

            canvas.classList.remove('visible');
            initParticles();
            canvas.classList.add('visible');
            isAnimating = true;
            animateParticles();
            window.addEventListener('resize', () => {
                initParticles();
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            });

            // Pause/resume animation when canvas is out of view
            const observer = new IntersectionObserver((entries) => {
                isAnimating = entries[0].isIntersecting;
                if (isAnimating) animateParticles();
            }, { threshold: 0 });
            observer.observe(canvas);
        } else {
            console.warn('Canvas or context not found, skipping particle effects');
        }

        // Scroll animations with IntersectionObserver
        try {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
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
                    }
                });
            }, 500);
        } catch (error) {
            console.error('Error in IntersectionObserver:', error.message);
            animateElements.forEach(el => el.classList.add('visible'));
        }

        // Countdown Timer
        function startCountdown(targetDate) {
            const target = new Date(targetDate).getTime();
            if (isNaN(target)) {
                console.error('Invalid countdown date');
                const countdownContainer = document.querySelector('.hub-countdown');
                if (countdownContainer) {
                    countdownContainer.innerHTML = '<span>Invalid Date</span>';
                }
                return;
            }
            const countdown = setInterval(() => {
                const now = new Date().getTime();
                const distance = target - now;
                if (distance < 0) {
                    clearInterval(countdown);
                    const countdownContainer = document.querySelector('.hub-countdown');
                    if (countdownContainer) {
                        countdownContainer.innerHTML = '<span>Launched!</span>';
                    }
                    return;
                }
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                const daysElement = document.getElementById('days');
                const hoursElement = document.getElementById('hours');
                const minutesElement = document.getElementById('minutes');
                const secondsElement = document.getElementById('seconds');
                if (daysElement && hoursElement && minutesElement && secondsElement) {
                    daysElement.textContent = days.toString().padStart(2, '0');
                    hoursElement.textContent = hours.toString().padStart(2, '0');
                    minutesElement.textContent = minutes.toString().padStart(2, '0');
                    secondsElement.textContent = seconds.toString().padStart(2, '0');
                } else {
                    console.error('Countdown elements not found');
                    clearInterval(countdown);
                }
            }, 1000);
        }

        startCountdown('2025-06-01T00:00:00');

        // Audio Controls
        if (audio && toggle) {
            audio.volume = 0.01;
            document.body.addEventListener('click', () => {
                audio.play().catch(err => console.error('Audio play failed:', err));
            }, { once: true });
            toggle.addEventListener('click', () => {
                if (audio.paused) {
                    audio.play().catch(err => console.error('Audio play failed:', err));
                    toggle.textContent = 'Pause Music';
                    toggle.setAttribute('aria-label', 'Pause background music');
                } else {
                    audio.pause();
                    toggle.textContent = 'Play Music';
                    toggle.setAttribute('aria-label', 'Play background music');
                }
            });
        } else {
            console.error('Audio or toggle element not found');
        }

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