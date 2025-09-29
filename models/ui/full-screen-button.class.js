class FullScreenButton extends DrawableObject {
    // canvas.requestFullscreen()
    width = 50;
    height = 50;
    x = 730;
    y = 420;

    constructor() {
        super();
        this.loadImage('img/icons/fullscreen.svg');
        this.loadImages([
            'img/icons/minimize.svg',
            'img/icons/fullscreen.svg'
        ]);
    }
    
    updateImage(isFullscreen) {
        const imagePath = isFullscreen ? 'img/icons/minimize.svg' : 'img/icons/fullscreen.svg';
        this.img = this.imageCache[imagePath];
    }
}