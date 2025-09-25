class Bottle extends CollectibleObject {
    IMAGE_GROUND = 'img/6_salsa_bottle/1_salsa_bottle_on_ground.png';
    IMAGES_FLYING = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];
    IMAGES_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
    ]
    
    constructor(x) {
        super(x);
        this.loadImage(this.IMAGE_GROUND);
        this.loadImages(this.IMAGES_FLYING);
        this.loadImages(this.IMAGES_SPLASH);
    }

    throw(x, y, world, direction) {
        this.x = x;
        this.y = y;
        this.speedY = 20;
        if (direction == 'right') {
            this.speedX = 20;
        } else if (direction == 'left') {
            this.speedX = -20;
        }
        this.world = world;
        this.isSplashing = false;
        this.applyGravity();
        this.calcThrowInterval();
    }

    calcThrowInterval() {
        this.throwInterval = setInterval(() => {
            this.updatePosition();
            this.checkCollisions();
            this.animateFlying();
        }, 25);
    }

    updatePosition() {
        if (!this.isSplashing) {
            this.x += this.speedX;
        }
    }

    checkCollisions() {
        if (!this.world || this.isSplashing) return;
        
        this.world.level.enemies.forEach((enemy) => {
            if (this.isColliding(enemy) && enemy instanceof Endboss) {
                this.handleBossCollision(enemy);
            }
        });
    }

    handleBossCollision(enemy) {
        enemy.hit(25);
        this.splash(enemy);
        this.world.enemyHealthBar.setPercentage(enemy.health);
    }

    removeFromWorld() {
        clearInterval(this.throwInterval);
        const bottleIndex = this.world.thrownBottles.indexOf(this);
        if (bottleIndex > -1) {
            this.world.thrownBottles.splice(bottleIndex, 1);
        }
    }

    splash(enemy) {
        this.speedX = 0;
        this.speedY = 0;
        this.isSplashing = true;
        this.acceleration = 0;
        if (enemy) {
            this.x = enemy.x + (enemy.width / 2) - this.width;
            this.y = enemy.y + (enemy.height / 2) - this.height;
        }
        this.playAnimation(this.IMAGES_SPLASH);
        
        setTimeout(() => {
            this.removeFromWorld();
        }, 500);
    }

    animateFlying() {
        if (!this.isSplashing) {
            this.playAnimation(this.IMAGES_FLYING);
        }
    }
}