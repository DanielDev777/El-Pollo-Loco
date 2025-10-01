class CameraManager {
    camera_x = 0;
    camera_mode = 'right';
    camera_transitioning = false;
    camera_transition_progress = 0;
    camera_start_x = 0;
    camera_end_x = 0;
    camera_transition_speed = 0.25;

    constructor(canvas) {
        this.canvas = canvas;
    }

    updateCamera(character, keyboard) {
        const currentMode = this.getCameraMode(character, keyboard);
        
        if (this.camera_transitioning) {
            this.handleCameraTransition(character, keyboard);
        } else if (this.camera_mode !== currentMode) {
            this.startCameraTransition(currentMode, character);
        } else {
            this.updateCameraNormal(character);
        }
    }

    getCameraMode(character, keyboard) {
        return ((keyboard.LEFT && character.x > 0) || character.otherDirection) ? 'left' : 'right';
    }

    startCameraTransition(newMode, character) {
        this.camera_start_x = this.camera_x;
        this.camera_mode = newMode;
        this.camera_transitioning = true;
        this.camera_transition_progress = 0;
        
        let targetCameraX = this.calculateTargetPosition(newMode, character);
        const leftBoundary = 0;
        const rightBoundary = -(2800 - this.canvas.width);
        this.camera_end_x = Math.max(rightBoundary, Math.min(leftBoundary, targetCameraX));
    }

    handleCameraTransition(character, keyboard) {
        let currentTarget = this.calculateTargetPosition(this.camera_mode, character);
        const leftBoundary = 0;
        const rightBoundary = -(2800 - this.canvas.width);
        currentTarget = Math.max(rightBoundary, Math.min(leftBoundary, currentTarget));
        
        const distance = currentTarget - this.camera_x;
        const isCharacterMoving = keyboard.LEFT || keyboard.RIGHT;
        const moveSpeed = isCharacterMoving ? 25 : 10;
        
        if (Math.abs(distance) <= moveSpeed) {
            this.camera_x = currentTarget;
            this.camera_transitioning = false;
        } else {
            this.camera_x += distance > 0 ? moveSpeed : -moveSpeed;
        }
        
        this.camera_x = Math.round(this.camera_x);
    }

    updateCameraNormal(character) {
        let targetCameraX = this.calculateTargetPosition(this.camera_mode, character);
        const leftBoundary = 0;
        const rightBoundary = -(2800 - this.canvas.width);
        targetCameraX = Math.max(rightBoundary, Math.min(leftBoundary, targetCameraX));
        this.camera_x = Math.round(targetCameraX);
    }

    calculateTargetPosition(mode, character) {
        if (mode === 'left') {
            const cameraOffset = this.canvas.width / 2;
            return -character.x + cameraOffset;
        } else {
            return -character.x + 100;
        }
    }
}