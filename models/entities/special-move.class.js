class SpecialMove extends MovableObject {
	width = 500;
	height = 250;
	speed = 15;
	damage = 2000;
    duration = 1000;
    startTime = Date.now();
	IMAGES = [
		"img/0_special_move/kamehameha_third_stage.png",
		"img/0_special_move/kamehameha_final_stage.png",
	];

	    constructor(x, y, direction = false) {
        super().loadImage('img/0_special_move/kamehameha_third_stage.png');
        this.loadImages(this.IMAGES);
        this.x = x;
        this.y = y;
        this.otherDirection = direction;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 50);
    }

    isExpired() {
        return Date.now() - this.startTime > this.duration;
    }

    getRange() {
        return {
            x: this.x - 50,
            y: this.y - 50,
            width: this.width + 100,
            height: this.height + 100
        };
    }
}
