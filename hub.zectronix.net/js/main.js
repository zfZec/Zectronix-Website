window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    const hubCenter = document.querySelector('#hub_center');
    if (!preloader || !hubCenter) {
        console.error('Preloader or hub_center element not found');
        return;
    }

    // Hide preloader and trigger fade-in animation
    requestAnimationFrame(() => {
        preloader.classList.add('hidden');
        // Wait for preloader fade-out transition (0.5s) before adding .loaded
        setTimeout(() => {
            hubCenter.classList.add('loaded');
        }, 500);
    });
});

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

document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
    link.addEventListener('error', () => {
        console.error(`SRI or resource failure for ${link.href}`);
    });
});