window.addEventListener('load', () => {
    const startTime = performance.now();
    const preloader = document.querySelector('.preloader');
    const hubCenter = document.querySelector('#hub_center');
    const canvas = document.querySelector('#particle-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;

    if (!preloader || !hubCenter) {
        console.error('Preloader or hub_center element not found');
        return;
    }

    // Particle effects
    if (canvas && ctx) {
        let particles = [];
        const particleCount = 100; // Increased from 50 to 100 for more particles

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

    // Hide preloader and trigger fade-in animation
    requestAnimationFrame(() => {
        preloader.classList.add('hidden');
        const loadTime = performance.now() - startTime;
        console.log(`Preloader hidden after ${loadTime.toFixed(2)}ms`);
        setTimeout(() => {
            hubCenter.classList.add('loaded');
        }, 500);
    });
});

// Countdown Timer
function startCountdown(targetDate) {
    const target = new Date(targetDate).getTime();
    if (isNaN(target)) {
        console.error('Invalid countdown date');
        const countdownContainer = document.querySelector('.hub_countdown');
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
            const countdownContainer = document.querySelector('.hub_countdown');
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
const audio = document.getElementById('music');
const toggle = document.getElementById('audio-toggle');
if (audio && toggle) {
    audio.volume = 0.01;
    document.body.addEventListener('click', () => {
        audio.play().catch(err => console.log('Audio play failed:', err));
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

// Stylesheet Error Logging
document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
    link.addEventListener('error', () => {
        console.error(`SRI or resource failure for ${link.href}`);
    });
});