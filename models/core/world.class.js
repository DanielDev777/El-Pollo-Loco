class World {
    character;
    level = level1;
    ctx;
    canvas;
    keyboard;
    camera_x = 0;
    healthBar = new HealthBar(40, 'character');
    enemyHealthBar = new HealthBar(800, 'enemy');
    coinBar = new CoinBar();
    hotSauceBar = new HotSauceBar();
    thrownBottles = [];
    gameDone = false;
    frameCount = 0;
    gameWonTriggered = false;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.character = new Character();
        this.character.resetCharacter();
        this.level = createLevel1();
        this.specialMoves = [];
        this.intervals = [];
        this.setWorld();
        this.run();
    }

    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach((enemy) => {
            enemy.world = this;
        });
        this.level.clouds.forEach(cloud => {
            cloud.world = this;
        })
    }

    run() {
        const gameLoopId = requestAnimationFrame(() => this.gameLoop());
        this.intervals.push({ type: 'raf', id: gameLoopId });
        
        const collisionId = setInterval(() => this.checkCollisions(), 200);
        this.intervals.push({ type: 'interval', id: collisionId });
    }

    stopAllIntervals() {
        this.intervals.forEach(interval => {
            if (interval.type === 'interval') {
                clearInterval(interval.id);
            } else if (interval.type === 'raf') {
                cancelAnimationFrame(interval.id);
            }
        });
        this.intervals = [];
        this.gameDone = true;
    }

    gameLoop() {
        if (!this.gameDone) {
            this.updateCamera();
            if (this.frameCount % 3 === 0) {
                this.checkCollisions();
                this.checkGameConditions();
                this.checkPlayerPosition();
                this.checkSpecialMoveCollisions();
            }
            this.frameCount++;
        }
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    checkCollisions() {
        this.playerJumpsOnChicken();
        this.chickenHitsPlayer();
        this.characterCollectsBottle();
        this.characterCollectsCoin();
    }

    checkGameConditions() {
        let endboss = this.level.enemies.find(obj => obj instanceof Endboss)
        if (this.character.health <= 0) {
            this.gameDone = true;
        }
        if (endboss && endboss.health <= 0 && !this.gameWonTriggered) {
            this.gameWonTriggered = true;
            this.gameDone = true;
            dispatchEvent(gameWonEvent);
        }
    }

    checkSpecialMoveCollisions() {
        this.specialMoves.forEach((specialMove) => {
            this.level.enemies.forEach((enemy) => {
                if (enemy.isColliding(specialMove) && enemy instanceof Endboss) {
                    enemy.health = 0;
                }
            });
        });
    }

    characterCollectsCoin() {
        this.level.coins.forEach(coin => {
            if (this.character.isColliding(coin)) {
                this.level.coins.splice(this.level.coins.indexOf(coin), 1);
                this.coinBar.setPercentage(this.coinBar.percentage + 25);
            }
        });
    }

    checkPlayerPosition() {
        let boss = this.level.enemies.find(obj => obj instanceof Endboss)
        if (this.character.x >= 2000 && this.enemyHealthBar.x !== 500){
            this.updateEnemyHealthBarPosition();
            boss.readyToFight = true;
        }
    }

    updateEnemyHealthBarPosition() {
        this.enemyHealthBar.x = 500;
    }

    updateCamera() {
        let targetCameraX;
        if ((this.keyboard.LEFT && this.character.x > 0) || this.character.otherDirection) {
            const cameraOffset = this.canvas.width / 2;
            targetCameraX = -this.character.x + cameraOffset;
        } else {
            targetCameraX = -this.character.x + 100;
        }
        const leftBoundary = 0;
        const rightBoundary = -(2800 - this.canvas.width); // Extended boundary for boss area
        targetCameraX = Math.max(rightBoundary, Math.min(leftBoundary, targetCameraX));
        this.camera_x = Math.round(targetCameraX);
    }

    playerJumpsOnChicken() {
        this.level.enemies.forEach((enemy) => {
            if (this.checkPlayerJumpOnChicken(enemy)) {
                enemy.health = 0;
            }
        });
    }

    checkPlayerJumpOnChicken(enemy) {
        return this.character.isColliding(enemy) && enemy instanceof Chicken && this.character.isAboveGround() && this.character.speedY < 0;
    }

    chickenHitsPlayer() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy) && !enemy.isDead()) {
                if (!(enemy instanceof Chicken && this.character.speedY > 0)) {
                    this.character.hit(5);
                    this.healthBar.setPercentage(this.character.health);
                }
            }
        });
    }

    characterCollectsBottle() {
        this.level.bottles.forEach(bottle => {
            if (this.character.isColliding(bottle)) {
                this.level.bottles.splice(this.level.bottles.indexOf(bottle), 1);
                this.hotSauceBar.setPercentage(this.hotSauceBar.percentage + 25);
            }
        });
    }

    draw() {
        this.clearCanvas();
        this.ctx.translate(this.camera_x, 0);
        this.createLevelObjects();
        this.ctx.translate(-this.camera_x, 0);
        this.createStatusBars();
    }

    createLevelObjects() {
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.thrownBottles);
        this.addObjectsToMap(this.specialMoves);
        this.removeExpiredSpecialMoves();
    }

    createStatusBars() {
        this.addToMap(this.healthBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.hotSauceBar);
        this.addToMap(this.enemyHealthBar);
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        })
    }

    addToMap(mo) {
        if (mo.rotation && mo.rotation !== 0) {
            this.rotateImage(mo);
        } else if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);

        mo.drawFrame(this.ctx);

        if (mo.rotation && mo.rotation !== 0) {
            this.rotateImageBack(mo);
        } else if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    removeExpiredSpecialMoves() {
        this.specialMoves = this.specialMoves.filter(move => !move.isExpired());
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    rotateImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.x + mo.width / 2, mo.y + mo.height / 2);
        
        if (mo.otherDirection && mo.isBackflipping) {
            this.ctx.scale(-1, 1);
        }
        
        this.ctx.rotate((mo.rotation * Math.PI) / 180);
        mo._originalX = mo.x;
        mo._originalY = mo.y;
        mo.x = -mo.width / 2;
        mo.y = -mo.height / 2;
    }

    rotateImageBack(mo) {
        mo.x = mo._originalX;
        mo.y = mo._originalY;
        this.ctx.restore();
    }
}