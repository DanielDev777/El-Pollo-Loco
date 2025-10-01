/**
 * Animated cloud object that moves across the sky for atmospheric effect.
 * Spawns at random positions and continuously moves left to create parallax effect.
 * Supports multiple cloud variations for visual diversity.
 * 
 * @class Cloud
 * @extends MovableObject
 * @example
 * // Create different cloud types
 * const cloud1 = new Cloud(0); // First cloud variation
 * const cloud2 = new Cloud(1); // Second cloud variation
 */
class Cloud extends MovableObject {
    /** @type {number} Y position in the sky */
    y = 50;
    
    /** @type {number} Cloud height in pixels */
    height = 250;
    
    /** @type {number} Cloud width in pixels */
    width = 500;
    
    /** @type {string[]} Available cloud image variations */
    IMAGES = [
        'img/5_background/layers/4_clouds/1.png',
        'img/5_background/layers/4_clouds/2.png'
    ]

    /**
     * Creates a new cloud with specified variation.
     * Spawns at random X position and begins moving animation.
     * 
     * @param {number} value - Cloud variation index (0 or 1)
     */
    constructor(value) {
        super().loadImage(this.IMAGES[value]);
        this.x = Math.random() * 4000;

        this.animate();
    }

    animate() {
        setInterval(() => {
            if (this.world) {
                this.moveLeft();
            }
        }, 1000 / 60);
    }
}