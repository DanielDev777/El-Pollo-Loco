/**
 * Handles all user input processing including mouse clicks and coordinate transformations.
 * Manages canvas click events and coordinates between screen space and game space.
 * Supports fullscreen mode with proper coordinate scaling and letterboxing.
 * 
 * @class InputHandler
 * @example
 * const inputHandler = new InputHandler(world);
 * inputHandler.setupButtons(); // Initialize click handlers
 */
class InputHandler {
    /**
     * Creates a new input handler instance.
     * 
     * @param {World} world - Reference to the main game world
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Initializes all input event handlers.
     * Sets up canvas click detection for UI interactions.
     */
    setupButtons() {
        this.setupCanvasClickHandler();
    }

    /**
     * Sets up click event listener on the game canvas.
     * Handles coordinate transformation and delegates to button click handlers.
     * 
     * @private
     */
    setupCanvasClickHandler() {
        this.world.canvas.addEventListener('click', (event) => {
            const { mouseX, mouseY } = this.getMouseCoordinates(event);
            this.handleButtonClicks(mouseX, mouseY);
        });
    }

    /**
     * Converts mouse event coordinates to game canvas coordinates.
     * Handles both windowed and fullscreen modes with proper scaling.
     * 
     * @param {MouseEvent} event - The mouse click event
     * @returns {{mouseX: number, mouseY: number}} Transformed coordinates
     */
    getMouseCoordinates(event) {
        const rect = this.world.canvas.getBoundingClientRect();
        let mouseX = event.clientX - rect.left;
        let mouseY = event.clientY - rect.top;

        if (this.world.fullScreenButton.getFullscreenState()) {
            return this.transformFullscreenCoordinates(mouseX, mouseY, rect);
        }

        return { mouseX, mouseY };
    }

    /**
     * Transforms coordinates for fullscreen mode with letterboxing support.
     * Handles both wide and tall screen aspect ratios appropriately.
     * 
     * @param {number} mouseX - Raw mouse X coordinate
     * @param {number} mouseY - Raw mouse Y coordinate
     * @param {DOMRect} rect - Canvas bounding rectangle
     * @returns {{mouseX: number, mouseY: number}} Transformed coordinates
     * @private
     */
    transformFullscreenCoordinates(mouseX, mouseY, rect) {
        const canvasAspectRatio = 720 / 480;
        const screenAspectRatio = rect.width / rect.height;
        
        if (screenAspectRatio > canvasAspectRatio) {
            return this.transformWideScreenCoordinates(mouseX, mouseY, rect, canvasAspectRatio);
        } else {
            return this.transformTallScreenCoordinates(mouseX, mouseY, rect, canvasAspectRatio);
        }
    }

    /**
     * Handles coordinate transformation for wide screen aspect ratios.
     * Calculates letterboxing offsets and scales coordinates for proper alignment.
     * Used when screen is wider than the game's native 720x480 aspect ratio.
     * 
     * @param {number} mouseX - Raw mouse X coordinate
     * @param {number} mouseY - Raw mouse Y coordinate
     * @param {DOMRect} rect - Canvas bounding rectangle
     * @param {number} canvasAspectRatio - Native canvas aspect ratio (1.5)
     * @returns {{mouseX: number, mouseY: number}} Transformed coordinates
     * @private
     */
    transformWideScreenCoordinates(mouseX, mouseY, rect, canvasAspectRatio) {
        const scaledWidth = rect.height * canvasAspectRatio;
        const offsetX = (rect.width - scaledWidth) / 2;
        
        mouseX = (mouseX - offsetX) * (720 / scaledWidth);
        mouseY = mouseY * (480 / rect.height);
        
        return { mouseX, mouseY };
    }

    /**
     * Handles coordinate transformation for tall screen aspect ratios.
     * Calculates pillarboxing offsets and scales coordinates for proper alignment.
     * Used when screen is taller than the game's native 720x480 aspect ratio.
     * 
     * @param {number} mouseX - Raw mouse X coordinate
     * @param {number} mouseY - Raw mouse Y coordinate
     * @param {DOMRect} rect - Canvas bounding rectangle
     * @param {number} canvasAspectRatio - Native canvas aspect ratio (1.5)
     * @returns {{mouseX: number, mouseY: number}} Transformed coordinates
     * @private
     */
    transformTallScreenCoordinates(mouseX, mouseY, rect, canvasAspectRatio) {
        const scaledHeight = rect.width / canvasAspectRatio;
        const offsetY = (rect.height - scaledHeight) / 2;
        
        mouseX = mouseX * (720 / rect.width);
        mouseY = (mouseY - offsetY) * (480 / scaledHeight);
        
        return { mouseX, mouseY };
    }

    /**
     * Delegates click events to appropriate button handlers.
     * Processes both mute button and fullscreen button interactions.
     * Called after coordinate transformation is complete.
     * 
     * @param {number} mouseX - Transformed mouse X coordinate
     * @param {number} mouseY - Transformed mouse Y coordinate
     * @private
     */
    handleButtonClicks(mouseX, mouseY) {
        this.handleMuteButtonClick(mouseX, mouseY);
        this.handleFullscreenButtonClick(mouseX, mouseY);
    }

    /**
     * Processes mute button click interactions.
     * Checks if click coordinates are within mute button bounds and toggles audio.
     * Uses defensive programming to verify isClicked method exists.
     * 
     * @param {number} mouseX - Transformed mouse X coordinate
     * @param {number} mouseY - Transformed mouse Y coordinate
     * @private
     */
    handleMuteButtonClick(mouseX, mouseY) {
        if (this.world.muteButton.isClicked && this.world.muteButton.isClicked(mouseX, mouseY)) {
            this.world.muteButton.toggle();
        }
    }

    /**
     * Processes fullscreen button click interactions with position adjustment.
     * Applies coordinate offset when in fullscreen mode for accurate hit detection.
     * The 70-pixel adjustment compensates for fullscreen coordinate differences.
     * 
     * @param {number} mouseX - Transformed mouse X coordinate
     * @param {number} mouseY - Transformed mouse Y coordinate
     * @private
     */
    handleFullscreenButtonClick(mouseX, mouseY) {
        let adjustedMouseX = mouseX;
        
        if (this.world.fullScreenButton.getFullscreenState()) {
            adjustedMouseX = mouseX + 70;
        }

        if (this.world.fullScreenButton.isClicked && this.world.fullScreenButton.isClicked(adjustedMouseX, mouseY)) {
            this.world.fullScreenButton.toggle();
        }
    }
}