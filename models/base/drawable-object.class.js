class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0;
  x = 120;
  y = 135;
  height = 150;
  width = 100;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  draw(ctx) {
    if (this.img && this.img.complete && this.img.naturalWidth > 0) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  drawFrame(ctx) {
    if (this instanceof Character) {
      this.calculateActualHitbox();
    }
  }
  calculateActualHitbox() {
    this.actualX = this.x + 20;
    this.actualWidth = this.width - 40;
    this.actualY = this.y + 110;
    this.actualHeight = this.height - 110;
  }
}
