class StatusBar extends DrawableObject {
    percentage = 0;

    constructor() {
        super();
        this.x = 40;
        this.width = 200;
        this.height = 60;
    }

    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }
    
    resolveImageIndex() {
        switch (true) {
            case (this.percentage == 100):
                return 5;
            case (this.percentage >= 80):
                return 4;
            case (this.percentage >= 60):
                return 3;
            case (this.percentage >= 40):
                return 2;
            case (this.percentage >= 20):
                return 1;
            default:
                return 0;

        }
    }
}