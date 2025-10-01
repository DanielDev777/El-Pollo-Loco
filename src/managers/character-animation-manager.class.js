/**
 * Manages all character animation states and transitions.
 * Handles different animation sequences including idle, walking, jumping, hurt, and death.
 * Coordinates timing and frame management for smooth character animations.
 * 
 * @class CharacterAnimationManager
 * @example
 * const animationManager = new CharacterAnimationManager(character);
 * // In character's animate method:
 * animationManager.handleAnimations();
 */
class CharacterAnimationManager {
    /** @type {boolean} Flag to track if jump animation has been played */
    jumpAnimationPlayed = false;
    
    /** @type {number} Current frame index for jump animation */
    jumpAnimationIndex = 0;
    
    /** @type {number} Frame counter for jump animation timing */
    jumpAnimationFrameCounter = 0;
    
    /** @type {boolean} Flag indicating if death animation is complete */
    deathAnimationComplete = false;
    
    /** @type {number} Counter for death animation timing */
    deathAnimationCounter = 0;
    
    /** @type {number} Counter for idle animation timing */
    idleAnimationCounter = 0;
    
    /** @type {number} Current frame index for idle animation */
    idleAnimationIndex = 0;

    /**
     * Creates a new character animation manager.
     * 
     * @param {Character} character - The character to manage animations for
     */
    constructor(character) {
        this.character = character;
    }

    /**
     * Main animation handler that determines and plays the appropriate animation.
     * Prioritizes animations in order: death, hurt, jump, walk, idle.
     * Called every animation frame to maintain smooth character animation.
     */
    handleAnimations() {
        if (this.character.isDead()) {
            this.playSlowDeathAnimation();
        } else if (this.character.isHurt()) {
            this.character.playAnimation(this.character.IMAGES_HURTING);
        } else if (this.character.isAboveGround()) {
            this.playJumpAnimation();
        } else if ((this.character.world.keyboard.RIGHT || this.character.world.keyboard.LEFT) && this.character.world.gameDone === false) {
            this.character.playAnimation(this.character.IMAGES_WALKING);
        } else {
            this.playIdleAnimation();
        }
    }

    /**
     * Manages jump animation with frame-by-frame control and one-time playback.
     * Plays through jump sequence once per jump, then locks to final frame.
     * Uses frame counter for animation timing and prevents animation restart.
     * Resets when character touches ground via movement controller.
     * 
     * @private
     */
    playJumpAnimation() {
        if (!this.jumpAnimationPlayed) {
            this.jumpAnimationFrameCounter++;
            if (this.jumpAnimationFrameCounter >= 2) {
                this.jumpAnimationFrameCounter = 0;
                if (this.jumpAnimationIndex < this.character.IMAGES_JUMPING.length - 1) {
                    this.jumpAnimationIndex++;
                } else {
                    this.jumpAnimationPlayed = true;
                }
            }
            let path = this.character.IMAGES_JUMPING[this.jumpAnimationIndex];
            this.character.img = this.character.imageCache[path];
        } else {
            let path = this.character.IMAGES_JUMPING[this.character.IMAGES_JUMPING.length - 1];
            this.character.img = this.character.imageCache[path];
        }
    }

    /**
     * Handles idle animation with different states based on inactivity duration.
     * Switches between normal idle and long idle animations after 5 seconds.
     * Resets animation counters when character becomes active again.
     * Creates engaging idle behavior to maintain visual interest.
     * 
     * @private
     */
    playIdleAnimation() {
        if (this.shouldPlayIdleAnimation()) {
            const images = this.getIdleImages();
            this.advanceIdleAnimation(images);
            const path = images[this.idleAnimationIndex];
            this.character.img = this.character.imageCache[path];
        } else {
            this.resetIdleAnimationCounters();
        }
    }

    /**
     * Determines if idle animation should be played based on character state.
     * Checks that character is grounded and no movement inputs are active.
     * Returns true only when character is completely stationary.
     * 
     * @returns {boolean} True if idle animation should play
     * @private
     */
    shouldPlayIdleAnimation() {
        return (!this.character.isAboveGround() && !this.character.world.keyboard.RIGHT && !this.character.world.keyboard.LEFT && !this.character.world.keyboard.SPACE);
    }

    /**
     * Selects appropriate idle animation sequence based on inactivity duration.
     * Uses normal idle for short pauses, switches to long idle after 5 seconds.
     * Creates dynamic idle behavior that responds to player engagement.
     * 
     * @returns {string[]} Array of idle animation image paths
     * @private
     */
    getIdleImages() {
        const idleDuration = Date.now() - this.character.lastInputTime;
        return idleDuration >= 5000 ? this.character.IMAGES_LONG_IDLE : this.character.IMAGES_IDLE;
    }

    /**
     * Resets idle animation state when character becomes active.
     * Clears animation counters and frame indices for clean restart.
     * Ensures idle animation starts from beginning on next idle period.
     * 
     * @private
     */
    resetIdleAnimationCounters() {
        this.idleAnimationCounter = 0;
        this.idleAnimationIndex = 0;
    }

    /**
     * Advances idle animation frame progression with timing control.
     * Uses frame counter to control animation speed (advances every 8 frames).
     * Cycles through animation frames with automatic looping.
     * 
     * @param {string[]} images - Array of animation frame paths to cycle through
     * @private
     */
    advanceIdleAnimation(images) {
        this.idleAnimationCounter++;
        if (this.idleAnimationCounter >= 8) {
            this.idleAnimationCounter = 0;
            this.idleAnimationIndex = (this.idleAnimationIndex + 1) % images.length;
        }
        if (this.idleAnimationIndex >= images.length) {
            this.idleAnimationIndex = 0;
        }
    }

    /**
     * Executes slow-paced death animation for dramatic effect.
     * Uses slower frame timing (every 4 frames) for dramatic impact.
     * Progresses through death sequence once, then triggers game over.
     * Returns early if animation already complete to prevent restart.
     * 
     * @private
     */
    playSlowDeathAnimation() {
        if (this.deathAnimationComplete) return;
        if (this.deathAnimationCounter % 4 === 0) {
            const index = Math.floor(this.deathAnimationCounter / 4);
            if (index < this.character.IMAGES_DEAD.length) {
                this.character.img = this.character.imageCache[this.character.IMAGES_DEAD[index]];
            } else {
                this.completeDeathAnimation();
            }
        }
        this.deathAnimationCounter++;
    }

    /**
     * Finalizes death animation and triggers game over state.
     * Sets final death frame and marks animation complete to prevent loops.
     * Triggers game over event for UI transition and ends game loop.
     * Uses completion flag to ensure single execution.
     * 
     * @private
     */
    completeDeathAnimation() {
        if (!this.deathAnimationComplete) {
            this.deathAnimationComplete = true;
            this.character.img = this.character.imageCache[this.character.IMAGES_DEAD[this.character.IMAGES_DEAD.length - 1]];
            this.character.world.gameDone = true;
            dispatchEvent(gameOverEvent);
        }
    }

    /**
     * Resets all animation states to initial values for clean restart.
     * Clears jump, death, and idle animation progress and flags.
     * Used during character reset for game restart functionality.
     * Ensures all animations start fresh without residual state.
     * 
     * @public
     */
    resetAnimations() {
        this.jumpAnimationPlayed = false;
        this.jumpAnimationIndex = 0;
        this.jumpAnimationFrameCounter = 0;
        this.deathAnimationComplete = false;
        this.deathAnimationCounter = 0;
        this.idleAnimationCounter = 0;
        this.idleAnimationIndex = 0;
    }
}