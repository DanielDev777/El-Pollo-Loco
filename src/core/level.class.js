/**
 * Represents a game level containing all objects and entities.
 * Manages the collection of enemies, environmental objects, and collectibles.
 * Defines the level boundaries for camera and collision systems.
 * 
 * @class Level
 * @example
 * const level = new Level(
 *     [new Chicken(), new Endboss()],  // enemies
 *     [new Cloud()],                   // clouds  
 *     [new BackgroundObject()],        // background objects
 *     [new Bottle()],                  // collectible bottles
 *     [new Coin()]                     // collectible coins
 * );
 */
class Level {
    /** @type {MovableObject[]} Array of enemy objects in the level */
    enemies;
    
    /** @type {Cloud[]} Array of cloud objects for background animation */
    clouds;
    
    /** @type {BackgroundObject[]} Array of background objects for scenery */
    backgroundObjects;
    
    /** @type {Bottle[]} Array of collectible bottle objects */
    bottles;
    
    /** @type {Coin[]} Array of collectible coin objects */
    coins;
    
    /** @type {number} X coordinate where the level starts */
    level_start_x = 0;
    
    /** @type {number} X coordinate where the level ends */
    level_end_x = 2600;

    /**
     * Creates a new level with the specified objects.
     * Initializes all object collections for the level.
     * 
     * @param {MovableObject[]} enemies - Array of enemy objects
     * @param {Cloud[]} clouds - Array of cloud objects  
     * @param {BackgroundObject[]} backgroundObjects - Array of background objects
     * @param {Bottle[]} bottles - Array of collectible bottles
     * @param {Coin[]} coins - Array of collectible coins
     * @example
     * const level1 = new Level(
     *     createEnemies(),
     *     createClouds(), 
     *     createBackgrounds(),
     *     createBottles(),
     *     createCoins()
     * );
     */
    constructor(enemies, clouds, backgroundObjects, bottles, coins) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.bottles = bottles;
        this.coins = coins;
    }
}