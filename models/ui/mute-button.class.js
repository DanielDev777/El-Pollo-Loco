class MuteButton extends DrawableObject {
    width = 50;
    height = 50;
    x = 20;
    y = 420;
    
    constructor() {
        super();
        this.loadImage('img/icons/sound.svg');
        this.loadImages([
            'img/icons/mute.svg',
            'img/icons/sound.svg'
        ]);
    }

    updateImage(isMuted) {
        const imagePath = isMuted ? 'img/icons/mute.svg' : 'img/icons/sound.svg';
        this.img = this.imageCache[imagePath];
    }
}