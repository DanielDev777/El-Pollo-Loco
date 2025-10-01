/**
 * Coin collection progress bar that tracks special move availability.
 * Displays blue-themed coin collection status from 0% to 100%.
 * Special move becomes available when coin bar reaches 100%.
 * 
 * @class CoinBar
 * @extends StatusBar
 * @example
 * const coinBar = new CoinBar();
 * // Increase progress when collecting coins:
 * coinBar.setPercentage(coinBar.percentage + 25);
 */
class CoinBar extends StatusBar {
    /** @type {number} Current coin collection percentage (0-100) */
    percentage = 0;
    
    /** @type {string[]} Blue-themed status bar images for different percentage levels */
    IMAGES = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png',
    ];

    /**
     * Creates a new coin bar with blue theme and proper positioning.
     * Initializes at 0% progress and loads all status bar images.
     * Positioned at y=50 to appear below health bar in UI layout.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.y = 50;
        this.setPercentage(0);
    }
}