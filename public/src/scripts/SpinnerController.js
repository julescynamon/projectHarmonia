import { gsap } from 'gsap';

export class SpinnerController {
    constructor() {
        this.overlay = document.getElementById('spinner-overlay');
        this.path = document.getElementById('tree-path');
        this.timeline = null;
        
        this.initAnimation();
    }

    initAnimation() {
        if (!this.path) return;

        const pathLength = this.path.getTotalLength();
        
        gsap.set(this.path, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength
        });

        this.timeline = gsap.timeline({ repeat: -1 })
            .to(this.path, {
                strokeDashoffset: 0,
                duration: 3,
                ease: "none"
            })
            .to(this.path, {
                strokeDashoffset: -pathLength,
                duration: 3,
                ease: "none"
            });
        
        this.timeline.pause();
    }

    show() {
        if (this.overlay) {
            this.overlay.classList.remove('hidden');
            this.timeline?.play();
        }
    }

    hide() {
        if (this.overlay) {
            this.overlay.classList.add('hidden');
            this.timeline?.pause();
        }
    }
}
