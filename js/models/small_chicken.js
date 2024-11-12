/**
 * SmallChicken class represents a smaller, weaker version of the enemy chicken.
 */
class SmallChicken extends MovableObject {
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];
    isDead = false;
    moveInterval;
    animationInterval;

    /**
     * Initializes the SmallChicken at a specific x-position with random speed and sets its walking images.
     * @param {number} xPosition - The initial x-position of the SmallChicken.
     */
    constructor(xPosition) {
        super();
        this.x = xPosition;
        this.y = 370;
        this.width = 50;
        this.height = 50;
        this.speed = 0.1 + Math.random() * 0.3;
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.animate();
    }

    /**
     * Animates the SmallChicken by moving it left and playing the walking animation.
     */
    animate() {
        this.moveInterval = setInterval(() => {
            if (!this.isDead) {
                this.moveLeft();
            }
        }, 1000 / 60);
        this.animationInterval = setInterval(() => {
            if (!this.isDead) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 150);
    }

    /**
     * Handles the death of the SmallChicken by stopping its movement and changing its image to the dead state.
     */
    die() {
        this.isDead = true;
        this.loadImage(this.IMAGES_DEAD[0]);
        clearInterval(this.moveInterval);
        clearInterval(this.animationInterval);
    }

    /**
     * Resets the SmallChicken's movement properties to make it active again.
     */
    resetMovement() {
        this.speed = 0.15; 
        this.isDead = false; 
        this.animate(); 
    }
}