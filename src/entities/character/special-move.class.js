/**
 * Powerful beam attack special move triggered when coin bar is full.
 * Creates a large energy beam that deals massive damage to enemies.
 * Features timed duration and animated beam effects.
 * 
 * @class SpecialMove
 * @extends MovableObject
 * @example
 * const beam = new SpecialMove(character.x + 80, character.y + 100, character.otherDirection);
 * // Beam will animate and expire after duration
 */
class SpecialMove extends MovableObject {
	/** @type {number} Width of the beam attack */
	width = 500;
	
	/** @type {number} Height of the beam attack */
	height = 250;
	
	/** @type {number} Movement speed (not used for stationary beam) */
	speed = 15;
	
	/** @type {number} Damage dealt to enemies */
	damage = 2000;
	
	/** @type {number} Duration of the special move in milliseconds */
    duration = 1000;
    
    /** @type {number} Timestamp when special move was created */
    startTime = Date.now();
    
	/** @type {string[]} Animation frames for beam effect */
	IMAGES = [
		"img/0_special_move/kamehameha_third_stage.png",
		"img/0_special_move/kamehameha_final_stage.png",
	];

	/**
	 * Creates a new special move beam at the specified position.
	 * 
	 * @param {number} x - X coordinate for beam placement
	 * @param {number} y - Y coordinate for beam placement  
	 * @param {boolean} [direction=false] - Direction of the beam (true = left, false = right)
	 */
	constructor(x, y, direction = false) {
        super().loadImage('img/0_special_move/kamehameha_third_stage.png');
        this.loadImages(this.IMAGES);
        this.x = x;
        this.y = y;
        this.otherDirection = direction;
        this.animate();
    }

    /**
     * Starts the beam animation with rapid frame switching.
     * Creates intense visual effect for the powerful attack.
     * 
     * @private
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 50);
    }

    /**
     * Checks if the special move has exceeded its duration.
     * Used by the game system to remove expired special moves.
     * 
     * @returns {boolean} True if the move should be removed
     */
    isExpired() {
        return Date.now() - this.startTime > this.duration;
    }

    getRange() {
        return {
            x: this.x - 50,
            y: this.y - 50,
            width: this.width + 100,
            height: this.height + 100
        };
    }
}
