/**
 * Hot sauce bottle collectible that can also be thrown as projectile.
 * Supports both ground collection and projectile mechanics with physics.
 * Features multiple states: ground, flying, and splash animations.
 * 
 * @class Bottle
 * @extends CollectibleObject
 * @example
 * // As collectible:
 * const groundBottle = new Bottle(500);
 * 
 * // As projectile:
 * const thrownBottle = new Bottle(character.x);
 * thrownBottle.throw(x, y, world, "right");
 */
class Bottle extends CollectibleObject {
    /** @type {string} Static bottle image when on ground */
    IMAGE_GROUND = 'img/6_salsa_bottle/1_salsa_bottle_on_ground.png';
    
    /** @type {string[]} Animation frames for rotating bottle in flight */
    IMAGES_FLYING = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];
    
    /** @type {string[]} Animation frames for bottle breaking on impact */
    IMAGES_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
    ]
    
    /**
     * Creates a new bottle instance at the specified x position.
     * Initializes with ground image and preloads all animation sequences.
     * Can serve as either a collectible on the ground or a throwable projectile.
     * 
     * @param {number} x - Horizontal position where the bottle should be placed
     */
    constructor(x) {
        super(x);
        this.loadImage(this.IMAGE_GROUND);
        this.loadImages(this.IMAGES_FLYING);
        this.loadImages(this.IMAGES_SPLASH);
    }

    /**
     * Launches the bottle as a projectile with physics and collision detection.
     * Sets initial position, velocity based on direction, and starts gravity simulation.
     * Creates movement and animation intervals for realistic projectile motion.
     * 
     * @param {number} x - Starting x position for the throw
     * @param {number} y - Starting y position for the throw
     * @param {World} world - Game world instance for collision detection
     * @param {string} direction - Throw direction: 'right' or 'left'
     */
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

    /**
     * Establishes the main animation and physics loop for the thrown bottle.
     * Updates position, checks for collisions, and animates rotation every 25ms.
     * Runs until the bottle splashes or is removed from the world.
     * 
     * @private
     */
    calcThrowInterval() {
        this.throwInterval = setInterval(() => {
            this.updatePosition();
            this.checkCollisions();
            this.animateFlying();
        }, 25);
    }

    /**
     * Updates the horizontal position of the bottle during flight.
     * Only moves horizontally when not in splashing state to maintain impact position.
     * Vertical movement is handled automatically by the gravity system.
     * 
     * @private
     */
    updatePosition() {
        if (!this.isSplashing) {
            this.x += this.speedX;
        }
    }

    /**
     * Detects collisions between the flying bottle and enemies in the world.
     * Currently focuses on Endboss collisions for boss battle mechanics.
     * Skips collision detection if bottle is already splashing or world is unavailable.
     * 
     * @private
     */
    checkCollisions() {
        if (!this.world || this.isSplashing) return;
        
        this.world.level.enemies.forEach((enemy) => {
            if (this.isColliding(enemy) && enemy instanceof Endboss) {
                this.handleBossCollision(enemy);
            }
        });
    }

    /**
     * Processes collision with the boss enemy, dealing damage and triggering effects.
     * Inflicts 25 damage to the boss, plays hit sound, and updates the boss health bar.
     * Initiates splash animation at the collision point for visual feedback.
     * 
     * @param {Endboss} enemy - The boss enemy that was hit by the bottle
     * @private
     */
    handleBossCollision(enemy) {
        enemy.hit(25);
        this.splash(enemy);
        if (!this.world.muteButton.getMuteState()) {
            enemy.bottle_hit.play();
        }
        this.world.enemyHealthBar.setPercentage(enemy.health);
    }

    /**
     * Safely removes the bottle from the game world and cleans up resources.
     * Clears the animation interval and removes the bottle from the thrownBottles array.
     * Prevents memory leaks by ensuring proper cleanup of intervals and references.
     * 
     * @public
     */
    removeFromWorld() {
        clearInterval(this.throwInterval);
        const bottleIndex = this.world.thrownBottles.indexOf(this);
        if (bottleIndex > -1) {
            this.world.thrownBottles.splice(bottleIndex, 1);
        }
    }

    /**
     * Initiates the bottle splash animation and cleanup sequence.
     * Stops all movement, positions the splash at the collision point, and plays splash animation.
     * Automatically removes the bottle from the world after 500ms animation duration.
     * 
     * @param {Enemy} [enemy] - Optional enemy to center the splash on for precise positioning
     * @public
     */
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

    /**
     * Manages the rotating animation while the bottle is in flight.
     * Cycles through flying animation frames to create rotation effect during projectile motion.
     * Animation stops automatically when bottle enters splashing state.
     * 
     * @private
     */
    animateFlying() {
        if (!this.isSplashing) {
            this.playAnimation(this.IMAGES_FLYING);
        }
    }
}