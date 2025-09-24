class UIManager {
    constructor(world) {
        this.world = world;
    }

    updateEnemyHealthBarPosition() {
        if (this.world.character.x >= 1900 && this.world.enemyHealthBar.x !== 500) {
            this.world.enemyHealthBar.x = 500;
        }
    }

    getUIElements() {
        return [
            this.world.healthBar,
            this.world.coinBar,
            this.world.hotSauceBar,
            this.world.enemyHealthBar
        ];
    }
}