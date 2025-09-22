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
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

    drawFrame(ctx) {
    if (this instanceof Character || this instanceof Chicken) {
      ctx.beginPath();
      if (this instanceof Character) {
        this.actualX = this.x + 20;
        this.actualWidth = this.width - 40;
        this.actualY = this.y + 110;
        this.actualHeight = this.height - 110;
        ctx.rect(
          this.actualX,
          this.actualY,
          this.actualWidth,
          this.actualHeight
        );
      } else {
        ctx.rect(this.x, this.y, this.width, this.height);
      }
      ctx.strokeStyle = "red";
      ctx.stroke();
    }
  }
}
