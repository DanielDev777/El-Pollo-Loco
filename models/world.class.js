class World {
    character = new Character();
    level = level1;
    ctx;
    canvas;
    keyboard;
    camera_x = 0;
    healthBar = new HealthBar(40);
    enemyHealthBar = new HealthBar(800);
    coinBar = new CoinBar();
    hotSauceBar = new HotSauceBar();
    thrownBottles = [];
    gameDone = false;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach((enemy) => {
            if (enemy.world !== undefined) {
                enemy.world = this;
            }
        });
    }

    run() {
        setInterval(() => {
            this.checkCollisions();
            this.updateEnemyHealthBarPosition();
        }, 200);
    }

    checkCollisions() {
        this.playerJumpsOnChicken();
        this.chickenHitsPlayer();
        this.characterCollectsBottle();
    }

    updateEnemyHealthBarPosition() {
        if (this.character.x >= 1900 && this.enemyHealthBar.x !== 500) {
            this.enemyHealthBar.x = 500;
        }
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