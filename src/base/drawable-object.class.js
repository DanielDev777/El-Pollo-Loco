/**
 * Base class for all drawable objects in the game.
 * Provides fundamental rendering capabilities, image management, and positioning.
 * 
 * @class DrawableObject
 * @example
 * // Create a drawable object
 * const gameObject = new DrawableObject();
 * gameObject.loadImage('path/to/image.png');
 * gameObject.draw(canvasContext);
 */
class DrawableObject {
    /** @type {HTMLImageElement} Current image being displayed */
    img;
    
    /** @type {Object.<string, HTMLImageElement>} Cache for preloaded images */
    imageCache = {};
    
    /** @type {number} Index of current image in animation sequence */
    currentImage = 0;
    
    /** @type {number} X coordinate position in pixels */
    x = 120;
    
    /** @type {number} Y coordinate position in pixels */
    y = 135;
    
    /** @type {number} Height of the object in pixels */
    height = 150;
    
    /** @type {number} Width of the object in pixels */
    width = 100;

    /**
     * Loads a single image from the specified path.
     * Creates a new Image object and sets its source to the provided path.
     * 
     * @param {string} path - The file path to the image
     * @example
     * gameObject.loadImage('./img/character/idle.png');
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Draws the object on the canvas at its current position.
     * Only draws if the image is loaded and valid.
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @example
     * const ctx = canvas.getContext('2d');
     * gameObject.draw(ctx);
     */
    draw(ctx) {
        if (this.img && this.img.complete && this.img.naturalWidth > 0) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }

    /**
     * Preloads multiple images into the image cache.
     * Useful for animation sequences or texture swapping.
     * 
     * @param {string[]} arr - Array of image paths to preload
     * @example
     * gameObject.loadImages([
     *     './img/character/walk1.png',
     *     './img/character/walk2.png',
     *     './img/character/walk3.png'
     * ]);
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Draws debug frame around the object if it's a Character.
     * Used for hitbox visualization during development.
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    drawFrame(ctx) {
        if (this instanceof Character) {
            this.calculateActualHitbox();
        }
    }

    /**
     * Calculates the actual hitbox dimensions for collision detection.
     * Adjusts the collision area to be smaller than the visual representation.
     * Character-specific implementation with hardcoded offsets.
     */
    calculateActualHitbox() {
        this.actualX = this.x + 20;
        this.actualWidth = this.width - 40;
        this.actualY = this.y + 110;
        this.actualHeight = this.height - 110;
    }

    /**
     * Checks if a point (mouse coordinates) is within the object's bounds.
     * Used for click detection and UI interactions.
     * 
     * @param {number} mouseX - X coordinate of the mouse/touch point
     * @param {number} mouseY - Y coordinate of the mouse/touch point
     * @returns {boolean} True if the point is within the object's bounds
     * @example
     * if (gameObject.isClicked(event.clientX, event.clientY)) {
     *     console.log('Object was clicked!');
     * }
     */
    isClicked(mouseX, mouseY) {
        return (
            mouseX >= this.x &&
            mouseX <= this.x + this.width &&
            mouseY >= this.y &&
            mouseY <= this.y + this.height
        );
    }
}
