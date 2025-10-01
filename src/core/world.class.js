class World {
	character;
	level = level1;
	ctx;
	canvas;
	keyboard;
	cameraManager;
	collisionDetector;
	inputHandler;
	renderer;
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
		this.initializeManagers();
		this.setWorld();
		this.inputHandler.setupButtons();
		this.run();
	}

	initializeManagers() {
		this.cameraManager = new CameraManager(this.canvas);
		this.collisionDetector = new CollisionDetector(this);
		this.inputHandler = new InputHandler(this);
		this.renderer = new Renderer(this);
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

		const collisionId = setInterval(() => this.collisionDetector.checkAllCollisions(), 200);
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
			this.cameraManager.updateCamera(this.character, this.keyboard);
			if (this.frameCount % 3 === 0) {
				this.collisionDetector.checkAllCollisions();
				this.checkGameConditions();
				this.checkPlayerPosition();
			}
			this.frameCount++;
		}
		this.renderer.draw();
		requestAnimationFrame(() => this.gameLoop());
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