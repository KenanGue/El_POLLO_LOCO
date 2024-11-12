
/**
 * The Cloud class represents a moving cloud in the background.
 */class Cloud extends MovableObject {
    y = 0;
    width = 500;
    height = 400;
    static imageIndex = 0;
    speed = 0.1;

     /**
     * Initializes the Cloud at a specific x-position and sets alternating images.
     * @param {number} xPosition - The initial x-position of the cloud.
     */
    constructor(xPosition) {
        super();
        this.x = xPosition;
        this.loadImageAlternating();
        Cloud.imageIndex++;
        this.animate();
    }

     /**
     * Loads alternating images for clouds based on their index for visual variety.
     */
    loadImageAlternating() {
        if (Cloud.imageIndex % 2 === 0) {
            this.loadImage('img/5_background/layers/4_clouds/1.png');
        } else {
            this.loadImage('img/5_background/layers/4_clouds/2.png');
        }
    }

    /**
     * Animates the cloud by moving it left continuously.
     * Resets the cloud's position to the right edge when it moves off the screen.
     */
    animate() {
        setInterval(() => {
            this.moveLeft();
            if (this.x < -this.width) {
                this.x = 7200; 
            }
        }, 1000 / 60);
    }

    /**
     * Moves the cloud to the left at a constant speed.
     */
    moveLeft() {
        this.x -= this.speed; 
    }
}
