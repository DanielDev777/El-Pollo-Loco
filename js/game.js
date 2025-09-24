let canvas;
let world;
let keyboard = new Keyboard();
let startBtn = document.getElementById('start-btn');
let gameOverEvent = new Event('game-over');
let gameWonEvent = new Event('game-won');
let overlay = document.getElementById('overlay-img');

startBtn.addEventListener('click', startGame);

window.addEventListener('game-over', gameOver, { once: true });
window.addEventListener('game-won', gameWon, { once: true });

function startGame() {
    document.getElementById('overlay-img').style.display = 'none';
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    startBtn.style.display = 'none';
}

function gameWon() {
    displayOverlay();
    overlay.src = "img/You won, you lost/You won A.png";
}

function gameOver() {
    displayOverlay();
    overlay.src = "img/9_intro_outro_screens/game_over/oh no you lost!.png";
}

function displayOverlay() {
    overlay.style.display = 'block';
    overlay.style.background = 'rgba(0, 0, 0, .5)';
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
        case 'KeyD':
            keyboard.D = true;
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
        case 'KeyD':
            keyboard.D = false;
            break;
    }
});