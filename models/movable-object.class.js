class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 1.5;
  health = 100;
  lastHit = 0;
  actualX;
  actualWidth;
  actualY;
  actualHeight;

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    if (this instanceof Bottle && this.isSplashing) {
      return false;
    }
    return this.y < 135;
  }

  isColliding(mo) {
    let thisX = this.actualX !== undefined ? this.actualX : this.x;
    let thisY = this.actualY !== undefined ? this.actualY : this.y;
    let thisWidth = this.actualWidth !== undefined ? this.actualWidth : this.width;
    let thisHeight = this.actualHeight !== undefined ? this.actualHeight : this.height;
    
    let otherX = mo.actualX !== undefined ? mo.actualX : mo.x;
    let otherY = mo.actualY !== undefined ? mo.actualY : mo.y;
    let otherWidth = mo.actualWidth !== undefined ? mo.actualWidth : mo.width;
    let otherHeight = mo.actualHeight !== undefined ? mo.actualHeight : mo.height;
    
    return (
      thisX + thisWidth > otherX &&
      thisY + thisHeight > otherY &&
      thisX < otherX + otherWidth &&
      thisY < otherY + otherHeight
    );
  }

  hit(value) {
    this.health -= value;
    if (this.health < 0) {
      this.health = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  isDead() {
    return this.health == 0;
  }

  moveRight() {
    this.x += this.speed;
    this.otherDirection = false;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  jump() {
    this.speedY = 20;
  }
}
