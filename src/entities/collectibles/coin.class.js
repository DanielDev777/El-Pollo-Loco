/**
 * Animated coin collectible that powers the special beam attack.
 * Features a simple two-frame animation to attract player attention.
 * Collecting coins fills the coin bar for special abilities.
 * 
 * @class Coin
 * @extends CollectibleObject
 * @example
 * const coin = new Coin(300);
 * // Coin will automatically animate and can be collected by player
 */
class Coin extends CollectibleObject {
    /** @type {string[]} Animation frames for coin spinning */
    IMAGES = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    /**
     * Creates a new coin at the specified position with animation.
     * 
     * @param {number} x - X coordinate for coin placement
     */
    constructor(x) {
        super(x);
        this.loadImages(this.IMAGES);
        this.animate();
    }

    /**
     * Starts the coin spinning animation.
     * Alternates between two frames every 500ms for visibility.
     * 
     * @private
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 500);
    }
}
