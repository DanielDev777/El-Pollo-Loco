/**
 * Main player character class with animation, movement, and action capabilities.
 * Extends MovableObject with character-specific behaviors including multiple animation states,
 * sound effects, input handling through delegated managers, and special abilities.
 * 
 * @class Character
 * @extends MovableObject
 * @example
 * const character = new Character();
 * character.resetCharacter();
 * // Character will handle animations, movement, and actions through its managers
 */
class Character extends MovableObject {
	/** @type {number} Character height in pixels */
	height = 300;
	
	/** @type {number} Character width in pixels */
	width = 150;
	
	/** @type {number} Character movement speed */
	speed = 10;
	/** @type {string[]} Animation frames for idle state */
	IMAGES_IDLE = [
		"img/2_character_pepe/1_idle/idle/I-1.png",
		"img/2_character_pepe/1_idle/idle/I-2.png",
		"img/2_character_pepe/1_idle/idle/I-3.png",
		"img/2_character_pepe/1_idle/idle/I-4.png",
		"img/2_character_pepe/1_idle/idle/I-5.png",
		"img/2_character_pepe/1_idle/idle/I-6.png",
		"img/2_character_pepe/1_idle/idle/I-7.png",
		"img/2_character_pepe/1_idle/idle/I-8.png",
		"img/2_character_pepe/1_idle/idle/I-9.png",
		"img/2_character_pepe/1_idle/idle/I-10.png",
	];
	/** @type {string[]} Animation frames for long idle state */
	IMAGES_LONG_IDLE = [
		"img/2_character_pepe/1_idle/long_idle/I-11.png",
		"img/2_character_pepe/1_idle/long_idle/I-12.png",
		"img/2_character_pepe/1_idle/long_idle/I-13.png",
		"img/2_character_pepe/1_idle/long_idle/I-14.png",
		"img/2_character_pepe/1_idle/long_idle/I-15.png",
		"img/2_character_pepe/1_idle/long_idle/I-16.png",
		"img/2_character_pepe/1_idle/long_idle/I-17.png",
		"img/2_character_pepe/1_idle/long_idle/I-18.png",
		"img/2_character_pepe/1_idle/long_idle/I-19.png",
		"img/2_character_pepe/1_idle/long_idle/I-20.png",
	];
	/** @type {string[]} Animation frames for walking sequence */
	IMAGES_WALKING = [
		"img/2_character_pepe/2_walk/W-21.png",
		"img/2_character_pepe/2_walk/W-22.png",
		"img/2_character_pepe/2_walk/W-23.png",
		"img/2_character_pepe/2_walk/W-24.png",
		"img/2_character_pepe/2_walk/W-25.png",
		"img/2_character_pepe/2_walk/W-26.png",
	];
	
	/** @type {string[]} Animation frames for jumping sequence */
	IMAGES_JUMPING = [
		"img/2_character_pepe/3_jump/J-31.png",
		"img/2_character_pepe/3_jump/J-32.png",
		"img/2_character_pepe/3_jump/J-33.png",
		"img/2_character_pepe/3_jump/J-34.png",
		"img/2_character_pepe/3_jump/J-35.png",
		"img/2_character_pepe/3_jump/J-36.png",
		"img/2_character_pepe/3_jump/J-37.png",
		"img/2_character_pepe/3_jump/J-38.png",
		"img/2_character_pepe/3_jump/J-39.png",
	];
	
	/** @type {string[]} Animation frames for taking damage */
	IMAGES_HURTING = [
		"img/2_character_pepe/4_hurt/H-41.png",
		"img/2_character_pepe/4_hurt/H-42.png",
		"img/2_character_pepe/4_hurt/H-43.png",
	];
	
