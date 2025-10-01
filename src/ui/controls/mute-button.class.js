/**
 * Interactive mute button for controlling game audio.
 * Provides persistent mute state using localStorage for user preference.
 * Toggles between sound and mute icons based on current state.
 * 
 * @class MuteButton
 * @extends DrawableObject
 * @example
 * const muteButton = new MuteButton();
 * // Click handling in input manager:
 * if (muteButton.isClicked(mouseX, mouseY)) {
 *     muteButton.toggleMute();
 * }
 */
class MuteButton extends DrawableObject {
    /** @type {number} Button width in pixels */
    width = 50;
    
    /** @type {number} Button height in pixels */
    height = 50;
    
    /** @type {number} X position on screen */
    x = 20;
    
    /** @type {number} Y position on screen */
    y = 420;
    
    /** @type {boolean} Current mute state */
    isMuted = false;
    
    /**
     * Creates a new mute button with default state and saved preferences.
     * Loads both sound and mute icons and restores previous state from localStorage.
     */
    constructor() {
        super();
        this.loadImage('img/icons/sound.svg');
        this.loadImages([
            'img/icons/mute.svg',
            'img/icons/sound.svg'
        ]);
        this.getLocalMuteState();
    }

    /**
     * Restores mute state from localStorage to maintain user preferences.
     * Checks for saved state and updates both internal flag and button image.
     * Provides persistent audio settings across game sessions.
     * 
     * @private
     */
    getLocalMuteState() {
        const savedMuteState = localStorage.getItem("muted");
        if (savedMuteState !== null) {
            this.isMuted = savedMuteState === 'true';
            this.updateImage(this.isMuted);
        }
    }

    /**
     * Updates the button image based on current mute state.
     * Switches between mute icon and sound icon for visual feedback.
     * Handles both string and boolean mute state values.
     * 
     * @param {boolean|string} isMuted - Current mute state
     * @private
     */
    updateImage(isMuted) {
        const imagePath = (isMuted === 'true' || isMuted === true)  ? 'img/icons/mute.svg' : 'img/icons/sound.svg';
        this.img = this.imageCache[imagePath];
    }

    /**
     * Toggles the mute state between on and off.
     * Updates localStorage and button image to reflect new state.
     * Returns the new mute state for immediate use.
     * 
     * @returns {boolean} New mute state after toggle
     * @public
     */
    toggle() {
        this.isMuted = !this.isMuted;
        localStorage.setItem("muted", this.isMuted.toString());
        this.updateImage(this.isMuted);
        return this.isMuted;
    }

    /**
     * Gets the current mute state for audio control decisions.
     * Used throughout the game to check if sounds should be played.
     * 
     * @returns {boolean} True if audio is muted, false if enabled
     * @public
     */
    getMuteState() {
        return this.isMuted;
    }

    /**
     * Programmatically sets the mute state to a specific value.
     * Updates internal state, localStorage, and button image accordingly.
     * Useful for external control or resetting audio preferences.
     * 
     * @param {boolean|string} muteState - Desired mute state
     * @public
     */
    setMuteState(muteState) {
        this.isMuted = Boolean(muteState);
        localStorage.setItem("muted", this.isMuted.toString());
        this.updateImage(this.isMuted);
    }

    /**
     * Resets button position and dimensions to default values.
     * Used to restore button layout after screen changes or initialization.
     * Ensures consistent button placement across different contexts.
     * 
     * @public
     */
    updateButtonPositions() {
        this.x = 20;
        this.y = 420;
        this.width = 50;
        this.height = 50;
    }
}