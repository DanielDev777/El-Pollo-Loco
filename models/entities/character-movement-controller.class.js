class CharacterMovementController {
    constructor(character) {
        this.character = character;
    }

    handleMovement() {
        this.handleRight();
        this.handleLeft();
    }

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

    checkBackflipReady() {
        if (this.character.isAboveGround()) {
            if (this.character.world.keyboard.SPACE && !this.character.lastSpaceState && this.character.backflipReady) {
                this.character.backflip();
                this.character.backflipReady = false;
            }
        }
    }

    updateBackflip() {
        if (this.character.isBackflipping) {
            this.character.rotation += this.character.backflipSpeed;
            if (this.isBackflipComplete()) {
                this.stopBackflip();
            }
        }
    }

    resetBackflipOnLanding() {
        if (!this.character.isAboveGround() && this.character.speedY <= 0) {
            this.character.backflipReady = false;
            if (this.character.isBackflipping) {
                this.stopBackflip();
            }
        }
    }

    isBackflipComplete() {
        return this.character.rotation <= -360;
    }

    stopBackflip() {
        this.character.rotation = 0;
        this.character.isBackflipping = false;
        this.character.backflipSpeed = 0;
    }

    backflip() {
        this.character.speedY = 15;
        this.character.isBackflipping = true;
        this.character.backflipSpeed = this.character.otherDirection ? -9 : -9;
    }

    updateLastInputTime() {
        if (this.character.world.keyboard.RIGHT || this.character.world.keyboard.LEFT || this.character.world.keyboard.SPACE || this.character.world.keyboard.D) {
            this.character.lastInputTime = Date.now();
        }
    }
}