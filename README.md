# El Pollo Loco - Game Documentation

## Overview

El Pollo Loco is a 2D side-scrolling platform game built with vanilla JavaScript and HTML5 Canvas. The game features a character navigating through a desert environment, collecting items, avoiding enemies, and facing off against a final boss.

## Architecture

The game follows an object-oriented architecture with clear separation of concerns:

### Base Classes
- **DrawableObject**: Foundation for all visual game elements
- **MovableObject**: Extends DrawableObject with physics and collision
- **CollectibleObject**: Base for items that can be collected

### Core Systems
- **World**: Main game orchestrator managing all systems
- **Level**: Container for all level objects and boundaries  
- **Keyboard**: Input state management
- **Game**: Application lifecycle and event handling

### Manager Classes
- **CameraManager**: Smooth camera transitions and positioning
- **CollisionDetector**: All collision detection logic
- **InputHandler**: Mouse/touch input processing
- **Renderer**: Rendering operations and layering
- **Character Managers**: Specialized animation, movement, and action handling

### Entities
- **Character**: Player character with animations and abilities
- **Enemies**: Chickens and Endboss with AI behaviors
- **Collectibles**: Bottles and coins with collection mechanics

### Environment
- **BackgroundObject**: Layered scenery and parallax backgrounds
- **Cloud**: Animated atmospheric elements

### UI Components
- **Status Bars**: Health, coins, hot sauce ammunition displays
- **Controls**: Mute button, fullscreen toggle

## Features

- **Smooth Camera System**: Adaptive speeds for different movement states
- **Physics Engine**: Gravity, jumping, collision detection
- **Animation System**: Multiple character states with frame management
- **Audio Management**: Sound effects with mute capability
- **Responsive Design**: Fullscreen support with proper scaling
- **Persistent Settings**: User preferences saved in localStorage

## Getting Started

1. Open `index.html` in a modern web browser
2. Click "Start Game" to begin
3. Use arrow keys or on-screen controls to move
4. Press D to throw bottles, F for special moves

## Controls

- **Arrow Keys**: Movement and jumping
- **D**: Throw hot sauce bottles (requires ammunition)
- **F**: Special beam attack (requires full coin meter)
- **Space**: Jump (same as Up arrow)

## Documentation Generation

Generate full API documentation using JSDoc:

```bash
# Install JSDoc globally
npm install -g jsdoc

# Generate documentation
jsdoc -c jsdoc.json

# Open docs/index.html in browser
```

## Code Quality

The codebase features:
- Comprehensive JSDoc annotations
- Modular architecture with single responsibility principle
- Clean separation between game logic and presentation
- Consistent naming conventions and code style
- Type information for better IDE support