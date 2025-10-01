/**
 * Interactive fullscreen toggle button for immersive gaming experience.
 * Handles fullscreen API interactions and coordinate transformation updates.
 * Automatically adjusts button appearance and position based on fullscreen state.
 * 
 * @class FullScreenButton
 * @extends DrawableObject
 * @example
 * const fullscreenButton = new FullScreenButton(canvasElement);
 * // Click handling in input manager:
 * if (fullscreenButton.isClicked(mouseX, mouseY)) {
 *     fullscreenButton.toggle();
 * }
 */
class FullScreenButton extends DrawableObject {
    /** @type {number} Button width in pixels */
    width = 50;
    
    /** @type {number} Button height in pixels */
    height = 50;
    
    /** @type {number} X position on screen (right side) */
    x = 730;
    
    /** @type {number} Y position on screen (bottom) */
    y = 420;
    
    /** @type {boolean} Current fullscreen state */
    isFullscreen = false;
    
    /** @type {HTMLCanvasElement} Canvas element to make fullscreen */
    canvas;

    /**
     * Creates a new fullscreen button with canvas reference and event handling.
     * Loads both fullscreen and minimize icons and sets up state change listeners.
     * 
     * @param {HTMLCanvasElement} canvas - Canvas element to control fullscreen for
     */
    constructor(canvas) {
        super();
        this.canvas = canvas;
        this.loadImage('img/icons/fullscreen.svg');
        this.loadImages([
            'img/icons/minimize.svg',
            'img/icons/fullscreen.svg'
        ]);
        this.setupFullscreenListener();
    }
    
    /**
     * Updates button image based on current fullscreen state.
     * Shows minimize icon in fullscreen mode, fullscreen icon in windowed mode.
     * Provides visual feedback about available action.
     * 
     * @param {boolean} isFullscreen - Current fullscreen state
     * @private
     */
    updateImage(isFullscreen) {
        const imagePath = isFullscreen ? 'img/icons/minimize.svg' : 'img/icons/fullscreen.svg';
        this.img = this.imageCache[imagePath];
    }

    /**
     * Toggles between fullscreen and windowed modes.
     * Automatically detects current state and switches to opposite mode.
     * Handles browser fullscreen API calls asynchronously.
     * 
     * @public
     */
    toggle() {
        if (!document.fullscreenElement) {
            this.enterFullscreen();
        } else {
            this.exitFullscreen();
        }
    }

    /**
     * Enters fullscreen mode by requesting fullscreen on the canvas element.
     * Uses modern Fullscreen API for cross-browser compatibility.
     * 
     * @returns {Promise<void>} Promise that resolves when fullscreen is entered
     * @private
     */
    async enterFullscreen() {
        await this.canvas.requestFullscreen();
    }

    /**
     * Exits fullscreen mode and returns to windowed display.
     * Uses document-level exitFullscreen for proper state management.
     * 
     * @returns {Promise<void>} Promise that resolves when fullscreen is exited
     * @private
     */
    async exitFullscreen() {
        await document.exitFullscreen();
    }

    /**
     * Sets up event listener for fullscreen state changes.
     * Updates internal state, button positions, and appearance when fullscreen changes.
     * Also updates mute button position if reference is available.
     * 
     * @private
     */
    setupFullscreenListener() {
        document.addEventListener('fullscreenchange', () => {
            this.isFullscreen = !!document.fullscreenElement;
            this.updateButtonPositions();
            this.updateImage(this.isFullscreen);
            if (this.muteButton) {
                this.muteButton.updateButtonPositions();
            }
        });
    }

    /**
     * Detects if the current device is a mobile device.
     * Uses multiple detection methods: user agent, touch support, and max touch points.
     * Used to conditionally hide fullscreen button on mobile devices.
     * 
     * @returns {boolean} True if running on a mobile device
     * @public
     */
    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               ('ontouchstart' in window) || 
               (navigator.maxTouchPoints > 0);
    }

    /**
     * Sets reference to mute button for coordinated position updates.
     * Allows fullscreen button to update mute button position during state changes.
     * Ensures both UI buttons maintain proper positioning in different display modes.
     * 
     * @param {MuteButton} muteButton - Reference to the mute button instance
     * @public
     */
    setMuteButtonReference(muteButton) {
        this.muteButton = muteButton;
    }

    /**
     * Resets button position and dimensions to default values.
     * Used to restore button layout after fullscreen changes or initialization.
     * Ensures consistent button placement across different display modes.
     * 
     * @public
     */
    updateButtonPositions() {
        this.x = 730;
        this.y = 420;
        this.width = 50;
        this.height = 50;
    }

    /**
     * Gets the current fullscreen state for input coordinate calculations.
     * Used by input handler to determine proper coordinate transformation.
     * 
     * @returns {boolean} True if currently in fullscreen mode
     * @public
     */
    getFullscreenState() {
        return this.isFullscreen;
    }
}