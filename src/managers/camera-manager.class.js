/**
 * Manages camera positioning and smooth transitions in the game world.
 * Handles different camera modes (left/right) with smooth transitions between them.
 * Provides adaptive movement speeds based on character state for optimal gameplay experience.
 * 
 * @class CameraManager
 * @example
 * const cameraManager = new CameraManager(canvas);
 * // In game loop:
 * cameraManager.updateCamera(character, keyboard);
 * ctx.setTransform(1, 0, 0, 1, cameraManager.camera_x, 0);
 */
class CameraManager {
    /** @type {number} Current camera X position offset */
    camera_x = 0;
    
    /** @type {string} Current camera mode: 'left' or 'right' */
    camera_mode = 'right';
    
    /** @type {boolean} Whether camera is currently transitioning between modes */
    camera_transitioning = false;
    
    /** @type {number} Progress of current transition (0-1) */
    camera_transition_progress = 0;
    
    /** @type {number} Starting X position for current transition */
    camera_start_x = 0;
    
    /** @type {number} Target X position for current transition */
    camera_end_x = 0;
    
    /** @type {number} Speed multiplier for camera transitions */
    camera_transition_speed = 0.25;

    /**
     * Creates a new camera manager instance.
     * 
     * @param {HTMLCanvasElement} canvas - The game canvas for boundary calculations
     */
    constructor(canvas) {
        this.canvas = canvas;
    }

    /**
     * Updates camera position based on character state and input.
     * Handles mode transitions and smooth movement with adaptive speeds.
     * 
     * @param {Character} character - The player character to follow
     * @param {Keyboard} keyboard - Current keyboard input state
     */
    updateCamera(character, keyboard) {
        const currentMode = this.getCameraMode(character, keyboard);
        
        if (this.camera_transitioning) {
            this.handleCameraTransition(character, keyboard);
        } else if (this.camera_mode !== currentMode) {
            this.startCameraTransition(currentMode, character);
        } else {
            this.updateCameraNormal(character);
        }
    }

    /**
     * Determines appropriate camera mode based on character movement and direction.
     * 
     * @param {Character} character - The player character
     * @param {Keyboard} keyboard - Current keyboard input state
     * @returns {string} 'left' or 'right' camera mode
     */
    getCameraMode(character, keyboard) {
        return ((keyboard.LEFT && character.x > 0) || character.otherDirection) ? 'left' : 'right';
    }

    /**
     * Initiates a smooth transition to a new camera mode.
     * Sets up transition parameters and calculates target position with boundaries.
     * 
     * @param {string} newMode - The target camera mode ('left' or 'right')
     * @param {Character} character - The player character for position calculation
     */
    startCameraTransition(newMode, character) {
        this.camera_start_x = this.camera_x;
        this.camera_mode = newMode;
        this.camera_transitioning = true;
        this.camera_transition_progress = 0;
        
        let targetCameraX = this.calculateTargetPosition(newMode, character);
        const leftBoundary = 0;
        const rightBoundary = -(2800 - this.canvas.width);
        this.camera_end_x = Math.max(rightBoundary, Math.min(leftBoundary, targetCameraX));
    }

    /**
     * Handles smooth camera movement during transitions.
     * Uses adaptive speeds: faster when character is moving (25px/frame), slower when standing (10px/frame).
     * 
     * @param {Character} character - The player character for position calculation
     * @param {Keyboard} keyboard - Current keyboard input state for movement detection
     */
    handleCameraTransition(character, keyboard) {
        let currentTarget = this.calculateTargetPosition(this.camera_mode, character);
        const leftBoundary = 0;
        const rightBoundary = -(2800 - this.canvas.width);
        currentTarget = Math.max(rightBoundary, Math.min(leftBoundary, currentTarget));
        
        const distance = currentTarget - this.camera_x;
        const isCharacterMoving = keyboard.LEFT || keyboard.RIGHT;
        const moveSpeed = isCharacterMoving ? 25 : 10;
        
        if (Math.abs(distance) <= moveSpeed) {
            this.camera_x = currentTarget;
            this.camera_transitioning = false;
        } else {
            this.camera_x += distance > 0 ? moveSpeed : -moveSpeed;
        }
        
        this.camera_x = Math.round(this.camera_x);
    }

    /**
     * Updates camera position in normal (non-transitioning) mode.
     * Immediately snaps to target position with boundary constraints.
     * 
     * @param {Character} character - The player character for position calculation
     */
    updateCameraNormal(character) {
        let targetCameraX = this.calculateTargetPosition(this.camera_mode, character);
        const leftBoundary = 0;
        const rightBoundary = -(2800 - this.canvas.width);
        targetCameraX = Math.max(rightBoundary, Math.min(leftBoundary, targetCameraX));
        this.camera_x = Math.round(targetCameraX);
    }

    /**
     * Calculates target camera position based on mode and character position.
     * 
     * @param {string} mode - Camera mode ('left' or 'right')
     * @param {Character} character - The player character
     * @returns {number} Target camera X position
     */
    calculateTargetPosition(mode, character) {
        if (mode === 'left') {
            const cameraOffset = this.canvas.width / 2;
            return -character.x + cameraOffset;
        } else {
            return -character.x + 100;
        }
    }
}