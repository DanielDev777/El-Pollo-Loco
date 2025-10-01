/**
 * Final boss enemy with multiple animation states and advanced AI behavior.
 * Features alert detection when player approaches, multiple attack patterns,
 * and complex movement patterns for challenging gameplay.
 * 
 * @class Endboss
 * @extends MovableObject
 * @example
 * const boss = new Endboss();
 * // Boss will automatically animate and react to player proximity
 */
class Endboss extends MovableObject {
    /** @type {number} Boss height in pixels */
    height = 400;
    
    /** @type {number} Boss width in pixels */
    width = 250;
    
    /** @type {number} X position at end of level */
    x = 2500;
    
    /** @type {number} Y position (elevated above ground) */
    y = 50;
    
    /** @type {boolean} Flag indicating if boss is in combat mode */
    readyToFight = false;
    
    /** @type {number} Boss movement speed */
    speed = 10;
    
    /** @type {boolean} Flag to prevent multiple movement intervals */
    movementIntervalStarted = false;
    
    /** @type {string[]} Animation frames for walking */
    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png',
    ];
    
    /** @type {string[]} Animation frames for alert state */
    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png',
    ];
    
    /** @type {string[]} Animation frames for attacking */
    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png',
    ];
    
    /** @type {string[]} Animation frames for taking damage */
    IMAGES_HURTING = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];
    
    /** @type {string[]} Animation frames for death sequence */
    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png',
    ];
    
    /** @type {Audio} Sound effect for bottle hits */
    bottle_hit = new Audio('audio/bottle_hit.mp3');
    
    /** @type {Audio} Sound effect for heavy damage */
    big_hit_sound = new Audio('audio/big_hit.mp3');

    /**
     * Creates the endboss with all animations and sound effects loaded.
     * Initializes at level end position and sets up all behavioral states.
     * Configures audio volumes and starts the main animation loop.
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURTING);
        this.loadImages(this.IMAGES_DEAD);
        this.bottle_hit.volume = 0.5;
        this.big_hit_sound.volume = 1;
        this.animate();
    }

    /**
     * Main animation controller that manages boss state-based animations.
     * Cycles through death, hurt, and combat animations based on current status.
     * Uses frame counter for attack preparation timing and state transitions.
     * 
     * @private
     */
    animate() {
        let i = 0;
        setInterval(() => {
            if (this.isDead()) {
                this.playDeathAnimation();
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURTING);
            } else if (this.readyToFight) {
                this.prepareForAttack(i);
                i++;
            }
        }, 200);
    }
    
    /**
     * Handles the boss preparation phase before launching attacks.
     * Shows alert animation for 10 frames, then transitions to walking and attack mode.
     * Creates anticipation and visual telegraphing for player reaction time.
     * 
     * @param {number} i - Frame counter for timing the preparation sequence
     * @private
     */
    prepareForAttack(i) {
        if (i < 10) {
            this.playAnimation(this.IMAGES_ALERT);
        } else {
            this.playAnimation(this.IMAGES_WALKING);
            this.attack();
        }
    }

    /**
     * Initiates and manages the boss death animation sequence.
     * Ensures death animation only plays once using completion flag.
     * Delegates to slow animation method for dramatic effect.
     * 
     * @private
     */
    playDeathAnimation() {
        if (!this.deathAnimationComplete) {
            this.playSlowDeathAnimation();
        }
    }

    /**
     * Executes frame-by-frame death animation with precise timing control.
     * Initializes animation state on first call, then cycles through death frames.
     * Completes animation when all frames have been displayed.
     * 
     * @private
     */
    playSlowDeathAnimation() {
        if (!this.deathAnimationStarted) {
            this.deathAnimationStarted = true;
            this.deathFrameCounter = 0;
        }
        if (this.deathFrameCounter % 1 === 0) {
            const frameIndex = Math.floor(this.deathFrameCounter / 1);
            if (frameIndex < this.IMAGES_DEAD.length) {
                this.img = this.imageCache[this.IMAGES_DEAD[frameIndex]];
            } else {
                this.completeDeathAnimation();
            }
        }
        this.deathFrameCounter++;
    }

    /**
     * Finalizes the death animation and sets the boss to its final dead state.
     * Sets completion flags and locks the image to the last death frame.
     * Prevents multiple death event triggers through flag management.
     * 
     * @private
     */
    completeDeathAnimation() {
        if (!this.deathEventTriggered) {
            this.deathAnimationComplete = true;
            this.deathEventTriggered = true;
            this.img = this.imageCache[this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]];
        }
    }

    /**
     * Initiates boss attack pattern with dynamic movement behavior.
     * Creates movement interval that responds to position and boss state.
     * Implements bidirectional movement with boundary checking at 60fps.
     * 
     * @private
     */
    attack() {
        if (!this.movementIntervalStarted) {
            this.movementIntervalStarted = true;
            setInterval(() => {
                if (this.world) {
                    this.checkPosition();
                    if (this.readyToFight && this.x > 0 && !this.isDead() && this.otherDirection === false) {
                        this.moveLeft();
                    } else if (this.readyToFight && !this.isDead() && this.otherDirection === true) {
                        this.moveRight(true);
                    }
                }
            }, 1000 / 60);
        }
    }

    /**
     * Monitors boss position and adjusts movement direction at boundaries.
     * Reverses direction when reaching left edge (x=0) or level end.
     * Creates pacing behavior that keeps boss within the combat area.
     * 
     * @private
     */
    checkPosition() {
        if (this.x <= 0) {
            this.otherDirection = true;
        } else if (this.x >= this.world.level.level_end_x) {
            this.otherDirection = false;
        }
    }
}