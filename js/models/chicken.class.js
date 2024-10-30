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
    moveInterval;  // Speichert das Bewegungsintervall
    animationInterval;  // Speichert das Animationsintervall

    constructor(xPosition) {
        super();
        this.loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.x = xPosition;
        this.y = 350;
        this.speed = 0.15 + Math.random() * 0.5;
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
        this.isDead = true;  // Setze das Huhn auf "tot"
        this.loadImage(this.IMAGES_DEAD[0]);  // Wechsle zur "tot"-Animation

        // Stoppe alle laufenden Intervalle
        clearInterval(this.moveInterval);
        clearInterval(this.animationInterval);
    }
}