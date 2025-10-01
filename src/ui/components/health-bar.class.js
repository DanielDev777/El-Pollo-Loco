/**
 * Health status bar component displaying character or enemy health.
 * Supports different color schemes: green for character, orange for enemies.
 * Automatically updates visual representation based on health percentage.
 * 
 * @class HealthBar
 * @extends StatusBar
 * @example
 * const playerHealth = new HealthBar(40, "character");
 * const bossHealth = new HealthBar(800, "enemy");
 */
class HealthBar extends StatusBar {

    /** @type {string[]} Health bar images for character (green theme) */
    IMAGES = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png',
    ];  
    
    /** @type {string[]} Health bar images for enemies (orange theme) */
    IMAGES_ENEMY = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/100.png',
    ];

    /**
     * Creates a new health bar with specified position and theme.
     * Sets color scheme based on type: green for character, orange for enemies.
     * Initializes at full health (100%) and positions at specified coordinates.
     * 
     * @param {number} x - Horizontal position for the health bar
     * @param {string} type - Theme type: "character" for green, "enemy" for orange
     */
    constructor(x, type) {
        super();
        if (type === 'character') {
            this.IMAGES = this.IMAGES;
        } else if (type === 'enemy') {
            this.IMAGES = this.IMAGES_ENEMY;
        }
        this.loadImages(this.IMAGES);
        this.x = x;
        this.y = 0;
        this.setPercentage(100);
    }
}