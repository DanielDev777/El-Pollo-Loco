/**
 * @fileoverview Level 1 configuration for El Pollo Loco game.
 * Defines enemy spawns, collectible placement, background layers, and cloud patterns.
 * Creates a complete desert-themed level with balanced difficulty progression.
 */

/**
 * Creates and returns the complete Level 1 instance with all game objects.
 * Assembles enemies, environmental objects, and collectibles into a playable level.
 * 
 * @returns {Level} Fully configured Level 1 instance
 * @example
 * const level = createLevel1();
 * world.level = level;
 */
const createLevel1 = () => {
    return new Level(
        createEnemies(),
        createClouds(), 
        createBackgroundObjects(),
        createBottles(),
        createCoins()
    );
};

/**
 * Creates enemy spawn configuration for Level 1.
 * Spawns 7 chickens at random positions plus 1 endboss.
 * 
 * @returns {MovableObject[]} Array of enemy instances
 */
const createEnemies = () => [
    new Chicken(),
    new Chicken(),
    new Chicken(),
    new Chicken(),
    new Chicken(),
    new Chicken(),
    new Chicken(),
    new Endboss()
];

/**
 * Creates cloud pattern for atmospheric effect.
 * Alternates between two cloud variations for visual diversity.
 * 
 * @returns {Cloud[]} Array of cloud instances
 */
const createClouds = () => [
    new Cloud(0),
    new Cloud(1),
    new Cloud(0),
    new Cloud(1),
    new Cloud(0),
    new Cloud(1),
    new Cloud(0),
    new Cloud(1)
];

/**
 * Creates layered background objects for parallax scrolling effect.
 * Builds multi-layer desert scenery with alternating patterns for seamless scrolling.
 * Includes air, third layer, second layer, and first layer elements.
 * 
 * @returns {BackgroundObject[]} Array of background layer objects
 */
const createBackgroundObjects = () => {
    const arr = [];
    arr.push(new BackgroundObject('img/5_background/layers/air.png', -719));
    arr.push(new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -719));
    arr.push(new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -719));
    arr.push(new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -719));

    for (let i = 0; i < 4; i++) {
        const x = i * 719;
        arr.push(new BackgroundObject('img/5_background/layers/air.png', x));
        const suffix = (i % 2 === 1) ? '2.png' : '1.png';
        arr.push(new BackgroundObject(`img/5_background/layers/3_third_layer/${suffix}`, x));
        arr.push(new BackgroundObject(`img/5_background/layers/2_second_layer/${suffix}`, x));
        arr.push(new BackgroundObject(`img/5_background/layers/1_first_layer/${suffix}`, x));
    }
    return arr;
};

/**
 * Creates collectible bottle spawn configuration.
 * Places 4 bottles at strategic positions throughout the level for ammunition.
 * 
 * @returns {Bottle[]} Array of collectible bottle instances
 */
const createBottles = () => [
    new Bottle(500),
    new Bottle(1000),
    new Bottle(1500),
    new Bottle(2000)
];

/**
 * Creates collectible coin spawn configuration.
 * Places 4 coins at specific positions for score collection gameplay.
 * 
 * @returns {Coin[]} Array of collectible coin instances
 */
const createCoins = () => [
    new Coin(300),
    new Coin(800),
    new Coin(1400),
    new Coin(2400)
];

const level1 = createLevel1();