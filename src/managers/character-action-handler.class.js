class CharacterActionHandler {
    constructor(character) {
        this.character = character;
    }

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

    triggerSpecialMove() {
        if (this.character.world.coinBar.percentage === 100 && this.character.world.keyboard.F && !this.character.world.gameDone) {
            const moveX = this.character.otherDirection ? this.character.x - 420 : this.character.x + 80;
            this.character.specialMove = new SpecialMove(moveX, this.character.y + 100, this.character.otherDirection);
            this.character.world.specialMoves.push(this.character.specialMove);
            this.character.world.coinBar.setPercentage(0);
        }
    }

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

    stopDeathSound() {
        this.character.death_sound.pause();
        this.character.death_sound.currentTime = 0;
    }
}