/**
 * Manages all collision detection logic in the game world.
 * Handles interactions between character, enemies, collectibles, and special moves.
 * Processes collision consequences including damage, collection, and sound effects.
 * 
 * @class CollisionDetector
 * @example
 * const collisionDetector = new CollisionDetector(world);
 * // In game loop:
 * collisionDetector.checkAllCollisions();
 */
class CollisionDetector {
    /**
     * Creates a new collision detector instance.
     * 
     * @param {World} world - Reference to the main game world
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Main collision detection method that checks all collision types.
     * Executes all collision detection routines in proper order.
     * Called once per game loop iteration.
     */
    checkAllCollisions() {
        this.playerJumpsOnChicken();
        this.chickenHitsPlayerDetection();
        this.characterCollectsBottle();
        this.characterCollectsCoin();
        this.checkSpecialMoveCollisions();
    }

    /**
     * Detects and handles player jumping on chickens to defeat them.
     * Plays squash sound effect and eliminates the enemy instantly.
     */
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

    /**
     * Checks if player is performing a valid jump attack on a chicken.
     * 
     * @param {MovableObject} enemy - The enemy to check collision with
     * @returns {boolean} True if player is jumping on chicken
     */
    checkPlayerJumpOnChicken(enemy) {
        return (
            this.world.character.isColliding(enemy) &&
            enemy instanceof Chicken &&
            this.world.character.isAboveGround() &&
            this.world.character.speedY < 0
        );
    }

    /**
     * Detects when enemies hit the player and handles damage.
     * Excludes cases where player is jumping on chickens.
     */
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

    /**
     * Handles character taking damage from different enemy types.
     * Routes to appropriate damage handler based on enemy type.
     * Updates health bar display after processing damage.
     * 
     * @param {MovableObject} enemy - The enemy that hit the character
     * @private
     */
    characterGetsHit(enemy) {
        if (enemy instanceof Chicken && !this.world.gameDone) {
            this.characterGetsHitByChicken();
        } else if (enemy instanceof Endboss) {
            this.characterGetsHitByBoss();
        }
        this.world.healthBar.setPercentage(this.world.character.health);
    }

    /**
     * Processes character taking light damage from chicken enemies.
     * Plays normal hurt sound effect if audio is enabled.
     * Inflicts 5 points of damage to the character.
     * 
     * @private
     */
    characterGetsHitByChicken() {
        if (!this.world.muteButton.getMuteState()) {
            this.world.character.normal_ouch.play();
        }
        this.world.character.hit(5);
    }

    /**
     * Processes character taking heavy damage from boss enemy with cooldown.
     * Implements 2-second damage immunity period to prevent rapid damage.
     * Plays big hurt sound and inflicts 30 points of damage.
     * Updates boss hit timestamp for cooldown tracking.
     * 
     * @private
     */
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

    /**
     * Handles character collecting bottle items for ammunition.
     * Removes collected bottle from level and increases hot sauce ammo by 25%.
     * Provides throwable ammunition for combat mechanics.
     * 
     * @private
     */
    characterCollectsBottle() {
        this.world.level.bottles.forEach((bottle) => {
            if (this.world.character.isColliding(bottle)) {
                this.world.level.bottles.splice(this.world.level.bottles.indexOf(bottle), 1);
                this.world.hotSauceBar.setPercentage(this.world.hotSauceBar.percentage + 25);
            }
        });
    }

    /**
     * Handles character collecting coin items for special move currency.
     * Removes collected coin from level and increases special move progress by 25%.
     * Special move becomes available when coin bar reaches 100%.
     * 
     * @private
     */
    characterCollectsCoin() {
        this.world.level.coins.forEach((coin) => {
            if (this.world.character.isColliding(coin)) {
                this.world.level.coins.splice(this.world.level.coins.indexOf(coin), 1);
                this.world.coinBar.setPercentage(this.world.coinBar.percentage + 25);
            }
        });
    }

    /**
     * Detects collisions between special move attacks and boss enemies.
     * Instantly defeats boss enemy when hit by ultimate special attack.
     * Plays dramatic impact sound effect for powerful attack feedback.
     * Currently only affects Endboss enemies for ultimate battle resolution.
     * 
     * @private
     */
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