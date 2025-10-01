/**
 * Manages character action inputs including throwing bottles and special moves.
 * Handles resource consumption and cooldown management for special abilities.
 * Coordinates between input state and action execution with proper validation.
 * 
 * @class CharacterActionHandler
 * @example
 * const actionHandler = new CharacterActionHandler(character);
 * // In character's update method:
 * actionHandler.throwBottle();
 * actionHandler.triggerSpecialMove();
 */
class CharacterActionHandler {
    /**
     * Creates a new character action handler.
     * 
     * @param {Character} character - The character to handle actions for
     */
    constructor(character) {
        this.character = character;
    }

    /**
     * Handles bottle throwing mechanics with resource consumption and positioning.
     * Validates sufficient hot sauce ammunition (25%) before allowing throw.
     * Creates bottle projectile with direction-based positioning and velocity.
     * Uses key press detection to prevent continuous throwing while holding key.
     * 
     * @public
     */
    throwBottle() {
        if (this.character.world && this.character.world.keyboard && this.character.world.hotSauceBar.percentage >= 25 && !this.character.world.gameDone) {
            let currentDPressed = this.character.world.keyboard.D;
            if (currentDPressed && !this.character.lastDState) {
                let thrownBottle = new Bottle(this.character.x + 100);
                if (this.character.otherDirection == false) {
                    thrownBottle.throw(this.character.x + 100, this.character.actualY + 40, this.character.world, "right");
                } else {
                    thrownBottle.throw(this.character.x - 100, this.character.actualY + 40, this.character.world, "left");
                }
                this.character.world.thrownBottles.push(thrownBottle);
                this.character.world.hotSauceBar.setPercentage(
                    this.character.world.hotSauceBar.percentage - 25
                );
            }
        }
    }

    /**
     * Executes the character's ultimate special move attack when conditions are met.
     * Requires 100% coin collection progress to activate (full resource cost).
     * Creates directional beam attack positioned relative to character orientation.
     * Resets coin bar to 0% after successful activation.
     * 
     * @public
     */
    triggerSpecialMove() {
        if (this.character.world.coinBar.percentage === 100 && this.character.world.keyboard.F && !this.character.world.gameDone) {
            const moveX = this.character.otherDirection ? this.character.x - 420 : this.character.x + 80;
            this.character.specialMove = new SpecialMove(moveX, this.character.y + 100, this.character.otherDirection);
            this.character.world.specialMoves.push(this.character.specialMove);
            this.character.world.coinBar.setPercentage(0);
        }
    }

    /**
     * Completely resets the character to initial game state.
     * Restores position, health, animation states, and physics properties.
     * Clears death animation flags and stops all associated audio.
     * Used for game restart functionality and initial setup.
     * 
     * @public
     */
    resetCharacter() {
        this.character.x = 120;
        this.character.y = 135;
        this.character.health = 100;
        this.character.animationManager.deathAnimationComplete = false;
        this.character.animationManager.deathAnimationCounter = 0;
        this.character.rotation = 0;
        this.character.isBackflipping = false;
        this.character.speedY = 0;
        this.character.lastInputTime = Date.now();
        this.stopDeathSound();
        this.character.animationManager.resetAnimations();
    }

    /**
     * Stops and resets the character death sound effect.
     * Pauses audio playback and resets position to beginning for next use.
     * Ensures clean audio state transitions during character resets.
     * 
     * @private
     */
    stopDeathSound() {
        this.character.death_sound.pause();
        this.character.death_sound.currentTime = 0;
    }
}