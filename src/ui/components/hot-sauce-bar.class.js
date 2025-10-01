/**
 * Hot sauce ammunition bar that tracks throwable bottle availability.
 * Displays orange-themed bottle collection status from 0% to 100%.
 * Each bottle throw consumes 25%, requiring 25% minimum for throwing.
 * 
 * @class HotSauceBar
 * @extends StatusBar
 * @example
 * const hotSauceBar = new HotSauceBar();
 * // Check if player can throw bottle:
 * if (hotSauceBar.percentage >= 25) {
 *     // Allow throwing, then reduce:
 *     hotSauceBar.setPercentage(hotSauceBar.percentage - 25);
 * }
 */
class HotSauceBar extends StatusBar {
    /** @type {number} Current hot sauce ammunition percentage (0-100) */
    percentage = 0;
    
    /** @type {string[]} Orange-themed bottle status bar images for different ammunition levels */
    IMAGES = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png',
    ];
    
    /**
     * Creates a new hot sauce bar with orange theme and proper positioning.
     * Initializes at 0% ammunition and loads all status bar images.
     * Positioned at y=100 to appear below coin bar in UI layout.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.y = 100;
        this.setPercentage(0);
    }
}