document.addEventListener('DOMContentLoaded', () => {
    // Hide preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 1000);
    }

    // Countdown timer
    function startCountdown(targetDate) {
        const countdown = setInterval(() => {
            const now = new Date().getTime();
            const distance = new Date(targetDate).getTime() - now;
            if (distance < 0) {
                clearInterval(countdown);
                document.querySelector('.hub_countdown').textContent = 'Launched!';
                return;
            }
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            document.getElementById('days').textContent = String(days).padStart(2, '0');
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        }, 1000);
    }
    startCountdown('2025-06-01T00:00:00'); // Set your launch date

    // Audio toggle
    const audio = document.getElementById('music');
    const toggle = document.getElementById('audio-toggle');
    if (audio && toggle) {
        audio.volume = 0.05;
        document.body.addEventListener('click', () => {
            audio.play().catch(err => console.log('Audio play failed:', err));
        }, { once: true });
        toggle.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                toggle.textContent = 'Pause Music';
                toggle.setAttribute('aria-label', 'Pause background music');
            } else {
                audio.pause();
                toggle.textContent = 'Play Music';
                toggle.setAttribute('aria-label', 'Play background music');
            }
        });
    }

    // Basic bot detection
    if (!('ontouchstart' in window) && navigator.userAgent.includes('bot')) {
        fetch('/log-bot.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isBot: true })
        }).catch(err => console.error('Bot logging failed:', err));
    } else {
        console.log('Human interaction detected');
    }
});