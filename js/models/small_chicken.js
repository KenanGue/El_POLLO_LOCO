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

    die() {
        this.isDead = true;
        this.loadImage(this.IMAGES_DEAD[0]);

        // Stoppe alle laufenden Intervalle
        clearInterval(this.moveInterval);
        clearInterval(this.animationInterval);
    }
}