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

    bindBtsPressEvents() {
        const mobileLeft = document.getElementById('mobileLeft');
        const mobileRight = document.getElementById('mobileRight');
        const mobileUp = document.getElementById('mobileUp');
        const mobileBottle = document.getElementById('mobileBottle');
        if (mobileLeft) {
            mobileLeft.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.LEFT = true; 
            });
            mobileLeft.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.LEFT = false;
            });
        }
        if (mobileRight) {
            mobileRight.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.RIGHT = true;
            });
            mobileRight.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.RIGHT = false;
            });
        }
        if (mobileUp) {
            mobileUp.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.SPACE = true;
            });
            mobileUp.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.SPACE = false;
            });
        }
        if (mobileBottle) {
            mobileBottle.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.D = true;
            });
            mobileBottle.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.D = false;
            });
        }
    }

    bindKeyPressEvents() {
        window.addEventListener("keydown", (e) => {
            if (e.keyCode == 39) {
                keyboard.RIGHT = true;
            }
            if (e.keyCode == 37) {
                keyboard.LEFT = true;
            }
            if (e.keyCode == 38) {
                keyboard.UP = true;
            }
            if (e.keyCode == 40) {
                keyboard.DOWN = true;
            }
            if (e.keyCode == 32) {
                keyboard.SPACE = true;
            }
            if (e.keyCode == 68) {
                keyboard.D = true;
            }
        });

        window.addEventListener("keyup", (e) => {
            if (e.keyCode == 39) {
                keyboard.RIGHT = false;
            }
            if (e.keyCode == 37) {
                keyboard.LEFT = false;
            }
            if (e.keyCode == 38) {
                keyboard.UP = false;
            }
            if (e.keyCode == 40) {
                keyboard.DOWN = false;
            }
            if (e.keyCode == 32) {
                keyboard.SPACE = false;
            }
            if (e.keyCode == 68) {
                keyboard.D = false;
            }
        });
    }
}