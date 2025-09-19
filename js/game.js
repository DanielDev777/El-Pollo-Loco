let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
}

document.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'ArrowUp':
            keyboard.UP = true;
            break;
        case 'ArrowRight':
            keyboard.RIGHT = true;
            break;
        case 'ArrowDown':
            keyboard.DOWN = true;
            break;
        case 'ArrowLeft':
            keyboard.LEFT = true;
            break;
        case 'Space':
            keyboard.SPACE = true;
            break;
    }
});
document.addEventListener('keyup', (e) => {
    switch (e.code) {
        case 'ArrowUp':
            keyboard.UP = false;
            break;
        case 'ArrowRight':
            keyboard.RIGHT = false;
            break;
        case 'ArrowDown':
            keyboard.DOWN = false;
            break;
        case 'ArrowLeft':
            keyboard.LEFT = false;
            break;
        case 'Space':
            keyboard.SPACE = false;
            break;
    }
});