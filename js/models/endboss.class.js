class Endboss extends MovableObject {
    height = 300;
    width = 200;
    y = 150;
    energy = 100;  // Startenergie des Endbosses bei 100 (entspricht 5 Treffern)
    speedX = 3;  // Geschwindigkeit für horizontale Bewegung

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];
    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];
    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];
    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];
    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    currentState = 'walking';  // Aktueller Zustand des Endbosses
    direction = 'left';  // Richtung, in die sich der Endboss bewegt
    alertTriggered = false;  // Überprüft, ob der Alert bereits getriggert wurde
    minX = 5100;  // Minimale x-Position
    maxX = 5200;

    constructor() {
        super();
        this.speedX = 3;
        this.deadAnimationPlayed = false;
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = this.maxX;  // Anfangsposition des Endbosses
        this.y = 150; 
        this.animate();
    }

    hit() {
        if (!this.isDead() && !this.hitAlready) {
            this.energy -= Math.min(20, this.energy);  // Reduziere die Energie, aber niemals mehr als die verbleibende Energie
            this.energy = Math.max(0, this.energy);  // Stelle sicher, dass die Energie nicht negativ wird
            this.hitAlready = true;
            this.changeState('hurt');  // Wechsel zu 'hurt'
            setTimeout(() => {
                this.hitAlready = false;
                if (!this.isDead()) {
                    this.changeState('attack');  // Zurück zu 'walking' nach 'hurt'
                }
            }, 500);  // Nach 500ms wieder zurück zum "walking"-Zustand
        } else if (this.isDead()) {
        }
    }

    isDead() {
        if (this.energy === 0 && this.currentState !== 'dead') {
            this.changeState('dead');  // Wechsle in den Zustand 'dead'
            setTimeout(() => {
                // Entferne den Endboss nach der Sterbeanimation
                this.removeFromWorld();
            }, this.IMAGES_DEAD.length * 150);  // Warte, bis die Sterbeanimation vollständig abgespielt ist
        }
        return this.energy === 0;
    }

    changeState(state) {
        this.currentState = state;
        if (state === 'walking') {
            this.playAnimation(this.IMAGES_WALKING);
        } else if (state === 'alert') {
            this.playAnimation(this.IMAGES_ALERT);
        } else if (state === 'attack') {
            this.playAnimation(this.IMAGES_ATTACK);
        } else if (state === 'hurt') {
            this.playAnimation(this.IMAGES_HURT);
        } else if (state === 'dead') {
            this.playAnimation(this.IMAGES_DEAD);
        }
    }

    animate() {
        setInterval(() => {
            if (this.currentState === 'walking' || this.currentState === 'attack') {  // Bewegung auch im 'attack'-Zustand
                this.move();  // Endboss bewegt sich im 'walking' oder 'attack' Zustand
            }
            this.playCurrentStateAnimation();  // Spielt die Animation für den aktuellen Zustand
        }, 150);
    }
    

    playCurrentStateAnimation() {
        if (this.currentState === 'walking') {
            this.playAnimation(this.IMAGES_WALKING);
        } else if (this.currentState === 'alert') {
            this.playAnimation(this.IMAGES_ALERT);
        } else if (this.currentState === 'attack') {
            this.playAnimation(this.IMAGES_ATTACK);
        } else if (this.currentState === 'hurt') {
            this.playAnimation(this.IMAGES_HURT);
        } else if (this.currentState === 'dead' && !this.deadAnimationPlayed) {
            // Abspielen der Sterbeanimation nur einmal
            this.playAnimation(this.IMAGES_DEAD);
            this.deadAnimationPlayed = true;  // Markiere als abgespielt
    
            // Setze das letzte Bild der `dead`-Animation fest
            setTimeout(() => {
                this.img = this.imageCache[this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]];  // Zeige das letzte Bild
                this.applyGravity();  // Lasse den Endboss nach unten fallen
            }, this.IMAGES_DEAD.length * 150);  // Wartezeit basierend auf der Länge der Sterbeanimation
        }
    }
    
    

    move() {
        if (this.direction === 'left') {
            this.moveLeft();
            if (this.x <= this.minX) {
                this.direction = 'right';  // Richtung ändern, wenn die minimale Position erreicht wird
            }
        } else if (this.direction === 'right') {
            this.moveRight();
            if (this.x >= this.maxX) {
                this.direction = 'left';  // Richtung ändern, wenn die maximale Position erreicht wird
            }
        }
    }
    
    applyGravity() {
        let gravityInterval = setInterval(() => {
            if (this.y < 500) {  // Lässt den Endboss nur bis zu einer bestimmten Höhe fallen (z.B. y = 500)
                this.y += 5;  // Geschwindigkeit des Falls
            } else {
                clearInterval(gravityInterval);  // Stoppt die Schwerkraft, wenn der Endboss den Boden erreicht
            }
        }, 1000 / 25);
    }

    alertIfPlayerNearby(player) {
        if (!this.alertTriggered && Math.abs(this.x - player.x) < 700) {
            this.changeState('alert');
            this.alertTriggered = true;

            setTimeout(() => {
                this.changeState('attack');  // Wechsel zu 'attack' nach Alert-Animation
            }, this.IMAGES_ALERT.length * 150);  // Wartezeit entsprechend der Alert-Animation
        }
    }
}
