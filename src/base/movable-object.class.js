/**
 * Base class for all movable objects in the game.
 * Extends DrawableObject with physics, collision detection, health system, and animation.
 * 
 * @class MovableObject
 * @extends DrawableObject
 * @example
 * // Create a movable character
 * class Character extends MovableObject {
 *     constructor() {
 *         super();
 *         this.applyGravity();
 *     }
 * }
 */
class MovableObject extends DrawableObject {
    /** @type {number} Horizontal movement speed in pixels per frame */
    speed = 0.15;
    
    /** @type {boolean} Whether the object is facing the opposite direction (flipped) */
    otherDirection = false;
    
    /** @type {number} Vertical speed/velocity, positive values move upward */
    speedY = 0;
    
    /** @type {number} Gravity acceleration applied to vertical movement */
    acceleration = 1.5;
    
    /** @type {number} Current health points (0-100) */
    health = 100;
    
    /** @type {number} Timestamp of the last hit received (for invincibility frames) */
    lastHit = 0;
    
    /** @type {number} Actual X position for collision detection */
    actualX;
    
    /** @type {number} Actual width for collision detection */
    actualWidth;
    
    /** @type {number} Actual Y position for collision detection */
    actualY;
    
    /** @type {number} Actual height for collision detection */
    actualHeight;

    /**
     * Applies continuous gravity to the object.
     * Creates an interval that updates vertical position based on gravity and vertical speed.
     * Runs at 25 FPS for smooth physics simulation.
     * 
     * @example
     * character.applyGravity(); // Character will now fall when above ground
     */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    /**
     * Checks if the object is above the ground level.
     * Bottles are always considered above ground for special physics behavior.
     * 
     * @returns {boolean} True if object is above ground level (y < 135)
     * @example
     * if (character.isAboveGround()) {
     *     // Character is in the air
     * }
     */
    isAboveGround() {
        if (this instanceof Bottle) {
            return true;
        } else {
            return this.y < 135;
        }
    }

    /**
     * Checks collision between this object and another movable object.
     * Uses simplified bounding box collision detection with offset adjustments.
     * 
     * @param {MovableObject} mo - The other movable object to check collision with
     * @returns {boolean} True if objects are colliding
     * @example
     * if (player.isColliding(enemy)) {
     *     player.hit(10);
     * }
     */
    isColliding(mo) {
        return this.x + (this.width / 2) > mo.x &&
              this.y + this.height > mo.y &&
              this.x < mo.x + (mo.width / 4) &&
              this.y < mo.y + (mo.height / 2);
    }

    /**
     * Applies damage to the object and updates health and hit timestamp.
     * Health cannot go below 0, and timestamp is only updated for non-fatal hits.
     * 
     * @param {number} value - Amount of damage to apply
     * @example
     * enemy.hit(25); // Deal 25 damage to enemy
     */
    hit(value) {
        this.health -= value;
        if (this.health < 0) {
            this.health = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Checks if the object is currently in a hurt state (invincibility frames).
     * Objects are considered hurt for 1 second after taking damage.
     * 
     * @returns {boolean} True if object was hit within the last 1 second
     * @example
     * if (!character.isHurt()) {
     *     // Character can take damage
     * }
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }

    /**
     * Checks if the object is dead (health at 0).
     * 
     * @returns {boolean} True if health is exactly 0
     * @example
     * if (enemy.isDead()) {
     *     removeEnemyFromGame(enemy);
     * }
     */
    isDead() {
        return this.health == 0;
    }

    /**
     * Moves the object to the right by its speed value.
     * Optionally handles direction flag for non-boss entities.
     * 
     * @param {boolean} [boss=false] - Whether this is a boss entity (affects direction handling)
     * @example
     * character.moveRight(); // Move character right and set direction
     */
    moveRight(boss) {
        this.x += this.speed;
        if (!boss) {
            this.otherDirection = false;
        }
    }

    /**
     * Moves the object to the left by its speed value.
     * 
     * @example
     * character.moveLeft(); // Move character left
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Plays an animation by cycling through an array of image paths.
     * Updates the current image from the image cache and advances the frame counter.
     * Only updates if the image is properly loaded.
     * 
     * @param {string[]} images - Array of image paths for the animation sequence
     * @example
     * const walkImages = ['walk1.png', 'walk2.png', 'walk3.png'];
     * character.playAnimation(walkImages);
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        if (this.imageCache[path] && this.imageCache[path].complete && this.imageCache[path].naturalWidth > 0) {
            this.img = this.imageCache[path];
            this.currentImage++;
        }
    }

    /**
     * Makes the object jump by setting vertical speed.
     * Only works if the game is not in a completed state.
     * 
     * @example
     * character.jump(); // Character jumps with speedY = 20
     */
    jump() {
        if (!this.world.gameDone) {
            this.speedY = 20;
        }
    }
}
