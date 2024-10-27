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

    constructor(x, y) {
        super().loadImage(this.IMAGES_BOTTLE[0]);  // Initialisiere mit dem ersten Rotationsbild
        this.loadImages(this.IMAGES_BOTTLE);       // Lade alle Rotationsbilder
        this.loadImages(this.IMAGES_SPLASH);       // Lade alle Splash-Bilder
        this.x = x;
        this.y = y;
        this.height = 100;
        this.width = 80;
        this.throw();
        this.animateRotation();  // Starte die Rotationsanimation
    }

    throw() {
        this.speedY = 30;
        this.applyGravity();
        this.throwInterval = setInterval(() => {
            this.x += 10;  // Bewegung der Flasche nach rechts
        }, 25);
    }

    animateRotation() {
        this.rotationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_BOTTLE);  // Spiele die Rotationsanimation ab
        }, 50);  // Wechsle die Bilder alle 50ms für eine flüssige Rotation
    }

    playSplashAnimation() {
        clearInterval(this.rotationInterval);  // Stoppe die Rotationsanimation
        clearInterval(this.throwInterval);     // Stoppe die Bewegung der Flasche auf der X-Achse
        this.speedY = 0;  // Stoppe die Bewegung der Flasche auf der Y-Achse
        this.playAnimation(this.IMAGES_SPLASH);  // Spiele die Splash-Animation ab

        // Entferne die Flasche nach der Splash-Animation (nach 1000ms)
        setTimeout(() => {
            this.isVisible = false;  // Setze die Flasche auf unsichtbar, damit sie verschwindet
        }, 1000);  // 1000ms für die Splash-Animation
    }
}
