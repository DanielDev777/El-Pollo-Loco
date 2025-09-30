class FullScreenButton extends DrawableObject {
    width = 50;
    height = 50;
    x = 730;
    y = 420;
    isFullscreen = false;
    canvas;

    constructor(canvas) {
        super();
        this.canvas = canvas;
        this.loadImage('img/icons/fullscreen.svg');
        this.loadImages([
            'img/icons/minimize.svg',
            'img/icons/fullscreen.svg'
        ]);
        this.setupFullscreenListener();
    }
    
    updateImage(isFullscreen) {
        const imagePath = isFullscreen ? 'img/icons/minimize.svg' : 'img/icons/fullscreen.svg';
        this.img = this.imageCache[imagePath];
    }

    toggle() {
        if (!document.fullscreenElement) {
            this.enterFullscreen();
        } else {
            this.exitFullscreen();
        }
    }

    async enterFullscreen() {
        try {
            await this.canvas.requestFullscreen();
        } catch (err) {
            console.error('Error entering fullscreen:', err);
        }
    }

    async exitFullscreen() {
        try {
            await document.exitFullscreen();
        } catch (err) {
            console.error('Error exiting fullscreen:', err);
        }
    }

    setupFullscreenListener() {
        document.addEventListener('fullscreenchange', () => {
            this.isFullscreen = !!document.fullscreenElement;
            this.updateButtonPositions();
            this.updateImage(this.isFullscreen);
            if (this.muteButton) {
                this.muteButton.updateButtonPositions();
            }
        });
    }

    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               ('ontouchstart' in window) || 
               (navigator.maxTouchPoints > 0);
    }

    setMuteButtonReference(muteButton) {
        this.muteButton = muteButton;
    }

    updateButtonPositions() {
        this.x = 730;
        this.y = 420;
        this.width = 50;
        this.height = 50;
    }

    getFullscreenState() {
        return this.isFullscreen;
    }
}