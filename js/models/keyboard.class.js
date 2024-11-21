/**
 * The Keyboard class manages the state of keys used for character movement and actions.
 */
class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    DOWN = false;
    SPACE = false;
    D = false;

    THROW_REQUEST_STOP = new Date().getTime();
    THROW_REQUEST_START = 0;

    constructor() {
        this.bindKeyPressEvents();
        this.bindBtsPressEvents();
    }

   /**
 * Binds touch events for mobile controls.
 */
bindBtsPressEvents() {
    this.bindTouchEvent('mobileLeft', 'LEFT');
    this.bindTouchEvent('mobileRight', 'RIGHT');
    this.bindTouchEvent('mobileUp', 'SPACE');
    this.bindTouchEvent('mobileBottle', 'D');
}

/**
 * Helper function to bind touch events for a specific element and state key.
 * @param {string} elementId - The ID of the HTML element.
 * @param {string} stateKey - The state property to modify.
 */
bindTouchEvent(elementId, stateKey) {
    const element = document.getElementById(elementId);
    if (element) {
        element.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this[stateKey] = true;
        });
        element.addEventListener('touchend', (e) => {
            e.preventDefault();
            this[stateKey] = false;
        });
    }
}

    /**
 * Binds key press events for keyboard controls.
 */
bindKeyPressEvents() {
    const keyMappings = {
        39: 'RIGHT', 
        37: 'LEFT',  
        38: 'UP',    
        40: 'DOWN', 
        32: 'SPACE', 
        68: 'D'      
    };
    this.bindKeyEvents(keyMappings);
}

/**
 * Helper function to bind keydown and keyup events based on a mapping.
 * @param {Object} keyMappings - A mapping of key codes to state properties.
 */
bindKeyEvents(keyMappings) {
    window.addEventListener('keydown', (e) => {
        if (keyMappings[e.keyCode]) {
            e.preventDefault();
            this[keyMappings[e.keyCode]] = true;
        }
    });
    window.addEventListener('keyup', (e) => {
        if (keyMappings[e.keyCode]) {
            this[keyMappings[e.keyCode]] = false;
        }
    });
}
}