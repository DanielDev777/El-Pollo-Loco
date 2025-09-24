class Character extends MovableObject {
  height = 300;
  width = 150;
  speed = 10;
  actualX = this.x + 20;
  actualWidth = this.width - 40;
  actualY = this.y + 110;
  actualHeight = this.height - 110;
  
  IMAGES_WALKING = [
    'img/2_character_pepe/2_walk/W-21.png',
    'img/2_character_pepe/2_walk/W-22.png',
    'img/2_character_pepe/2_walk/W-23.png',
    'img/2_character_pepe/2_walk/W-24.png',
    'img/2_character_pepe/2_walk/W-25.png',
    'img/2_character_pepe/2_walk/W-26.png',
  ];
  IMAGES_JUMPING = [
    'img/2_character_pepe/3_jump/J-31.png',
    'img/2_character_pepe/3_jump/J-32.png',
    'img/2_character_pepe/3_jump/J-33.png',
    'img/2_character_pepe/3_jump/J-34.png',
    'img/2_character_pepe/3_jump/J-35.png',
    'img/2_character_pepe/3_jump/J-36.png',
    'img/2_character_pepe/3_jump/J-37.png',
    'img/2_character_pepe/3_jump/J-38.png',
    'img/2_character_pepe/3_jump/J-39.png',
  ];
  IMAGES_HURTING = [
    'img/2_character_pepe/4_hurt/H-41.png',
    'img/2_character_pepe/4_hurt/H-42.png',
    'img/2_character_pepe/4_hurt/H-43.png',
  ];
  IMAGES_DEAD = [
    'img/2_character_pepe/5_dead/D-51.png',
    'img/2_character_pepe/5_dead/D-52.png',
    'img/2_character_pepe/5_dead/D-53.png',
    'img/2_character_pepe/5_dead/D-54.png',
    'img/2_character_pepe/5_dead/D-55.png',
    'img/2_character_pepe/5_dead/D-56.png',
    'img/2_character_pepe/5_dead/D-57.png',
  ];
  
  walking_sound = new Audio('audio/walking.mp3');
  world;
  
  // Backflip properties
  rotation = 0;
  isBackflipping = false;
  backflipSpeed = 0;
  backflipReady = false;
  isThrowingCooldown = false;
  
  // Animation properties
  jumpAnimationPlayed = false;
  jumpAnimationIndex = 0;
  jumpAnimationFrameCounter = 0;
  deathAnimationComplete = false;
  deathAnimationCounter = 0;

  constructor() {
    super().loadImage('img/2_character_pepe/2_walk/W-21.png');
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_HURTING);
    this.loadImages(this.IMAGES_DEAD);
    this.applyGravity();
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.updateMovement();
      this.updateBackflip();
      this.resetBackflipOnLanding();
      this.updateCamera();
    }, 1000 / 60);
    
    setInterval(() => {
      this.updateAnimations();
    }, 50);
  }

  updateMovement() {
    this.handleMovement();
    this.handleJumping();
    this.handleThrowing();
    
    // Update input states after processing all inputs
    if (this.world && this.world.inputManager) {
      this.world.inputManager.updateInputStates();
    }
  }

  updateCamera() {
    if (this.world && this.world.cameraManager) {
      this.world.cameraManager.updateCamera();
    }
  }

  handleThrowing() {
    if (!this.world || !this.world.inputManager) return;
    
    if (this.world.inputManager.isNewKeyPress('D') && 
        this.world.hotSauceBar.percentage >= 25 &&
        !this.isThrowingCooldown) {
      this.throwBottle();
      this.isThrowingCooldown = true;
      setTimeout(() => {
        this.isThrowingCooldown = false;
      }, 300);
    }
  }

  throwBottle() {
    const thrownBottle = new Bottle(this.x + 100);
    thrownBottle.throw(this.x + 100, this.actualY + 40, this.world);
    this.world.thrownBottles.push(thrownBottle);
    this.world.hotSauceBar.setPercentage(this.world.hotSauceBar.percentage - 25);
  }

  updateAnimations() {
    if (this.isDead()) {
      this.playSlowDeathAnimation();
    } else if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURTING);
    } else if (this.isAboveGround()) {
      this.playJumpAnimation();
    } else {
      this.playWalkingAnimation();
    }
  }

  playWalkingAnimation() {
    if (this.world && this.world.inputManager && 
        (this.world.inputManager.isKeyPressed('RIGHT') || 
         this.world.inputManager.isKeyPressed('LEFT'))) {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }

  handleMovement() {
    if (!this.world || !this.world.inputManager) return;
    
    if (this.world.inputManager.canMoveRight(this, this.world.level.level_end_x)) {
      this.moveRightWithSound();
    }

    if (this.world.inputManager.canMoveLeft(this)) {
      this.moveLeftWithSound();
    }
  }

  moveRightWithSound() {
    this.otherDirection = false;
    this.moveRight();
    this.playWalkingSound();
  }

  moveLeftWithSound() {
    this.otherDirection = true;
    this.moveLeft();
    this.playWalkingSound();
  }

  playWalkingSound() {
    if (!this.isAboveGround()) {
      this.walking_sound.play();
    }
  }

  handleJumping() {
    if (!this.world || !this.world.inputManager) return;
    
    if (this.world.inputManager.isKeyPressed('SPACE') && !this.isAboveGround()) {
      this.startJump();
    }

    if (this.isAboveGround() && 
        this.world.inputManager.isNewKeyPress('SPACE') && 
        this.backflipReady) {
      this.performBackflip();
    }
  }

  startJump() {
    this.jump();
    this.backflipReady = true;
    this.resetJumpAnimation();
  }

  resetJumpAnimation() {
    this.jumpAnimationPlayed = false;
    this.jumpAnimationIndex = 0;
    this.jumpAnimationFrameCounter = 0;
  }

  performBackflip() {
    this.backflip();
    this.backflipReady = false;
  }

  updateBackflip() {
    if (this.isBackflipping) {
      this.rotation += this.backflipSpeed;
      if (this.isBackflipComplete()) {
        this.stopBackflip();
      }
    }
  }

  resetBackflipOnLanding() {
    if (!this.isAboveGround() && this.speedY <= 0) {
      this.backflipReady = false;
      if (this.isBackflipping) {
        this.stopBackflip();
      }
    }
  }

  playJumpAnimation() {
    if (!this.jumpAnimationPlayed) {
      this.jumpAnimationFrameCounter++;
      if (this.jumpAnimationFrameCounter >= 2) {
        this.jumpAnimationFrameCounter = 0;
        if (this.jumpAnimationIndex < this.IMAGES_JUMPING.length - 1) {
          this.jumpAnimationIndex++;
        } else {
          this.jumpAnimationPlayed = true;
        }
      }
      let path = this.IMAGES_JUMPING[this.jumpAnimationIndex];
      this.img = this.imageCache[path];
    } else {
      let path = this.IMAGES_JUMPING[this.IMAGES_JUMPING.length - 1];
      this.img = this.imageCache[path];
    }
  }

  isBackflipComplete() {
    return this.rotation <= -360;
  }

  stopBackflip() {
    this.rotation = 0;
    this.isBackflipping = false;
    this.backflipSpeed = 0;
  }

  backflip() {
    this.speedY = 15;
    this.isBackflipping = true;
    this.backflipSpeed = this.otherDirection ? -9 : -9;
  }

  playSlowDeathAnimation() {
    if (!this.deathAnimationComplete) {
      if (this.deathAnimationCounter % 4 === 0) {
        let index = Math.floor(this.deathAnimationCounter / 4);
        if (index < this.IMAGES_DEAD.length) {
          this.img = this.imageCache[this.IMAGES_DEAD[index]];
        } else {
          this.deathAnimationComplete = true;
          this.img =
            this.imageCache[this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]];
        }
      }
      this.deathAnimationCounter++;
    }
  }
}
