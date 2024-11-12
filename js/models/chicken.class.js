/**
 * The Chicken class represents an enemy chicken that moves and can be killed by the player.
 */
class Chicken extends MovableObject {
    height = 80;
    width = 100;
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];
    isDead = false;
    moveInterval;
    animationInterval;
    
    /**
     * Initializes the Chicken at a given x-position with random speed and sets animations.
     * @param {number} xPosition - Initial x-position of the chicken.
     */
    constructor(xPosition) {
        super();
        this.loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.x = xPosition;
        this.y = 350;
        this.speed = 0.15 + Math.random() * 0.5;
        this.animate();
    }

    /**
     * Animates the chicken's movement and walking animation.
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
     * Handles the chicken's death by changing its image and stopping animations.
     */
    die() {
        this.isDead = true;
        this.loadImage(this.IMAGES_DEAD[0]);
        clearInterval(this.moveInterval);
        clearInterval(this.animationInterval);
    }

    /**
     * Resets the chicken's movement properties to make it active again.
     */
    resetMovement() {
        this.speed = 0.15;
        this.isDead = false;
        this.animate();
    }


}