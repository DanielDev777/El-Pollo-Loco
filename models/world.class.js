class World {
    character = new Character();
    level = level1;
    ctx;
    canvas;
    keyboard;
    healthBar = new HealthBar(40);
    enemyHealthBar = new HealthBar(800);
    coinBar = new CoinBar();
    hotSauceBar = new HotSauceBar();
    thrownBottles = [];
    
    // Manager instances
    collisionManager;
    cameraManager;
    inputManager;
    uiManager;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.initializeManagers();
        this.setWorld();
        this.draw();
        this.run();
    }

    initializeManagers() {
        this.collisionManager = new CollisionManager(this);
        this.cameraManager = new CameraManager(this);
        this.inputManager = new InputManager(this.keyboard);
        this.uiManager = new UIManager(this);
    }

    setWorld() {
        this.character.world = this;
    }

    run() {
        setInterval(() => {
            this.collisionManager.checkAllCollisions();
        }, 1000 / 60); // 60fps collision detection
        
        setInterval(() => {
            this.uiManager.updateEnemyHealthBarPosition();
        }, 200);
    }

    draw() {
        this.clearCanvas();

        this.cameraManager.translateForWorldObjects(this.ctx);
        this.renderWorldObjects();
        
        this.cameraManager.translateForUI(this.ctx);
        this.renderUIElements();

        requestAnimationFrame(() => {
            this.draw();
        });
    }

    renderWorldObjects() {
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.thrownBottles);
    }

    renderUIElements() {
        const uiElements = this.uiManager.getUIElements();
        uiElements.forEach(element => this.addToMap(element));
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