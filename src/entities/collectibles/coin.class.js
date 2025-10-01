class Coin extends CollectibleObject {
    IMAGES = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    constructor(x) {
        super(x);
        this.loadImages(this.IMAGES);
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 500);
    }
}