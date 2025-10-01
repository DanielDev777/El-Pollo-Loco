class CharacterAnimationManager {
    jumpAnimationPlayed = false;
    jumpAnimationIndex = 0;
    jumpAnimationFrameCounter = 0;
    deathAnimationComplete = false;
    deathAnimationCounter = 0;
    idleAnimationCounter = 0;
    idleAnimationIndex = 0;

    constructor(character) {
        this.character = character;
    }

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

    shouldPlayIdleAnimation() {
        return (!this.character.isAboveGround() && !this.character.world.keyboard.RIGHT && !this.character.world.keyboard.LEFT && !this.character.world.keyboard.SPACE);
    }

    getIdleImages() {
        const idleDuration = Date.now() - this.character.lastInputTime;
        return idleDuration >= 5000 ? this.character.IMAGES_LONG_IDLE : this.character.IMAGES_IDLE;
    }

    resetIdleAnimationCounters() {
        this.idleAnimationCounter = 0;
        this.idleAnimationIndex = 0;
    }

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

    completeDeathAnimation() {
        if (!this.deathAnimationComplete) {
            this.deathAnimationComplete = true;
            this.character.img = this.character.imageCache[this.character.IMAGES_DEAD[this.character.IMAGES_DEAD.length - 1]];
            this.character.world.gameDone = true;
            dispatchEvent(gameOverEvent);
        }
    }

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