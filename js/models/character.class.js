class Character extends MovableObject {
    height = 260;
    width = 160;
    speed = 10;
    y = 80;
    x = 0;
    IMAGES_IDLE_SHORT = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];
    IMAGES_IDLE_LONG = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];
    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];
    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];
    world;
    camera_x = -100;
    walking_sound = new Audio('audio/walking.mp3');
    jumping_sound = new Audio('audio/jump.mp3');
    dead_sound = new Audio('audio/dead.mp3');
    hurt_sound = new Audio('audio/ouch.mp3');
    lastActionTime = 0;
    idleTimeThreshold = 5000;
    isDeadSoundPlayed = false;

    constructor() {
        super();
        this.loadImage('img/2_character_pepe/1_idle/idle/I-1.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE_LONG);
        this.loadImages(this.IMAGES_IDLE_SHORT);
        this.applyGravity();
        this.animate();
    }

    animate() {
        setInterval(() => {
            let currentTime = new Date().getTime();
            if (!this.world.keyboard.RIGHT && !this.world.keyboard.LEFT && !this.world.keyboard.SPACE) {
                if (currentTime - this.lastActionTime > this.idleTimeThreshold) {
                    this.playAnimation(this.IMAGES_IDLE_LONG);
                } else {
                    this.playAnimation(this.IMAGES_IDLE_SHORT);
                }
            } else {
                this.lastActionTime = currentTime;
            }
        }, 100);
        
        setInterval(() => {
            this.walking_sound.pause();
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
               // this.walking_sound.play();
            }
        }, 1000 / 60);

        setInterval(() => {
            if (this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                this.otherDirection = true;
               // this.walking_sound.play();
            }
            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.jump();
              //  this.jumping_sound.play();
            }
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);

        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
                this.fallDown();
                if (!this.isDeadSoundPlayed) {
                  //  this.dead_sound.play();
                    this.isDeadSoundPlayed = true;
                }
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
                //this.hurt_sound.play();
            } else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
            } else {
                if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    this.playAnimation(this.IMAGES_WALKING);
                }
            }
        }, 50);
    }

   fallDown() {
    if (this.speedY === 0) {
        this.speedY = 20;  // Anfangsgeschwindigkeit nach oben
        this.speedX = 5;   // Seitliche Bewegung nach rechts (oder links, wenn du möchtest)
    }

    // Schwerkraft anwenden (der Charakter fällt nach unten)
    this.y -= this.speedY;  // Nach oben bewegen
    this.x += this.speedX;  // Seitlich bewegen (optional)
    
    this.speedY -= this.acceleration;  // Geschwindigkeit verringert sich durch Schwerkraft

    // Charakter fällt nach unten, sobald die Geschwindigkeit negativ wird
    if (this.y > 600) {  // Wenn der Charakter den Bildschirm verlässt (y > 600)
        this.y = 600;  // Halte ihn außerhalb des Bildschirms
    }
}
    jump() {
        this.speedY = 30;
    }
}