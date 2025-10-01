/**
 * Manages character movement logic and input processing.
 * Handles left/right movement, boundary checking, and sound effects.
 * Coordinates between input state and character position updates.
 * 
 * @class CharacterMovementController
 * @example
 * const movementController = new CharacterMovementController(character);
 * // In character's update method:
 * movementController.handleMovement();
 */
class CharacterMovementController {
    /**
     * Creates a new character movement controller.
     * 
     * @param {Character} character - The character to control movement for
     */
    constructor(character) {
        this.character = character;
    }

    /**
     * Main movement handler that processes all movement input.
     * Handles both left and right movement with appropriate sound effects.
     */
    handleMovement() {
        this.handleRight();
        this.handleLeft();
    }

    /**
     * Handles rightward movement input with boundary checking and audio.
     * Moves character right when input is active and within level bounds.
     * Plays walking sound when grounded and audio is enabled.
     * Sets character direction flag for sprite flipping.
     * 
     * @private
     */
    handleRight() {
        if (this.character.world.keyboard.RIGHT && this.character.x < this.character.world.level.level_end_x && !this.character.world.gameDone) {
            this.character.otherDirection = false;
            this.character.moveRight();
            if (!this.character.isAboveGround()) {
                if (!this.character.world.muteButton.getMuteState()) {
                    this.character.walking_sound.play();
                }
            }
        }
    }

    /**
     * Handles leftward movement input with boundary checking and audio.
     * Moves character left when input is active and within level bounds.
     * Plays walking sound when grounded and audio is enabled.
     * Sets character direction flag for sprite flipping.
     * 
     * @private
     */
    handleLeft() {
        if (this.character.world.keyboard.LEFT && this.character.x > 0 && !this.character.world.gameDone) {
            this.character.otherDirection = true;
            this.character.moveLeft();
            if (!this.character.isAboveGround()) {
                if (!this.character.world.muteButton.getMuteState()) {
                    this.character.walking_sound.play();
                }
            }
        }
    }

    /**
     * Handles jump input and prepares for potential backflip mechanics.
     * Initiates jump when space is pressed and character is grounded.
     * Resets jump animation state and prepares backflip availability.
     * Continues to monitor for mid-air backflip input.
     * 
     * @public
     */
    handleJumping() {
        if (this.character.world.keyboard.SPACE && !this.character.isAboveGround()) {
            this.character.jump();
            this.character.backflipReady = true;
            this.character.animationManager.jumpAnimationPlayed = false;
            this.character.animationManager.jumpAnimationIndex = 0;
            this.character.animationManager.jumpAnimationFrameCounter = 0;
        }
        this.checkBackflipReady();
    }

    /**
     * Monitors for mid-air backflip input when character is airborne.
     * Triggers backflip on space key press during jump (single press detection).
     * Consumes backflip opportunity to prevent multiple backflips per jump.
     * Requires character to be above ground and backflip to be ready.
     * 
     * @private
     */
    checkBackflipReady() {
        if (this.character.isAboveGround()) {
            if (this.character.world.keyboard.SPACE && !this.character.lastSpaceState && this.character.backflipReady) {
                this.character.backflip();
                this.character.backflipReady = false;
            }
        }
    }

    /**
     * Updates backflip rotation animation when character is performing backflip.
     * Advances rotation by backflip speed each frame for smooth animation.
     * Automatically stops backflip when full 360-degree rotation is complete.
     * Only executes when character is in backflipping state.
     * 
     * @public
     */
    updateBackflip() {
        if (this.character.isBackflipping) {
            this.character.rotation += this.character.backflipSpeed;
            if (this.isBackflipComplete()) {
                this.stopBackflip();
            }
        }
    }

    /**
     * Resets backflip state when character lands on ground.
     * Clears backflip readiness and stops active backflip animations.
     * Only triggers when character is grounded with downward or neutral velocity.
     * Ensures clean state transition from air to ground movement.
     * 
     * @public
     */
    resetBackflipOnLanding() {
        if (!this.character.isAboveGround() && this.character.speedY <= 0) {
            this.character.backflipReady = false;
            if (this.character.isBackflipping) {
                this.stopBackflip();
            }
        }
    }

    /**
     * Checks if backflip animation has completed a full 360-degree rotation.
     * Returns true when rotation reaches -360 degrees or beyond.
     * Used to determine when to stop backflip animation automatically.
     * 
     * @returns {boolean} True if backflip rotation is complete
     * @private
     */
    isBackflipComplete() {
        return this.character.rotation <= -360;
    }

    /**
     * Stops backflip animation and resets all rotation state.
     * Clears rotation angle, backflip flag, and rotation speed.
     * Returns character to normal upright orientation for standard movement.
     * 
     * @private
     */
    stopBackflip() {
        this.character.rotation = 0;
        this.character.isBackflipping = false;
        this.character.backflipSpeed = 0;
    }

    /**
     * Initiates backflip animation with upward velocity and rotation speed.
     * Provides additional upward momentum and sets rotation parameters.
     * Currently uses same rotation speed regardless of direction.
     * Sets backflipping flag to enable rotation updates.
     * 
     * @private
     */
    backflip() {
        this.character.speedY = 15;
        this.character.isBackflipping = true;
        this.character.backflipSpeed = this.character.otherDirection ? -9 : -9;
    }

    /**
     * Updates the timestamp for the last player input to track activity.
     * Monitors movement keys (LEFT, RIGHT, SPACE) and action key (D).
     * Used by animation system to determine idle duration for animation switching.
     * Called each frame to maintain accurate input timing.
     * 
     * @public
     */
    updateLastInputTime() {
        if (this.character.world.keyboard.RIGHT || this.character.world.keyboard.LEFT || this.character.world.keyboard.SPACE || this.character.world.keyboard.D) {
            this.character.lastInputTime = Date.now();
        }
    }
}