	/** @type {string[]} Animation frames for death sequence */
	IMAGES_DEAD = [
		"img/2_character_pepe/5_dead/D-51.png",
		"img/2_character_pepe/5_dead/D-52.png",
		"img/2_character_pepe/5_dead/D-53.png",
		"img/2_character_pepe/5_dead/D-54.png",
		"img/2_character_pepe/5_dead/D-55.png",
		"img/2_character_pepe/5_dead/D-56.png",
		"img/2_character_pepe/5_dead/D-57.png",
	];
	
	/** @type {Audio} Walking sound effect */
	walking_sound = new Audio("audio/walking.mp3");
	
	/** @type {Audio} Light damage sound effect */
	normal_ouch = new Audio("audio/normal_ouch.mp3");
	
	/** @type {Audio} Heavy damage sound effect */
	big_ouch = new Audio("audio/big_ouch.mp3");
	
	/** @type {Audio} Death sound effect */
	death_sound = new Audio("audio/death.mp3");
	
	/** @type {World} Reference to the game world instance */
	world;
	
	/** @type {SpecialMove} Current special move instance */
	specialMove;
	
	/** @type {number} Character rotation angle for special moves */
	rotation = 0;
	
	/** @type {boolean} Flag indicating if character is performing backflip */
	isBackflipping = false;
	
	/** @type {number} Speed of backflip rotation */
	backflipSpeed = 0;
	
	/** @type {boolean} Flag indicating if backflip is ready to execute */
	backflipReady = false;
	
	/** @type {boolean} Previous state of space key for edge detection */
	lastSpaceState = false;
	
	/** @type {boolean} Previous state of D key for edge detection */
	lastDState = false;
	
	/** @type {number} Timestamp of last input for idle detection */
	lastInputTime = Date.now();
	
	/** @type {CharacterAnimationManager} Manager for character animations */
	animationManager;
	
	/** @type {CharacterMovementController} Manager for character movement */
	movementController;
	
	/** @type {CharacterActionHandler} Manager for character actions */
	actionHandler;

	/**
	 * Creates a new character instance with all animations and managers.
	 * Initializes sound effects, loads all animation frames, and starts systems.
	 */
	constructor() {
		super().loadImage("img/2_character_pepe/2_walk/W-21.png");
		this.loadImages(this.IMAGES_IDLE);
		this.loadImages(this.IMAGES_LONG_IDLE);
		this.loadImages(this.IMAGES_WALKING);
		this.loadImages(this.IMAGES_JUMPING);
		this.loadImages(this.IMAGES_HURTING);
		this.loadImages(this.IMAGES_DEAD);
		this.normal_ouch.volume = 0.2;
		this.big_ouch.volume = 0.3;
		this.death_sound.volume = 0.4;
		this.initializeManagers();
		this.applyGravity();
		this.animate();
	}

	/**
	 * Initializes all character management systems.
	 * Creates specialized managers for animation, movement, and actions.
	 * 
	 * @private
	 */
	initializeManagers() {
		this.animationManager = new CharacterAnimationManager(this);
		this.movementController = new CharacterMovementController(this);
		this.actionHandler = new CharacterActionHandler(this);
	}

	/**
	 * Main character animation and input processing loop.
	 * Runs at 60 FPS for movement and 5 FPS for animations.
	 * Delegates to specialized managers for clean separation of concerns.
	 * 
	 * @private
	 */
	animate() {
		setInterval(() => {
			this.movementController.handleMovement();
			this.movementController.handleJumping();
			this.actionHandler.throwBottle();
			this.movementController.updateBackflip();
			this.movementController.resetBackflipOnLanding();
			this.lastSpaceState = this.world.keyboard.SPACE;
			this.lastDState = this.world.keyboard.D;
			this.movementController.updateLastInputTime();
			this.actionHandler.triggerSpecialMove();
		}, 1000 / 60);
		setInterval(() => {
			this.animationManager.handleAnimations();
		}, 50);
	}

	backflip() {
		this.movementController.backflip();
	}

	resetCharacter() {
		this.actionHandler.resetCharacter();
	}
}