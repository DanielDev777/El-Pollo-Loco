/**
 * Base class for all status bar UI components.
 * Provides percentage-based visual feedback with multiple states.
 * Uses image switching to represent different percentage ranges.
 * 
 * @class StatusBar
 * @extends DrawableObject
 * @abstract
 * @example
 * class HealthBar extends StatusBar {
 *     constructor() {
 *         super();
 *         this.loadImages(this.IMAGES);
 *     }
 * }
 */
class StatusBar extends DrawableObject {
    /** @type {number} Current percentage value (0-100) */
    percentage = 0;

    /**
     * Creates a new status bar with default positioning and dimensions.
     */
    constructor() {
        super();
        this.x = 40;
        this.width = 200;
        this.height = 60;
    }

    /**
     * Updates the status bar percentage and refreshes the visual representation.
     * Automatically selects appropriate image based on percentage value.
     * 
     * @param {number} percentage - New percentage value (0-100)
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }
    
    resolveImageIndex() {
        switch (true) {
            case (this.percentage == 100):
                return 5;
            case (this.percentage >= 80):
                return 4;
            case (this.percentage >= 60):
                return 3;
            case (this.percentage >= 40):
                return 2;
            case (this.percentage >= 20):
                return 1;
            default:
                return 0;

        }
    }
}