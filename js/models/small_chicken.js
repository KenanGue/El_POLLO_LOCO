class SmallChicken extends MovableObject {
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    constructor(xPosition) {
        super();
        this.x = xPosition;
        this.y = 370;
        this.width = 50;
        this.height = 50;
        this.speed = 0.1 + Math.random() * 0.3;

        // Stelle sicher, dass das erste Bild gesetzt ist
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING); // Lade alle Bilder
        this.animate(); // Starte die Animation
        this.moveLeft(); // Bewegung nach links starten
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200); // Wechselt die Animation alle 200ms
    }

    moveLeft() {
        setInterval(() => {
            this.x -= this.speed; // Bewege das kleine Huhn nach links
        }, 1000 / 60); // 60 FPS
    }
}

