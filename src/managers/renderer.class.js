/**
 * Handles all rendering operations for the game world.
 * Manages camera transformations, object drawing, and UI rendering.
 * Coordinates between world space and screen space rendering contexts.
 * 
 * @class Renderer
 * @example
 * const renderer = new Renderer(world);
 * // In game loop:
 * renderer.draw();
 */
class Renderer {
    /**
     * Creates a new renderer instance.
     * 
     * @param {World} world - Reference to the main game world
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Main rendering method that draws the complete game frame.
     * Handles camera transformations and renders objects in proper layers.
     */
    draw() {
        this.clearCanvas();
        this.world.ctx.translate(this.world.cameraManager.camera_x, 0);
        this.createLevelObjects();
        this.world.ctx.translate(-this.world.cameraManager.camera_x, 0);
        this.createUI();
    }

    /**
     * Clears the entire canvas for the next frame.
     * 
     * @private
     */
    clearCanvas() {
        this.world.ctx.clearRect(0, 0, this.world.canvas.width, this.world.canvas.height);
    }

    /**
     * Renders all level objects in proper layering order.
     * Objects are drawn from background to foreground for correct depth.
     * 
     * @private
     */
    createLevelObjects() {
        this.addObjectsToMap(this.world.level.backgroundObjects);
        this.addObjectsToMap(this.world.level.clouds);
        this.addToMap(this.world.character);
        this.addObjectsToMap(this.world.level.enemies);
        this.addObjectsToMap(this.world.level.bottles);
        this.addObjectsToMap(this.world.level.coins);
        this.addObjectsToMap(this.world.thrownBottles);
        this.addObjectsToMap(this.world.specialMoves);
        this.removeExpiredSpecialMoves();
    }

    /**
     * Renders all UI elements that should appear on top of the game world.
     * UI elements are rendered in screen space (not affected by camera).
     * 
     * @private
     */
    createUI() {
        this.addToMap(this.world.healthBar);
        this.addToMap(this.world.coinBar);
        this.addToMap(this.world.hotSauceBar);
        this.addToMap(this.world.enemyHealthBar);
        this.addToMap(this.world.muteButton);
        if (!this.world.fullScreenButton.isMobileDevice()) {
            this.addToMap(this.world.fullScreenButton);
        }
    }

    /**
     * Helper method to render an array of drawable objects.
     * 
     * @param {DrawableObject[]} objects - Array of objects to render
     */
    addObjectsToMap(objects) {
        objects.forEach((o) => {
            this.addToMap(o);
        });
    }

    /**
     * Renders a single movable object with proper transformations.
     * Handles rotation for backflips and horizontal flipping for direction changes.
     * Draws the object and its debug frame, then restores canvas transformations.
     * 
     * @param {DrawableObject} mo - The drawable object to render
     * @private
     */
    addToMap(mo) {
        if (mo.rotation && mo.rotation !== 0) {
            this.rotateImage(mo);
        } else if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.world.ctx);

        mo.drawFrame(this.world.ctx);

        if (mo.rotation && mo.rotation !== 0) {
            this.rotateImageBack(mo);
        } else if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
     * Removes special move attacks that have expired from the game world.
     * Filters out moves that have completed their animation or exceeded duration.
     * Prevents memory buildup from accumulated special move objects.
     * 
     * @private
     */
    removeExpiredSpecialMoves() {
        this.world.specialMoves = this.world.specialMoves.filter((move) => !move.isExpired());
    }

    /**
     * Sets up horizontal flipping transformation for directional sprites.
     * Saves canvas state, translates and scales to flip image horizontally.
     * Adjusts object x position to account for coordinate system change.
     * 
     * @param {DrawableObject} mo - Object to flip horizontally
     * @private
     */
    flipImage(mo) {
        this.world.ctx.save();
        this.world.ctx.translate(mo.width, 0);
        this.world.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores canvas state after horizontal flipping transformation.
     * Reverts object x position and restores saved canvas transformation state.
     * Must be called after flipImage to maintain proper canvas state.
     * 
     * @param {DrawableObject} mo - Object that was flipped
     * @private
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.world.ctx.restore();
    }

    /**
     * Sets up rotation transformation for objects like backflipping characters.
     * Translates to object center, applies directional scaling and rotation.
     * Stores original position and adjusts coordinates for centered rotation.
     * 
     * @param {DrawableObject} mo - Object to rotate
     * @private
     */
    rotateImage(mo) {
        this.world.ctx.save();
        this.world.ctx.translate(mo.x + mo.width / 2, mo.y + mo.height / 2);

        if (mo.otherDirection && mo.isBackflipping) {
            this.world.ctx.scale(-1, 1);
        }

        this.world.ctx.rotate((mo.rotation * Math.PI) / 180);
        mo._originalX = mo.x;
        mo._originalY = mo.y;
        mo.x = -mo.width / 2;
        mo.y = -mo.height / 2;
    }

    /**
     * Restores canvas state after rotation transformation.
     * Reverts object position to original coordinates and restores canvas state.
     * Must be called after rotateImage to maintain proper transformation stack.
     * 
     * @param {DrawableObject} mo - Object that was rotated
     * @private
     */
    rotateImageBack(mo) {
        mo.x = mo._originalX;
        mo.y = mo._originalY;
        this.world.ctx.restore();
    }
}