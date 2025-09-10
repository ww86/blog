const loadHeader = false;

document.addEventListener('DOMContentLoaded', () => {
    if (loadHeader) {
        fetch('header.html')
            .then(response => response.text())
            .then(data => {
                const headerPlaceholder = document.getElementById('header-placeholder');
                if (headerPlaceholder) {
                    headerPlaceholder.innerHTML = data;
                }
                initializePage();
            });
    } else {
        initializePage();
    }
});

function initializePage() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px"
    });

    document.querySelectorAll('.blog-item').forEach(item => {
        observer.observe(item);
    });
    
    // Split the main title into spans for the wave animation
    const mainTitle = document.getElementById('main-title');
    if (mainTitle) {
        const titleLink = mainTitle.querySelector('a'); // Get the <a> tag
        if (titleLink) {
            const titleText = titleLink.textContent;
            titleLink.textContent = ''; // Clears the original text inside <a>

            const words = titleText.split(' '); // Split by spaces to get words

            words.forEach((word, wordIndex) => {
                const chars = word.split(''); // Split each word into characters
                chars.forEach(char => {
                    const span = document.createElement('span');
                    span.textContent = char;
                    titleLink.appendChild(span);
                });

                // Add a non-breaking space between words, but not after the last word
                if (wordIndex < words.length - 1) {
                    const spaceSpan = document.createElement('span');
                    spaceSpan.innerHTML = '&nbsp;'; // Use non-breaking space
                    spaceSpan.classList.add('word-spacer'); // Add a class for potential styling
                    titleLink.appendChild(spaceSpan);
                }
            });
        }
    }

    // Optional: Parallax & Cursor Light
    if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
        const background = document.querySelector('.background-image');
        const lace = document.querySelector('.parallax-lace');
        const stars = document.querySelector('.parallax-stars');
        const fog = document.querySelector('.parallax-fog');
        
        // Simple parallax on scroll
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (background) {
                background.style.transform = `scale(1.0) translateY(${scrollY * 0.2}px)`;
            }
            if (lace) {
                lace.style.transform = `translateY(${scrollY * 0.2}px)`;
            }
            if (stars) {
                stars.style.transform = `translateY(${scrollY * 0.1}px)`;
            }
            if (fog) {
                fog.style.transform = `translateY(${scrollY * 0.3}px)`;
            }
        });

        // "Candlelight" cursor follower
        let mouseX = 0;
        let mouseY = 0;
        let targetMouseX = 0;
        let targetMouseY = 0;
        let animationFrameId;

        document.addEventListener('mousemove', (e) => {
            targetMouseX = e.clientX;
            targetMouseY = e.clientY;
        });
        document.addEventListener('touchstart', (e) => {
            const cursorLightOverlay = document.querySelector('.cursor-light-overlay');
            if (cursorLightOverlay) {
                cursorLightOverlay.style.display = 'none';
            }
        });

        function animateCursor() {
            mouseX += (targetMouseX - mouseX) * 0.1;
            mouseY += (targetMouseY - mouseY) * 0.1;

            document.documentElement.style.setProperty('--mouse-x', `${mouseX}px`);
            document.documentElement.style.setProperty('--mouse-y', `${mouseY}px`);

            animationFrameId = requestAnimationFrame(animateCursor);
        }

        animateCursor();
        
        // New: Soul-Drift Particle System
        const canvas = document.getElementById('particle-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            let particles = [];
            const particleCount = 50;
            let headerHeight = 0;

            function resizeCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            window.addEventListener('resize', resizeCanvas);
            
            class Particle {
                constructor() {
                    this.reset(true);
                    this.twinkleOffset = Math.random() * Math.PI * 2;
                    this.twinkleSpeed = Math.random() * 0.005 + 0.001;
                    this.fadeTimer = 0;
                }

                reset(isInitial = false) {
                    this.x = Math.random() * canvas.width;
                    if (isInitial) {
                         this.y = headerHeight + Math.random() * (canvas.height - headerHeight);
                    } else {
                         this.y = canvas.height + this.size;
                    }
                    this.size = Math.random() * 1.5 + 0.5;
                    this.speedY = Math.random() * 0.05 + 0.02;
                    this.opacity = 0;
                    this.state = 'shimmering';
                }

                update() {
                    this.y -= this.speedY;
                    this.x += Math.random() * 0.5 - 0.25;
                    
                    if (this.y < headerHeight) {
                        this.reset();
                    }

                    if (this.state === 'shimmering') {
                        this.twinkleOffset += this.twinkleSpeed;
                        let baseOpacity = (Math.sin(this.twinkleOffset) + 1) / 2;
                        this.opacity = baseOpacity * (Math.random() * 0.4 + 0.1);

                        if (Math.random() < 0.001) {
                            this.state = 'twinkling';
                            this.twinkleDuration = Math.random() * 60 + 30;
                            this.twinkleTimer = 0;
                        } else if (Math.random() < 0.0005) {
                            this.state = 'fading';
                            this.fadeDuration = Math.random() * 120 + 60;
                            this.fadeTimer = 0;
                        }

                    } else if (this.state === 'twinkling') {
                        this.twinkleTimer++;
                        const progress = this.twinkleTimer / this.twinkleDuration;
                        this.opacity = Math.sin(progress * Math.PI) * (Math.random() * 0.5 + 0.5);
                        
                        if (this.twinkleTimer >= this.twinkleDuration) {
                            this.state = 'shimmering';
                        }
                    
                    } else if (this.state === 'fading') {
                        this.fadeTimer++;
                        const progress = this.fadeTimer / this.fadeDuration;
                        this.opacity = 1 - Math.sin(progress * Math.PI);
                        
                        if (this.fadeTimer >= this.fadeDuration) {
                            this.state = 'shimmering';
                        }
                    }
                }

                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                    ctx.fill();
                }
            }

            function initParticles() {
                resizeCanvas();
                const header = document.querySelector('header');
                if(header) {
                    headerHeight = header.offsetHeight;
                }
                for (let i = 0; i < particleCount; i++) {
                    particles.push(new Particle());
                }
                animateParticles();
            }

            function animateParticles() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                for (let i = 0; i < particles.length; i++) {
                    particles[i].update();
                    particles[i].draw();
                }
                requestAnimationFrame(animateParticles);
            }
            
            initParticles();
        }
        
        // New: The complex, directional wave effect
        // Declare animationStartTime at a higher scope
        let animationStartTime = 0; 

        // Query titleSpans AFTER they have been created
        const titleSpans = document.querySelectorAll('.header-title span');

        if (titleSpans.length > 0) {
            const wavePropagationSpeed = 0.002; 
            const waveImpactDuration = 500;
            const dampingDuration = 3000;
            const initialWaveAmplitude = 0.15;
            const dampingFactor = 0.003; 

            function animateTitleWave(timestamp) {
                if (!animationStartTime) {
                    animationStartTime = timestamp;
                }
                const elapsed = timestamp - animationStartTime;

                const maxCharWaveStart = (titleSpans.length - 1) * 100;
                const totalDurationForLastChar = waveImpactDuration + dampingDuration;
                const totalAnimationDuration = maxCharWaveStart + totalDurationForLastChar;
                
                titleSpans.forEach((span, index) => {
                    const waveStart = index * 100;
                    const charTime = elapsed - waveStart;

                    if (charTime > 0) {
                        let progress = Math.min(charTime / waveImpactDuration, 1);
                        let waveValue;
                        let amplitude;

                        if (progress < 1) {
                            amplitude = initialWaveAmplitude * Math.sin(progress * Math.PI);
                            waveValue = Math.sin(progress * Math.PI * 2) * amplitude;
                        } 
                        else {
                            const dampingProgress = Math.min((charTime - waveImpactDuration) / dampingDuration, 1);
                            amplitude = initialWaveAmplitude * Math.exp(-dampingProgress * 2);
                            waveValue = Math.sin((dampingProgress + 1) * Math.PI * 4) * amplitude;
                        }
                        
                        const finalScale = 1 + waveValue;
                        const finalTranslateY = waveValue * -10;
                        span.style.transform = `scaleY(${finalScale}) translateY(${finalTranslateY}px)`;
                    } else {
                         span.style.transform = 'scaleY(1) translateY(0)';
                    }
                });
                
                if (elapsed < totalAnimationDuration) {
                    requestAnimationFrame(animateTitleWave);
                } else {
                    // Animation complete, reset transforms and schedule next wave
                    titleSpans.forEach(span => {
                        span.style.transform = 'scaleY(1) translateY(0)';
                    });
                    scheduleNextWave();
                }
            }

            function scheduleNextWave() {
                const minDelay = 5000; // 5 seconds
                const maxDelay = 20000; // 20 seconds
                const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay;

                setTimeout(() => {
                    animationStartTime = 0; // Reset for a fresh animation
                    animateTitleWave(performance.now());
                }, randomDelay);
            }

            // Initial call to start the random scheduling
            scheduleNextWave();
        }
    }
}