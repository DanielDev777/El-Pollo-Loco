/**
 * Base class for all collectible objects in the game (coins, bottles, power-ups).
 * Extends MovableObject with standardized dimensions and ground positioning.
 * 
 * @class CollectibleObject
 * @extends MovableObject
 * @example
 * // Create a collectible at specific position
 * class Coin extends CollectibleObject {
 *     constructor(x) {
 *         super(x);
 *         this.loadImage('./img/coin.png');
 *     }
 * }
 */
class CollectibleObject extends MovableObject {
    /** @type {number} Standard height for collectible objects */
    height = 90;
    
    /** @type {number} Standard width for collectible objects */
    width = 70;
    
    /** @type {number} Y position at ground level */
    y = 340; // Ground level

    /**
     * Creates a new collectible object at the specified X position.
     * Sets standardized dimensions and places the object at ground level.
     * 
     * @param {number} x - The X coordinate where the collectible should be placed
     * @example
     * const coin = new CollectibleObject(300);
     * // Creates a collectible at x=300, y=340 with 70x90 dimensions
     */
    constructor(x) {
        super();
        this.x = x;
        this.height = 90;
        this.width = 70;
        this.y = 340;
    }
}