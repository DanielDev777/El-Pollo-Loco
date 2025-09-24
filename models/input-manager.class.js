class InputManager {
    constructor(keyboard) {
        this.keyboard = keyboard;
        this.previousStates = {
            SPACE: false,
            D: false
        };
    }

    updateInputStates() {
        this.previousStates.SPACE = this.keyboard.SPACE;
        this.previousStates.D = this.keyboard.D;
    }

    isNewKeyPress(key) {
        return this.keyboard[key] && !this.previousStates[key];
    }

    isKeyPressed(key) {
        return this.keyboard[key];
    }

    canMoveRight(character, levelEndX) {
        return this.keyboard.RIGHT && character.x < levelEndX;
    }

    canMoveLeft(character) {
        return this.keyboard.LEFT && character.x > 0;
    }
}