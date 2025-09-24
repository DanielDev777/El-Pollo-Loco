class CollisionManager {
    constructor(world) {
        this.world = world;
    }

    checkAllCollisions() {
        this.checkPlayerJumpsOnEnemies();
        this.checkEnemyHitsPlayer();
        this.checkPlayerCollectsItems();
    }

    checkPlayerJumpsOnEnemies() {
        this.world.level.enemies.forEach((enemy) => {
            if (this.world.character.isColliding(enemy) && 
                enemy instanceof Chicken && 
                this.world.character.isAboveGround() &&
                this.world.character.speedY <= 0) {
                enemy.health = 0;
            }
        });
    }

    checkEnemyHitsPlayer() {
        this.world.level.enemies.forEach((enemy) => {
            if (this.world.character.isColliding(enemy) && !enemy.isDead()) {
                const isJumpAttack = enemy instanceof Chicken && 
                                   this.world.character.isAboveGround() &&
                                   this.world.character.speedY <= 0;
                if (!isJumpAttack) {
                    this.world.character.hit(5);
                    this.world.healthBar.setPercentage(this.world.character.health);
                }
            }
        });
    }

    checkPlayerCollectsItems() {
        this.world.level.bottles.forEach(bottle => {
            if (this.isPlayerTouchingBottle(bottle)) {
                this.collectBottle(bottle);
            }
        });
    }

    isPlayerTouchingBottle(bottle) {
        const character = this.world.character;
        return (
            character.x + character.width > bottle.x &&
            character.y + character.height > bottle.y &&
            character.x < bottle.x + bottle.width &&
            character.y < bottle.y + bottle.height
        );
    }

    collectBottle(bottle) {
        const bottleIndex = this.world.level.bottles.indexOf(bottle);
        this.world.level.bottles.splice(bottleIndex, 1);
        this.world.hotSauceBar.setPercentage(this.world.hotSauceBar.percentage + 25);
    }
}