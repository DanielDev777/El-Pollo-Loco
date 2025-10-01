class Cloud extends MovableObject {
    y = 50;
    height = 250;
    width = 500;
    IMAGES = [
        'img/5_background/layers/4_clouds/1.png',
        'img/5_background/layers/4_clouds/2.png'
    ]

    constructor(value) {
        super().loadImage(this.IMAGES[value]);
        this.x = Math.random() * 4000;

        this.animate();
    }

    animate() {
        setInterval(() => {
            if (this.world) {
                this.moveLeft();
            }
        }, 1000 / 60);
    }
}