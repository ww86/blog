const NUM_STRIPS = 30;
        const ANIMATION_PROPERTIES = [
            { 
                deformAnim: 'deform-1', 
                swayAnim: 'sway-1', 
                duration: '26s', 
                swayDuration: '58s',
                bezierCurve: 'cubic-bezier(0.42, 0, 0.58, 1)'
            },
            { 
                deformAnim: 'deform-2', 
                swayAnim: 'sway-2', 
                duration: '34s', 
                swayDuration: '46s',
                bezierCurve: 'cubic-bezier(0.19, 1, 0.22, 1)'
            },
            { 
                deformAnim: 'deform-3', 
                swayAnim: 'sway-3', 
                duration: '38s', 
                swayDuration: '62s',
                bezierCurve: 'cubic-bezier(0.85, 0, 0.15, 1)'
            },
            { 
                deformAnim: 'deform-4', 
                swayAnim: 'sway-4', 
                duration: '46s', 
                swayDuration: '74s',
                bezierCurve: 'cubic-bezier(0.5, 0.5, 0.5, 0.5)'
            },
            { 
                deformAnim: 'deform-5', 
                swayAnim: 'sway-5', 
                duration: '58s', 
                swayDuration: '82s',
                bezierCurve: 'cubic-bezier(0.7, 0, 0.3, 1)'
            }
        ];

        function generateStrips() {
            const stripsContainer = document.querySelector('.strips-container');
            const fragment = document.createDocumentFragment();

            for (let i = 0; i < NUM_STRIPS; i++) {
                const strip = document.createElement('div');
                strip.classList.add('strip');

                const initialLeft = (Math.random() * 100) + 'vw';
                const initialWidth = (Math.random() * 200 + 200) + 'px';
                
                // Randomly select one of the animation sets
                const animSet = ANIMATION_PROPERTIES[Math.floor(Math.random() * ANIMATION_PROPERTIES.length)];
                
                strip.style.setProperty('--initial-left', initialLeft);
                strip.style.setProperty('--initial-width', initialWidth);

                strip.style.animation = 
                    `${animSet.deformAnim} ${animSet.duration} ${animSet.bezierCurve} infinite, ` +
                    `${animSet.swayAnim} ${animSet.swayDuration} ${animSet.bezierCurve} infinite`;
                
                fragment.appendChild(strip);
            }
            stripsContainer.appendChild(fragment);
        }
        
        document.addEventListener('DOMContentLoaded', generateStrips);