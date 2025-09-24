class CameraManager {
    constructor(world) {
        this.world = world;
        this.camera_x = 0;
    }

    updateCamera() {
        this.camera_x = -this.world.character.x + 100;
    }

    getCameraX() {
        return this.camera_x;
    }

    translateForWorldObjects(ctx) {
        ctx.translate(this.camera_x, 0);
    }

    translateForUI(ctx) {
        ctx.translate(-this.camera_x, 0);
    }
}