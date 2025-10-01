class Renderer {
    constructor(world) {
        this.world = world;
    }

    draw() {
        this.clearCanvas();
        this.world.ctx.translate(this.world.cameraManager.camera_x, 0);
        this.createLevelObjects();
        this.world.ctx.translate(-this.world.cameraManager.camera_x, 0);
        this.createUI();
    }

    clearCanvas() {
        this.world.ctx.clearRect(0, 0, this.world.canvas.width, this.world.canvas.height);
    }

    createLevelObjects() {
        this.addObjectsToMap(this.world.level.backgroundObjects);
        this.addObjectsToMap(this.world.level.clouds);
        this.addToMap(this.world.character);
        this.addObjectsToMap(this.world.level.enemies);
        this.addObjectsToMap(this.world.level.bottles);
        this.addObjectsToMap(this.world.level.coins);
        this.addObjectsToMap(this.world.thrownBottles);
        this.addObjectsToMap(this.world.specialMoves);
        this.removeExpiredSpecialMoves();
    }

    createUI() {
        this.addToMap(this.world.healthBar);
        this.addToMap(this.world.coinBar);
        this.addToMap(this.world.hotSauceBar);
        this.addToMap(this.world.enemyHealthBar);
        this.addToMap(this.world.muteButton);
        if (!this.world.fullScreenButton.isMobileDevice()) {
            this.addToMap(this.world.fullScreenButton);
        }
    }

    addObjectsToMap(objects) {
        objects.forEach((o) => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        if (mo.rotation && mo.rotation !== 0) {
            this.rotateImage(mo);
        } else if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.world.ctx);

        mo.drawFrame(this.world.ctx);

        if (mo.rotation && mo.rotation !== 0) {
            this.rotateImageBack(mo);
        } else if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    removeExpiredSpecialMoves() {
        this.world.specialMoves = this.world.specialMoves.filter((move) => !move.isExpired());
    }

    flipImage(mo) {
        this.world.ctx.save();
        this.world.ctx.translate(mo.width, 0);
        this.world.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.world.ctx.restore();
    }

    rotateImage(mo) {
        this.world.ctx.save();
        this.world.ctx.translate(mo.x + mo.width / 2, mo.y + mo.height / 2);

        if (mo.otherDirection && mo.isBackflipping) {
            this.world.ctx.scale(-1, 1);
        }

        this.world.ctx.rotate((mo.rotation * Math.PI) / 180);
        mo._originalX = mo.x;
        mo._originalY = mo.y;
        mo.x = -mo.width / 2;
        mo.y = -mo.height / 2;
    }

    rotateImageBack(mo) {
        mo.x = mo._originalX;
        mo.y = mo._originalY;
        this.world.ctx.restore();
    }
}