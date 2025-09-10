// Audio Player Controls
document.addEventListener('DOMContentLoaded', () => {
    const myAudio = document.getElementById('myAudio');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playIcon = playPauseBtn.querySelector('.play-icon');
    const pauseIcon = playPauseBtn.querySelector('.pause-icon');
    const progressBar = document.getElementById('progressBar');
    const volumeSlider = document.getElementById('volume-slider');
    const timeDisplay = document.getElementById('time-display');

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    }

    if (myAudio && playPauseBtn && playIcon && pauseIcon && progressBar && volumeSlider && timeDisplay) {
        playPauseBtn.addEventListener('click', () => {
            if (myAudio.paused) {
                myAudio.play();
                playIcon.classList.add('hidden');
                pauseIcon.classList.remove('hidden');
            } else {
                myAudio.pause();
                playIcon.classList.remove('hidden');
                pauseIcon.classList.add('hidden');
            }
        });

        myAudio.addEventListener('timeupdate', () => {
            const progress = (myAudio.currentTime / myAudio.duration) * 100;
            progressBar.value = progress;
            progressBar.style.setProperty('--progress', progress);
            timeDisplay.textContent = `${formatTime(myAudio.currentTime)} / ${formatTime(myAudio.duration)}`;
        });

        myAudio.addEventListener('loadedmetadata', () => {
            timeDisplay.textContent = `0:00 / ${formatTime(myAudio.duration)}`;
        });

        progressBar.addEventListener('input', () => {
            myAudio.currentTime = (progressBar.value / 100) * myAudio.duration;
        });

        volumeSlider.addEventListener('input', () => {
            myAudio.volume = volumeSlider.value;
            volumeSlider.style.setProperty('--volume-progress', `${volumeSlider.value * 100}`);
        });

        // Set initial volume
        myAudio.volume = volumeSlider.value;
        volumeSlider.style.setProperty('--volume-progress', `${volumeSlider.value * 100}`);

        // Keyboard control for play/pause (d key)
        document.addEventListener('keydown', (event) => {
            if (event.key === 'd' || event.key === 'D') {
                if (myAudio.paused) {
                    myAudio.play();
                    playIcon.classList.add('hidden');
                    pauseIcon.classList.remove('hidden');
                } else {
                    myAudio.pause();
                    playIcon.classList.remove('hidden');
                    pauseIcon.classList.add('hidden');
                }
            }
        });
    }
});
