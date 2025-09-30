class Endboss extends MovableObject {
    height = 400;
    width = 250;
    x = 2500;
    y = 50;
    readyToFight = false;
    speed = 10;
    movementIntervalStarted = false;
    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png',
    ];
    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png',
    ]
    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png',
    ];
    IMAGES_HURTING = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png',
    ]
    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png',
    ]
    bottle_hit = new Audio('audio/bottle_hit.mp3')
    big_hit_sound = new Audio('audio/big_hit.mp3');

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURTING);
        this.loadImages(this.IMAGES_DEAD);
        this.bottle_hit.volume = 0.5;
        this.big_hit_sound.volume = 1;
        this.animate();
    }

    animate() {
        let i = 0;
        setInterval(() => {
            if (this.isDead()) {
                this.playDeathAnimation();
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURTING);
            } else if (this.readyToFight) {
                this.prepareForAttack(i);
                i++;
            }
        }, 200);
    }
    
    prepareForAttack(i) {
        if (i < 10) {
            this.playAnimation(this.IMAGES_ALERT);
        } else {
            this.playAnimation(this.IMAGES_WALKING);
            this.attack();
        }
    }

    playDeathAnimation() {
        if (!this.deathAnimationComplete) {
            this.playSlowDeathAnimation();
        }
    }

    playSlowDeathAnimation() {
        if (!this.deathAnimationStarted) {
            this.deathAnimationStarted = true;
            this.deathFrameCounter = 0;
        }
        if (this.deathFrameCounter % 1 === 0) {
            const frameIndex = Math.floor(this.deathFrameCounter / 1);
            if (frameIndex < this.IMAGES_DEAD.length) {
                this.img = this.imageCache[this.IMAGES_DEAD[frameIndex]];
            } else {
                this.completeDeathAnimation();
            }
        }
        this.deathFrameCounter++;
    }

    completeDeathAnimation() {
        if (!this.deathEventTriggered) {
            this.deathAnimationComplete = true;
            this.deathEventTriggered = true;
            this.img = this.imageCache[this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]];
        }
    }

    attack() {
        if (!this.movementIntervalStarted) {
            this.movementIntervalStarted = true;
            setInterval(() => {
                if (this.world) {
                    this.checkPosition();
                    if (this.readyToFight && this.x > 0 && !this.isDead() && this.otherDirection === false) {
                        this.moveLeft();
                    } else if (this.readyToFight && !this.isDead() && this.otherDirection === true) {
                        this.moveRight(true);
                    }
                }
            }, 1000 / 60);
        }
    }

    checkPosition() {
        if (this.x <= 0) {
            this.otherDirection = true;
        } else if (this.x >= this.world.level.level_end_x) {
            this.otherDirection = false;
        }
    }
}