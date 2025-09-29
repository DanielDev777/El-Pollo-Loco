class MuteButton extends DrawableObject {
    width = 50;
    height = 50;
    x = 20;
    y = 420;
    isMuted = false;
    
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

    toggle() {
        this.isMuted = !this.isMuted;
        this.updateImage(this.isMuted);
        return this.isMuted;
    }

    getMuteState() {
        return this.isMuted;
    }

    setMuteState(muteState) {
        this.isMuted = muteState;
        this.updateImage(this.isMuted);
    }

    updateButtonPositions() {
        this.x = 20;
        this.y = 420;
        this.width = 50;
        this.height = 50;
    }
}