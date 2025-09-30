let canvas;
let world;
let keyboard = new Keyboard();
let startBtn = document.getElementById('start-btn');
let restartBtn = document.getElementById('restart-btn');
let gameOverEvent = new Event('game-over');
let gameWonEvent = new Event('game-won');
let overlay = document.getElementById('overlay-img');
let leftBtn = document.getElementById('left-btn');
let rightBtn = document.getElementById('right-btn');
let upBtn = document.getElementById('up-btn');
let throwBtn = document.getElementById('throw-btn');
let beamBtn = document.getElementById('beam-btn');

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);

window.addEventListener('game-over', gameOver);
window.addEventListener('game-won', gameWon);

function startGame() {
    document.getElementById('overlay-img').style.display = 'none';
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    startBtn.style.display = 'none';
}

function gameWon() {
    if (world && !world.gameDone) return;
    displayOverlay();
    overlay.src = "img/You won, you lost/You won A.png";
    restartBtn.classList.remove('d-none');
}

function gameOver() {
    if (world && !world.gameDone) return;
    displayOverlay();
    overlay.src = "img/9_intro_outro_screens/game_over/oh no you lost!.png";
    restartBtn.classList.remove('d-none');
}

function displayOverlay() {
    overlay.style.display = 'block';
    overlay.style.background = 'rgba(0, 0, 0, .5)';
}

function restartGame() {
    stopCurrentGame();
    resetGameState();
    startGame();
}

function stopCurrentGame() {
    if (world) {
        world.stopAllIntervals();
        world = null;
    }
}

function resetGameState() {
    keyboard = new Keyboard();
    overlay.style.display = 'none';
    overlay.style.background = 'none';
    overlay.src = '';
    startBtn.style.display = 'block';
    restartBtn.classList.add('d-none');
    
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
        case 'KeyF':
            keyboard.F = true;
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
        case 'KeyF':
            keyboard.F = false;
            break;
    }
});

// Mobile //
leftBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    keyboard.LEFT = true;
});
leftBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    keyboard.LEFT = false;
});
rightBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    keyboard.RIGHT = true;
});
rightBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    keyboard.RIGHT = false;
});
upBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    keyboard.SPACE = true;
});
upBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    keyboard.SPACE = false;
});
throwBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    keyboard.D = true;
});
throwBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    keyboard.D = false;
});
beamBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    keyboard.F = true;
});
beamBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    keyboard.F = false;
});
// Mobile //