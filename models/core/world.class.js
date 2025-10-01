class World {
	character;
	level = level1;
	ctx;
	canvas;
	keyboard;
	camera_x = 0;
	camera_mode = 'right'; // 'left' or 'right'
	camera_transitioning = false;
	camera_transition_progress = 0;
	camera_start_x = 0;
	camera_end_x = 0;
	camera_transition_speed = 0.25;
	healthBar = new HealthBar(40, "character");
	enemyHealthBar = new HealthBar(800, "enemy");
	coinBar = new CoinBar();
	hotSauceBar = new HotSauceBar();
	muteButton;
	fullScreenButton;
	thrownBottles = [];
	gameDone = false;
	frameCount = 0;
	gameWonTriggered = false;
	squash_sound = new Audio("audio/squash.mp3");
	lastBossHitTime = 0;

	constructor(canvas, keyboard) {
		this.ctx = canvas.getContext("2d");
		this.canvas = canvas;
		this.keyboard = keyboard;
		this.character = new Character();
		this.character.resetCharacter();
		this.stopAllGameSounds();
		this.level = createLevel1();
		this.specialMoves = [];
		this.intervals = [];
		this.squash_sound.volume = 0.1;
		this.muteButton = new MuteButton();
		this.fullScreenButton = new FullScreenButton(canvas);
		this.fullScreenButton.setMuteButtonReference(this.muteButton);
		this.setWorld();
		this.setupButtons();
		this.run();
	}

	setWorld() {
		this.character.world = this;
		this.level.enemies.forEach((enemy) => {
			enemy.world = this;
		});
		this.level.clouds.forEach((cloud) => {
			cloud.world = this;
		});
	}

	run() {
		const gameLoopId = requestAnimationFrame(() => this.gameLoop());
		this.intervals.push({ type: "raf", id: gameLoopId });

		const collisionId = setInterval(() => this.checkCollisions(), 200);
		this.intervals.push({ type: "interval", id: collisionId });
	}

	stopAllIntervals() {
		this.intervals.forEach((interval) => {
			if (interval.type === "interval") {
				clearInterval(interval.id);
			} else if (interval.type === "raf") {
				cancelAnimationFrame(interval.id);
			}
		});
		this.intervals = [];
		this.gameDone = true;
		this.stopAllGameSounds();
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
		this.chickenHitsPlayerDetection();
		this.characterCollectsBottle();
		this.characterCollectsCoin();
	}

    setupButtons() {
        this.setupCanvasClickHandler();
    }

    setupCanvasClickHandler() {
        this.canvas.addEventListener('click', (event) => {
            const { mouseX, mouseY } = this.getMouseCoordinates(event);
            this.handleButtonClicks(mouseX, mouseY);
        });
    }

    getMouseCoordinates(event) {
        const rect = this.canvas.getBoundingClientRect();
        let mouseX = event.clientX - rect.left;
        let mouseY = event.clientY - rect.top;

        if (this.fullScreenButton.getFullscreenState()) {
            return this.transformFullscreenCoordinates(mouseX, mouseY, rect);
        }

        return { mouseX, mouseY };
    }

    transformFullscreenCoordinates(mouseX, mouseY, rect) {
        const canvasAspectRatio = 720 / 480;
        const screenAspectRatio = rect.width / rect.height;
        
        if (screenAspectRatio > canvasAspectRatio) {
            return this.transformWideScreenCoordinates(mouseX, mouseY, rect, canvasAspectRatio);
        } else {
            return this.transformTallScreenCoordinates(mouseX, mouseY, rect, canvasAspectRatio);
        }
    }

    transformWideScreenCoordinates(mouseX, mouseY, rect, canvasAspectRatio) {
        const scaledWidth = rect.height * canvasAspectRatio;
        const offsetX = (rect.width - scaledWidth) / 2;
        
        mouseX = (mouseX - offsetX) * (720 / scaledWidth);
        mouseY = mouseY * (480 / rect.height);
        
        return { mouseX, mouseY };
    }

    transformTallScreenCoordinates(mouseX, mouseY, rect, canvasAspectRatio) {
        const scaledHeight = rect.width / canvasAspectRatio;
        const offsetY = (rect.height - scaledHeight) / 2;
        
        mouseX = mouseX * (720 / rect.width);
        mouseY = (mouseY - offsetY) * (480 / scaledHeight);
        
        return { mouseX, mouseY };
    }

    handleButtonClicks(mouseX, mouseY) {
        this.handleMuteButtonClick(mouseX, mouseY);
        this.handleFullscreenButtonClick(mouseX, mouseY);
    }

    handleMuteButtonClick(mouseX, mouseY) {
        if (this.muteButton.isClicked && this.muteButton.isClicked(mouseX, mouseY)) {
            this.muteButton.toggle();
        }
    }

    handleFullscreenButtonClick(mouseX, mouseY) {
        let adjustedMouseX = mouseX;
        
        if (this.fullScreenButton.getFullscreenState()) {
            adjustedMouseX = mouseX + 70;
        }

        if (this.fullScreenButton.isClicked && this.fullScreenButton.isClicked(adjustedMouseX, mouseY)) {
            this.fullScreenButton.toggle();
        }
    }

	checkGameConditions() {
		let endboss = this.level.enemies.find((obj) => obj instanceof Endboss);
		if (this.character.health <= 0) {
			if (!this.muteButton.getMuteState()) {
				this.character.death_sound.play();
			}
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
					if (!this.muteButton.getMuteState()) {
						enemy.big_hit_sound.play();
					}
				}
			});
		});
	}

	characterCollectsCoin() {
		this.level.coins.forEach((coin) => {
			if (this.character.isColliding(coin)) {
				this.level.coins.splice(this.level.coins.indexOf(coin), 1);
				this.coinBar.setPercentage(this.coinBar.percentage + 25);
			}
		});
	}

	checkPlayerPosition() {
		let boss = this.level.enemies.find((obj) => obj instanceof Endboss);
		if (this.character.x >= 1900 && this.enemyHealthBar.x !== 500) {
			this.updateEnemyHealthBarPosition();
			boss.readyToFight = true;
		}
	}

	updateEnemyHealthBarPosition() {
		this.enemyHealthBar.x = 500;
	}

		updateCamera() {
		const currentMode = this.getCameraMode();
		
		if (this.camera_transitioning) {
			this.handleCameraTransition();
		} else if (this.camera_mode !== currentMode) {
			this.startCameraTransition(currentMode);
		} else {
			this.updateCameraNormal();
		}
	}

	getCameraMode() {
		return ((this.keyboard.LEFT && this.character.x > 0) || this.character.otherDirection) ? 'left' : 'right';
	}

	startCameraTransition(newMode) {
		this.camera_start_x = this.camera_x;
		this.camera_mode = newMode;
		this.camera_transitioning = true;
		this.camera_transition_progress = 0;
		
		let targetCameraX = this.calculateTargetPosition(newMode);
		const leftBoundary = 0;
		const rightBoundary = -(2800 - this.canvas.width);
		this.camera_end_x = Math.max(rightBoundary, Math.min(leftBoundary, targetCameraX));
	}

	handleCameraTransition() {
		// Recalculate target in case character moved during transition
		let currentTarget = this.calculateTargetPosition(this.camera_mode);
		const leftBoundary = 0;
		const rightBoundary = -(2800 - this.canvas.width);
		currentTarget = Math.max(rightBoundary, Math.min(leftBoundary, currentTarget));
		
		const distance = currentTarget - this.camera_x;
		const moveSpeed = 6; // Slightly slower for smoother feel
		
		if (Math.abs(distance) <= moveSpeed) {
			// Close enough, snap to target and end transition
			this.camera_x = currentTarget;
			this.camera_transitioning = false;
		} else {
			// Move at constant speed towards current target
			this.camera_x += distance > 0 ? moveSpeed : -moveSpeed;
		}
		
		this.camera_x = Math.round(this.camera_x);
	}

		updateCameraNormal() {
		let targetCameraX = this.calculateTargetPosition(this.camera_mode);
		const leftBoundary = 0;
		const rightBoundary = -(2800 - this.canvas.width);
		targetCameraX = Math.max(rightBoundary, Math.min(leftBoundary, targetCameraX));
		this.camera_x = Math.round(targetCameraX);
	}

	calculateTargetPosition(mode) {
		if (mode === 'left') {
			const cameraOffset = this.canvas.width / 2;
			return -this.character.x + cameraOffset;
		} else {
			return -this.character.x + 100;
		}
	}

	easeInOut(t) {
		return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
	}

	playerJumpsOnChicken() {
		this.level.enemies.forEach((enemy) => {
			if (this.checkPlayerJumpOnChicken(enemy)) {
				if (!this.muteButton.getMuteState() && !enemy.isDead()) {
					this.squash_sound.play();
				}
				enemy.health = 0;
			}
		});
	}

	checkPlayerJumpOnChicken(enemy) {
		return (
			this.character.isColliding(enemy) &&
			enemy instanceof Chicken &&
			this.character.isAboveGround() &&
			this.character.speedY < 0
		);
	}

	chickenHitsPlayerDetection() {
		this.level.enemies.forEach((enemy) => {
			if (this.character.isColliding(enemy) && !enemy.isDead()) {
				if (
					!(enemy instanceof Chicken && this.character.speedY > 0) &&
					!this.character.isDead()
				) {
					this.characterGetsHit(enemy);
				}
			}
		});
	}

	characterGetsHit(enemy) {
		if (enemy instanceof Chicken && !this.gameDone) {
			this.characterGetsHitByChicken();
		} else if (enemy instanceof Endboss) {
			this.characterGetsHitByBoss();
		}
		this.healthBar.setPercentage(this.character.health);
	}

	characterGetsHitByChicken() {
		if (!this.muteButton.getMuteState()) {
			this.character.normal_ouch.play();
		}
		this.character.hit(5);
	}

	characterGetsHitByBoss() {
		const currentTime = Date.now();
		const bossCooldown = 2000;
		if (currentTime - this.lastBossHitTime >= bossCooldown) {
			if (!this.muteButton.getMuteState()) {
				this.character.big_ouch.play();
			}
			this.character.hit(30);
			this.lastBossHitTime = currentTime;
		}
	}

	characterCollectsBottle() {
		this.level.bottles.forEach((bottle) => {
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
		this.createUI();
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

	createUI() {
		this.addToMap(this.healthBar);
		this.addToMap(this.coinBar);
		this.addToMap(this.hotSauceBar);
		this.addToMap(this.enemyHealthBar);
		this.addToMap(this.muteButton);
		if (!this.fullScreenButton.isMobileDevice()) {
			this.addToMap(this.fullScreenButton);
		}
	}

	clearCanvas() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
		mo.draw(this.ctx);

		mo.drawFrame(this.ctx);

		if (mo.rotation && mo.rotation !== 0) {
			this.rotateImageBack(mo);
		} else if (mo.otherDirection) {
			this.flipImageBack(mo);
		}
	}

	removeExpiredSpecialMoves() {
		this.specialMoves = this.specialMoves.filter((move) => !move.isExpired());
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

	stopAllGameSounds() {
		if (this.character?.death_sound) {
			this.character.death_sound.pause();
			this.character.death_sound.currentTime = 0;
		}
		if (this.character?.walking_sound) {
			this.character.walking_sound.pause();
			this.character.walking_sound.currentTime = 0;
		}
		if (this.character?.normal_ouch) {
			this.character.normal_ouch.pause();
			this.character.normal_ouch.currentTime = 0;
		}
		if (this.character?.big_ouch) {
			this.character.big_ouch.pause();
			this.character.big_ouch.currentTime = 0;
		}
	}
}
