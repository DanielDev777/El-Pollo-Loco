/**
 * Basic enemy chicken that moves left and can be defeated by jumping on it.
 * Spawns at random positions with random speeds for variety.
 * Includes walking animation and death state handling.
 * 
 * @class Chicken
 * @extends MovableObject
 * @example
 * const chicken = new Chicken();
 * // Chicken will automatically animate and move left
 */
class Chicken extends MovableObject {
    /** @type {number} Y position at ground level */
    y = 360;
    
    /** @type {number} Chicken width in pixels */
    width = 80;
    
    /** @type {number} Chicken height in pixels */
    height = 60;
    
    /** @type {string[]} Animation frames for walking */
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];
    
    /** @type {string} Image used when chicken is dead */
    IMAGE_DEAD = 'img/3_enemies_chicken/chicken_normal/2_dead/dead.png';

    /**
     * Creates a new chicken enemy with random position and speed.
     * Loads all necessary images and starts the animation loop.
     * Spawns between x=400 and x=1900 with variable speed for gameplay variety.
     */
    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImage(this.IMAGE_DEAD);
        this.x = 400 + Math.random() * 1500;
        this.speed = 0.15 + Math.random() * 0.5;
        this.animate();
    }
    
    /**
     * Starts the chicken animation and movement loops.
     * Creates two intervals: one for movement at 60fps and one for animation cycling.
     * Movement stops when chicken dies, but switches to dead image display.
     * 
     * @private
     */
    animate() {
        setInterval(() => {
            if (!this.isDead() && this.world) {
                this.moveLeft();
            }
        }, 1000 / 60);
        setInterval(() => {
            if (!this.isDead()) {
                this.playAnimation(this.IMAGES_WALKING);
            } else {
                this.loadImage(this.IMAGE_DEAD);
            }
        }, 200);
    }
}