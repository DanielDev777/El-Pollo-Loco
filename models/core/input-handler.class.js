class InputHandler {
    constructor(world) {
        this.world = world;
    }

    setupButtons() {
        this.setupCanvasClickHandler();
    }

    setupCanvasClickHandler() {
        this.world.canvas.addEventListener('click', (event) => {
            const { mouseX, mouseY } = this.getMouseCoordinates(event);
            this.handleButtonClicks(mouseX, mouseY);
        });
    }

    getMouseCoordinates(event) {
        const rect = this.world.canvas.getBoundingClientRect();
        let mouseX = event.clientX - rect.left;
        let mouseY = event.clientY - rect.top;

        if (this.world.fullScreenButton.getFullscreenState()) {
            return this.transformFullscreenCoordinates(mouseX, mouseY, rect);
        }

        return { mouseX, mouseY };
    }

    transformFullscreenCoordinates(mouseX, mouseY, rect) {
        const canvasAspectRatio = 720 / 480;
        const screenAspectRatio = rect.width / rect.height;
        
        if (screenAspectRatio > canvasAspectRatio) {
            return this.transformWideScreenCoordinates(mouseX, mouseY, rect, canvasAspectRatio);
        } else {
            return this.transformTallScreenCoordinates(mouseX, mouseY, rect, canvasAspectRatio);
        }
    }

    transformWideScreenCoordinates(mouseX, mouseY, rect, canvasAspectRatio) {
        const scaledWidth = rect.height * canvasAspectRatio;
        const offsetX = (rect.width - scaledWidth) / 2;
        
        mouseX = (mouseX - offsetX) * (720 / scaledWidth);
        mouseY = mouseY * (480 / rect.height);
        
        return { mouseX, mouseY };
    }

    transformTallScreenCoordinates(mouseX, mouseY, rect, canvasAspectRatio) {
        const scaledHeight = rect.width / canvasAspectRatio;
        const offsetY = (rect.height - scaledHeight) / 2;
        
        mouseX = mouseX * (720 / rect.width);
        mouseY = (mouseY - offsetY) * (480 / scaledHeight);
        
        return { mouseX, mouseY };
    }

    handleButtonClicks(mouseX, mouseY) {
        this.handleMuteButtonClick(mouseX, mouseY);
        this.handleFullscreenButtonClick(mouseX, mouseY);
    }

    handleMuteButtonClick(mouseX, mouseY) {
        if (this.world.muteButton.isClicked && this.world.muteButton.isClicked(mouseX, mouseY)) {
            this.world.muteButton.toggle();
        }
    }

    handleFullscreenButtonClick(mouseX, mouseY) {
        let adjustedMouseX = mouseX;
        
        if (this.world.fullScreenButton.getFullscreenState()) {
            adjustedMouseX = mouseX + 70;
        }

        if (this.world.fullScreenButton.isClicked && this.world.fullScreenButton.isClicked(adjustedMouseX, mouseY)) {
            this.world.fullScreenButton.toggle();
        }
    }
}