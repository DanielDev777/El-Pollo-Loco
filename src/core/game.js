/**
 * @fileoverview Main game initialization and control logic for El Pollo Loco.
 * Handles game lifecycle, event management, keyboard input, and UI interactions.
 * @author El Pollo Loco Development Team
 * @version 1.0.0
 */

/** @type {HTMLCanvasElement} The main game canvas element */
let canvas;

/** @type {World} The main game world instance containing all game logic */
let world;

/** @type {Keyboard} Global keyboard input state manager */
let keyboard = new Keyboard();

/** @type {HTMLButtonElement} Start game button element */
let startBtn = document.getElementById('start-btn');

/** @type {HTMLButtonElement} Restart game button element */
let restartBtn = document.getElementById('restart-btn');

/** @type {Event} Custom event dispatched when game ends in failure */
let gameOverEvent = new Event('game-over');

/** @type {Event} Custom event dispatched when game ends in victory */
let gameWonEvent = new Event('game-won');

/** @type {HTMLImageElement} Overlay image element for game states */
let overlay = document.getElementById('overlay-img');

/** @type {HTMLButtonElement} Mobile control: move left button */
let leftBtn = document.getElementById('left-btn');

/** @type {HTMLButtonElement} Mobile control: move right button */
let rightBtn = document.getElementById('right-btn');

/** @type {HTMLButtonElement} Mobile control: jump button */
let upBtn = document.getElementById('up-btn');

/** @type {HTMLButtonElement} Mobile control: throw bottle button */
let throwBtn = document.getElementById('throw-btn');

/** @type {HTMLButtonElement} Mobile control: special beam attack button */
let beamBtn = document.getElementById('beam-btn');

/** @type {HTMLElement} Portrait orientation warning message */
let portraitMessage = document.getElementById('portrait-message');

// Event Listeners Setup
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);

window.addEventListener('game-over', gameOver);
window.addEventListener('game-won', gameWon);

/**
 * Initializes and starts a new game session.
 * Hides the start overlay, creates the world instance, and begins game loop.
 * 
 * @function startGame
 * @example
 * startGame(); // Begins new game session
 */
function startGame() {
    document.getElementById('overlay-img').style.display = 'none';
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    startBtn.style.display = 'none';
}

/**
 * Handles the game won state.
 * Displays victory overlay and shows restart button if game is properly completed.
 * 
 * @function gameWon
 * @example
 * window.dispatchEvent(gameWonEvent); // Triggers gameWon()
 */
function gameWon() {
    if (world && !world.gameDone) return;
    displayOverlay();
    overlay.src = "img/You won, you lost/You won A.png";
    restartBtn.classList.remove('d-none');
}

/**
 * Handles the game over state.
 * Displays failure overlay and shows restart button if game is properly ended.
 * 
 * @function gameOver
 * @example
 * window.dispatchEvent(gameOverEvent); // Triggers gameOver()
 */
function gameOver() {
    if (world && !world.gameDone) return;
    displayOverlay();
    overlay.src = "img/9_intro_outro_screens/game_over/oh no you lost!.png";
    restartBtn.classList.remove('d-none');
}

/**
 * Shows the game overlay with semi-transparent background.
 * Used for both game over and victory states.
 * 
 * @function displayOverlay
 * @private
 */
function displayOverlay() {
    overlay.style.display = 'block';
    overlay.style.background = 'rgba(0, 0, 0, .5)';
}

/**
 * Restarts the game by stopping current session, resetting state, and starting new game.
 * Cleans up all intervals and reinitializes the game world.
 * 
 * @function restartGame
 * @example
 * restartBtn.addEventListener('click', restartGame);
 */
function restartGame() {
    stopCurrentGame();
    resetGameState();
    startGame();
}

/**
 * Stops the current game session and cleans up resources.
 * Stops all game intervals and destroys the world instance.
 * 
 * @function stopCurrentGame
 * @private
 */
function stopCurrentGame() {
    if (world) {
        world.stopAllIntervals();
        world = null;
    }
}

/**
 * Resets all game state variables to initial values.
 * Prepares the UI and variables for a fresh game session.
 * 
 * @function resetGameState
 * @private
 */
function resetGameState() {
    keyboard = new Keyboard();
    overlay.style.display = 'none';
    overlay.style.background = 'none';
    overlay.src = '';
    startBtn.style.display = 'block';
    restartBtn.classList.add('d-none');
}

/**
 * Keyboard input handler for keydown events.
 * Maps keyboard keys to game actions and updates the global keyboard state.
 * Prevents default behavior for Space key to avoid page scrolling.
 * 
 * Supported keys:
 * - Arrow Keys: Movement and actions
 * - Space: Jump (prevents page scroll)
 * - D: Throw bottle action  
 * - F: Special beam attack
 * 
 * @param {KeyboardEvent} e - The keydown event object
 */
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
            e.preventDefault();
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
/**
 * Keyboard input handler for keyup events.
 * Resets keyboard state when keys are released to stop continuous actions.
 * Prevents default behavior for Space key to avoid page scrolling.
 * 
 * @param {KeyboardEvent} e - The keyup event object
 */
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
            e.preventDefault();
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
const handleOrientationChange = () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        const isPortrait = window.innerHeight > window.innerWidth;
        const portraitMessage = document.getElementById('portrait-message');
        
        if (isPortrait && portraitMessage) {
            portraitMessage.style.display = 'flex';
        } else if (portraitMessage) {
            portraitMessage.style.display = 'none';
        }
    }
};

// Initialize portrait message on page load
document.addEventListener('DOMContentLoaded', () => {
    handleOrientationChange();
});

// Handle orientation changes
window.addEventListener('orientationchange', () => {
    setTimeout(handleOrientationChange, 100);
});

window.addEventListener('resize', handleOrientationChange);

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