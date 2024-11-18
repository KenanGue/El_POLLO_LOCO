/**
 * ThrowableObject class represents a throwable object (e.g., bottle) with animations for rotation and splash.
 */
class ThrowableObject extends MovableObject {
    IMAGES_BOTTLE = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];
    IMAGES_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    /**
     * Initializes a ThrowableObject at a given position and starts its throw and rotation animations.
     * @param {number} x - The initial x-coordinate of the throwable object.
     * @param {number} y - The initial y-coordinate of the throwable object.
     */
    constructor(x, y) {
        super().loadImage(this.IMAGES_BOTTLE[0]); 
        this.loadImages(this.IMAGES_BOTTLE);      
        this.loadImages(this.IMAGES_SPLASH);       
        this.x = x;
        this.y = y;
        this.height = 100;
        this.width = 80;
        this.throw();
        this.animateRotation(); 
    }

    /**
     * Simulates the throw action by applying gravity and moving the object horizontally.
     */
    throw() {
        this.speedY = 30;
        this.applyGravity();
        this.throwInterval = setInterval(() => {
            this.x += 10;
        }, 25);
        if (this.world) {
            this.world.statusBarBottles.useItem();
        }
    }
    
    /**
     * Starts the rotation animation for the throwable object.
     */
    animateRotation() {
        this.rotationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_BOTTLE);  
        }, 50);  
    }

    /**
     * Plays the splash animation when the object hits a target, then hides it after the animation ends.
     */
    playSplashAnimation() {
        clearInterval(this.rotationInterval);
        clearInterval(this.throwInterval);
        this.speedY = 0;
        let frameIndex = 0;
            this.splashInterval = setInterval(() => {
            if (frameIndex < this.IMAGES_SPLASH.length) {
                this.img = this.imageCache[this.IMAGES_SPLASH[frameIndex]];
                frameIndex++;
            } else {
                clearInterval(this.splashInterval); 
                this.isVisible = false; 
            }
        }, 100); 
    }
}
