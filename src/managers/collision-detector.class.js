class CollisionDetector {
    constructor(world) {
        this.world = world;
    }

    checkAllCollisions() {
        this.playerJumpsOnChicken();
        this.chickenHitsPlayerDetection();
        this.characterCollectsBottle();
        this.characterCollectsCoin();
        this.checkSpecialMoveCollisions();
    }

    playerJumpsOnChicken() {
        this.world.level.enemies.forEach((enemy) => {
            if (this.checkPlayerJumpOnChicken(enemy)) {
                if (!this.world.muteButton.getMuteState() && !enemy.isDead()) {
                    this.world.squash_sound.play();
                }
                enemy.health = 0;
            }
        });
    }

    checkPlayerJumpOnChicken(enemy) {
        return (
            this.world.character.isColliding(enemy) &&
            enemy instanceof Chicken &&
            this.world.character.isAboveGround() &&
            this.world.character.speedY < 0
        );
    }

    chickenHitsPlayerDetection() {
        this.world.level.enemies.forEach((enemy) => {
            if (this.world.character.isColliding(enemy) && !enemy.isDead()) {
                if (
                    !(enemy instanceof Chicken && this.world.character.speedY > 0) &&
                    !this.world.character.isDead()
                ) {
                    this.characterGetsHit(enemy);
                }
            }
        });
    }

    characterGetsHit(enemy) {
        if (enemy instanceof Chicken && !this.world.gameDone) {
            this.characterGetsHitByChicken();
        } else if (enemy instanceof Endboss) {
            this.characterGetsHitByBoss();
        }
        this.world.healthBar.setPercentage(this.world.character.health);
    }

    characterGetsHitByChicken() {
        if (!this.world.muteButton.getMuteState()) {
            this.world.character.normal_ouch.play();
        }
        this.world.character.hit(5);
    }

    characterGetsHitByBoss() {
        const currentTime = Date.now();
        const bossCooldown = 2000;
        if (currentTime - this.world.lastBossHitTime >= bossCooldown) {
            if (!this.world.muteButton.getMuteState()) {
                this.world.character.big_ouch.play();
            }
            this.world.character.hit(30);
            this.world.lastBossHitTime = currentTime;
        }
    }

    characterCollectsBottle() {
        this.world.level.bottles.forEach((bottle) => {
            if (this.world.character.isColliding(bottle)) {
                this.world.level.bottles.splice(this.world.level.bottles.indexOf(bottle), 1);
                this.world.hotSauceBar.setPercentage(this.world.hotSauceBar.percentage + 25);
            }
        });
    }

    characterCollectsCoin() {
        this.world.level.coins.forEach((coin) => {
            if (this.world.character.isColliding(coin)) {
                this.world.level.coins.splice(this.world.level.coins.indexOf(coin), 1);
                this.world.coinBar.setPercentage(this.world.coinBar.percentage + 25);
            }
        });
    }

    checkSpecialMoveCollisions() {
        this.world.specialMoves.forEach((specialMove) => {
            this.world.level.enemies.forEach((enemy) => {
                if (enemy.isColliding(specialMove) && enemy instanceof Endboss) {
                    enemy.health = 0;
                    if (!this.world.muteButton.getMuteState()) {
                        enemy.big_hit_sound.play();
                    }
                }
            });
        });
    }
}