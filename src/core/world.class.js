/**
 * Main game world class that orchestrates all game systems and objects.
 * Manages the game loop, handles object interactions, and coordinates between
 * different managers for rendering, collision detection, input handling, and camera movement.
 * 
 * @class World
 * @example
 * const canvas = document.getElementById('gameCanvas');
 * const keyboard = new Keyboard();
 * const world = new World(canvas, keyboard);
 */
class World {
	/** @type {Character} The main player character */
	character;
	
	/** @type {Level} Current level containing all game objects */
	level = level1;
	
	/** @type {CanvasRenderingContext2D} 2D rendering context for the canvas */
	ctx;
	
	/** @type {HTMLCanvasElement} Main game canvas element */
	canvas;
	
	/** @type {Keyboard} Input state manager for keyboard controls */
	keyboard;
	
	/** @type {CameraManager} Handles camera positioning and smooth transitions */
	cameraManager;
	
	/** @type {CollisionDetector} Manages all collision detection logic */
	collisionDetector;
	
	/** @type {InputHandler} Processes player input and controls */
	inputHandler;
	
	/** @type {Renderer} Handles all rendering operations */
	renderer;
	
	/** @type {HealthBar} Character health display UI */
	healthBar = new HealthBar(40, "character");
	
	/** @type {HealthBar} Enemy/boss health display UI */
	enemyHealthBar = new HealthBar(800, "enemy");
	
	/** @type {CoinBar} Coin collection progress UI */
	coinBar = new CoinBar();
	
	/** @type {HotSauceBar} Hot sauce ammunition UI */
	hotSauceBar = new HotSauceBar();
	
	/** @type {MuteButton} Audio control button */
	muteButton;
	
	/** @type {FullScreenButton} Fullscreen toggle button */
	fullScreenButton;
	
	/** @type {Bottle[]} Array of bottles thrown by the player */
	thrownBottles = [];
	
	/** @type {boolean} Flag indicating if the game has ended */
	gameDone = false;
	
	/** @type {number} Current frame counter for animations and timing */
	frameCount = 0;
	
	/** @type {boolean} Flag to prevent multiple game won events */
	gameWonTriggered = false;
	
	/** @type {Audio} Sound effect for enemy squashing */
	squash_sound = new Audio("audio/squash.mp3");
	
	/** @type {number} Timestamp of the last boss hit for timing mechanics */
	lastBossHitTime = 0;

	/**
	 * Creates a new game world instance.
	 * Initializes all game systems, managers, UI elements, and starts the game loop.
	 * 
	 * @param {HTMLCanvasElement} canvas - The canvas element for rendering
	 * @param {Keyboard} keyboard - The keyboard input manager instance
	 * @example
	 * const world = new World(canvasElement, keyboardInstance);
	 */
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

	/**
	 * Initializes all manager subsystems for the game world.
	 * Creates instances of camera, collision, input, and rendering managers.
	 * Each manager handles a specific aspect of the game logic.
	 * 
	 * @private
	 */
	initializeManagers() {
		this.cameraManager = new CameraManager(this.canvas);
		this.collisionDetector = new CollisionDetector(this);
		this.inputHandler = new InputHandler(this);
		this.renderer = new Renderer(this);
	}

	/**
	 * Sets the world reference for all game objects that need access to the world instance.
	 * This allows characters, enemies, and clouds to interact with the world system.
	 * 
	 * @private
	 */
	setWorld() {
		this.character.world = this;
		this.level.enemies.forEach((enemy) => {
			enemy.world = this;
		});
		this.level.clouds.forEach((cloud) => {
			cloud.world = this;
		});
	}

	/**
	 * Starts the main game loop and collision detection system.
	 * Creates both animation frame loops for smooth rendering and interval-based collision checks.
	 * All intervals are tracked for proper cleanup when the game ends.
	 * 
	 * @private
	 */
	run() {
		const gameLoopId = requestAnimationFrame(() => this.gameLoop());
		this.intervals.push({ type: "raf", id: gameLoopId });

		const collisionId = setInterval(() => this.collisionDetector.checkAllCollisions(), 200);
		this.intervals.push({ type: "interval", id: collisionId });
	}

	/**
	 * Stops all game intervals and animation frames, effectively ending the game.
	 * Cleans up both setInterval and requestAnimationFrame callbacks to prevent memory leaks.
	 * Also stops all game sounds and sets the game done flag.
	 * 
	 * @public
	 */
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

	/**
	 * Main game loop that runs every frame via requestAnimationFrame.
	 * Updates camera position, performs collision checks every 3 frames for optimization,
	 * checks game win/lose conditions, and renders all game objects.
	 * Continues recursively until gameDone flag is set.
	 * 
	 * @private
	 */
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

	/**
	 * Checks for game ending conditions on each frame.
	 * Monitors player death and boss defeat to trigger appropriate game end states.
	 * Plays death sound if character dies (when not muted) and dispatches game won event.
	 * Uses gameWonTriggered flag to prevent multiple win events.
	 * 
	 * @private
	 */
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

	/**
	 * Monitors player position to trigger boss battle mechanics.
	 * When player reaches x position 1900, activates the boss fight by positioning
	 * the enemy health bar and setting the boss ready to fight state.
	 * This creates a clear transition from exploration to boss battle phase.
	 * 
	 * @private
	 */
	checkPlayerPosition() {
		let boss = this.level.enemies.find((obj) => obj instanceof Endboss);
		if (this.character.x >= 1900 && this.enemyHealthBar.x !== 500) {
			this.updateEnemyHealthBarPosition();
			boss.readyToFight = true;
		}
	}

	/**
	 * Updates the enemy health bar position for boss battle display.
	 * Moves the enemy health bar to x position 500 to make it visible during boss fights.
	 * This provides visual feedback to the player about boss health status.
	 * 
	 * @private
	 */
	updateEnemyHealthBarPosition() {
		this.enemyHealthBar.x = 500;
	}

	/**
	 * Stops and resets all character-related audio to prevent sound overlap.
	 * Pauses death, walking, and hurt sounds, then resets their playback position to 0.
	 * Uses optional chaining to safely handle cases where character or sounds might not exist.
	 * Called when game ends or during cleanup operations.
	 * 
	 * @private
	 */
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