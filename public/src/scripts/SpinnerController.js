import { gsap } from 'gsap';

export class SpinnerController {
    constructor() {
        console.log('SpinnerController: Initializing');
        this.overlay = document.getElementById('spinner-overlay');
        this.path = document.getElementById('tree-path');
        this.timeline = null;
        
        if (!this.overlay) {
            console.error('SpinnerController: spinner-overlay element not found');
        }
        if (!this.path) {
            console.error('SpinnerController: tree-path element not found');
        }
        
        this.initAnimation();
    }

    initAnimation() {
        if (!this.path) return;
        console.log('SpinnerController: Initializing animation');

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
        console.log('SpinnerController: Showing spinner');
        if (this.overlay) {
            this.overlay.classList.remove('hidden');
            this.timeline?.play();
        }
    }

    hide() {
        console.log('SpinnerController: Hiding spinner');
        if (this.overlay) {
            this.overlay.classList.add('hidden');
            this.timeline?.pause();
        }
    }
}
