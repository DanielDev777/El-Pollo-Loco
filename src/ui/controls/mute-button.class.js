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
        this.getLocalMuteState();
    }

    getLocalMuteState() {
        const savedMuteState = localStorage.getItem("muted");
        if (savedMuteState !== null) {
            this.isMuted = savedMuteState === 'true';
            this.updateImage(this.isMuted);
        }
    }

    updateImage(isMuted) {
        const imagePath = (isMuted === 'true' || isMuted === true)  ? 'img/icons/mute.svg' : 'img/icons/sound.svg';
        this.img = this.imageCache[imagePath];
    }

    toggle() {
        this.isMuted = !this.isMuted;
        localStorage.setItem("muted", this.isMuted.toString());
        this.updateImage(this.isMuted);
        return this.isMuted;
    }

    getMuteState() {
        return this.isMuted;
    }

    setMuteState(muteState) {
        this.isMuted = Boolean(muteState);
        localStorage.setItem("muted", this.isMuted.toString());
        this.updateImage(this.isMuted);
    }

    updateButtonPositions() {
        this.x = 20;
        this.y = 420;
        this.width = 50;
        this.height = 50;
    }
}