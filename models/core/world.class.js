class World {
    character = new Character();
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

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        
        // Disable image smoothing to prevent seams
        this.ctx.imageSmoothingEnabled = false;
        
        this.draw();
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
        setInterval(() => {
            this.checkCollisions();
            this.checkGameConditions();
            this.checkPlayerPosition();
        }, 200);
        setInterval(() => {
            this.updateCamera();
        }, 1000 / 60);
    }

    checkCollisions() {
        this.playerJumpsOnChicken();
        this.chickenHitsPlayer();
        this.characterCollectsBottle();
        this.characterCollectsCoin();
    }

    checkGameConditions() {
        let endboss = this.level.enemies.find(obj => obj instanceof Endboss)
        if (this.character.health <= 0 || endboss.health <= 0) {
            this.gameDone = true;
        }
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
        this.camera_x = this.camera_x + (targetCameraX - this.camera_x) * 0.1;
        this.camera_x = Math.round(this.camera_x);
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

        self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    createLevelObjects() {
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.thrownBottles);
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