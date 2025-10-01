/**
 * Keyboard input state manager for the game.
 * Tracks the current state of all game-relevant keys (pressed/released).
 * Updated by event listeners in the main game loop.
 * 
 * @class Keyboard
 * @example
 * const keyboard = new Keyboard();
 * // Used in game loop:
 * if (keyboard.LEFT) {
 *     character.moveLeft();
 * }
 */
class Keyboard {
    /** @type {boolean} Left arrow key or A key state */
    LEFT = false;
    
    /** @type {boolean} Right arrow key or D key state */
    RIGHT = false;
    
    /** @type {boolean} Up arrow key or W key state */
    UP = false;
    
    /** @type {boolean} Down arrow key or S key state */
    DOWN = false;
    
    /** @type {boolean} Spacebar key state (jump action) */
    SPACE = false;
    
    /** @type {boolean} D key state (throw bottle action) */
    D = false;
    
    /** @type {boolean} F key state (special move action) */
    F = false;
}