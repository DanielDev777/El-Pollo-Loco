class Character extends MovableObject {
	height = 300;
	width = 150;
	speed = 10;
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
	IMAGES_WALKING = [
		"img/2_character_pepe/2_walk/W-21.png",
		"img/2_character_pepe/2_walk/W-22.png",
		"img/2_character_pepe/2_walk/W-23.png",
		"img/2_character_pepe/2_walk/W-24.png",
		"img/2_character_pepe/2_walk/W-25.png",
		"img/2_character_pepe/2_walk/W-26.png",
	];
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
	IMAGES_HURTING = [
		"img/2_character_pepe/4_hurt/H-41.png",
		"img/2_character_pepe/4_hurt/H-42.png",
		"img/2_character_pepe/4_hurt/H-43.png",
	];
	IMAGES_DEAD = [
		"img/2_character_pepe/5_dead/D-51.png",
		"img/2_character_pepe/5_dead/D-52.png",
		"img/2_character_pepe/5_dead/D-53.png",
		"img/2_character_pepe/5_dead/D-54.png",
		"img/2_character_pepe/5_dead/D-55.png",
		"img/2_character_pepe/5_dead/D-56.png",
		"img/2_character_pepe/5_dead/D-57.png",
	];
	walking_sound = new Audio("audio/walking.mp3");
	normal_ouch = new Audio("audio/normal_ouch.mp3");
	big_ouch = new Audio("audio/big_ouch.mp3");
	death_sound = new Audio("audio/death.mp3");
	world;
	specialMove;
	rotation = 0;
	isBackflipping = false;
	backflipSpeed = 0;
	backflipReady = false;
	lastSpaceState = false;
	lastDState = false;
	lastInputTime = Date.now();
	animationManager;
	movementController;
	actionHandler;

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

	initializeManagers() {
		this.animationManager = new CharacterAnimationManager(this);
		this.movementController = new CharacterMovementController(this);
		this.actionHandler = new CharacterActionHandler(this);
	}

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