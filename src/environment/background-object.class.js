/**
 * Background scenery object for creating layered environmental graphics.
 * Used for creating parallax backgrounds and static scenery elements.
 * Automatically positions itself at the bottom of the screen.
 * 
 * @class BackgroundObject
 * @extends MovableObject
 * @example
 * // Create background layers
 * const bg1 = new BackgroundObject('./img/desert_layer1.png', 0);
 * const bg2 = new BackgroundObject('./img/desert_layer2.png', 720);
 */
class BackgroundObject extends MovableObject {
    /** @type {number} Standard background width matching canvas width */
    width = 720;
    
    /** @type {number} Standard background height matching canvas height */
    height = 480;
    
    /**
     * Creates a new background object at the specified position.
     * Automatically positions the object at the bottom of the screen.
     * 
     * @param {string} imagePath - Path to the background image
     * @param {number} x - X coordinate for positioning the background
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.y = 480 - this.height;
        this.x = Math.round(x);
    }
}