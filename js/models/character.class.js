/**
 * The Character class represents the player's character, including animations and sounds for actions.
 */
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

    /**
    * Initializes the Character with animations, sounds, and applies gravity.
    * @param {Object} world - Reference to the game world.
    */
    constructor(world) {
        super();
        this.world = world;
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

    /**
     * Animates the character based on keyboard input.
     * Initializes all animation intervals.
    */
    animate() {
        this.setupIdleAnimation();
        this.setupWalkRightAnimation();
        this.setupWalkLeftAnimation();
        this.setupActionAnimation();
    }

    /**
     * Handles idle animations based on inactivity duration.
     */
    setupIdleAnimation() {
        this.idleAnimationInterval = setInterval(() => {
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
    }

    /**
     * Handles walking animation and movement to the right.
     */
    setupWalkRightAnimation() {
        this.walkRightInterval = setInterval(() => {
            this.walking_sound.pause();
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
                this.walking_sound.play();
            }
        }, 1000 / 60);
    }

    /**
     * Handles walking animation and movement to the left, and jumping logic.
     */
    setupWalkLeftAnimation() {
        this.walkLeftInterval = setInterval(() => {
            if (this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                this.otherDirection = true;
                this.walking_sound.play();
            }
            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.jump();
                this.jumping_sound.play();
            }
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);
    }

    /**
     * Handles specific action animations like death, hurt, and jumping.
     * Splits the logic into smaller methods for clarity.
     */
    setupActionAnimation() {
        this.actionInterval = setInterval(() => {
            if (this.isDead()) {
                this.handleDeathAnimation();
            } else if (this.isHurt()) {
                this.handleHurtAnimation();
            } else if (this.isAboveGround()) {
                this.handleJumpingAnimation();
            } else {
                this.handleWalkingAnimation();
            }
        }, 50);
    }

    /**
     * Plays the death animation and manages related logic.
     */
    handleDeathAnimation() {
        this.playAnimation(this.IMAGES_DEAD);
        this.fallDown();
        if (!this.isDeadSoundPlayed) {
            this.dead_sound.play();
            this.isDeadSoundPlayed = true;
        }
    }

    /**
     * Plays the hurt animation and sound.
     */
    handleHurtAnimation() {
        this.playAnimation(this.IMAGES_HURT);
        this.hurt_sound.play();
    }

    /**
     * Plays the jumping animation.
     */
    handleJumpingAnimation() {
        this.playAnimation(this.IMAGES_JUMPING);
    }

    /**
     * Plays the walking animation if the character is moving.
     */
    handleWalkingAnimation() {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    /**
     * Stops all animation intervals, used for pausing or ending the game.
     */
    stopIntervals() {
        clearInterval(this.idleAnimationInterval);
        clearInterval(this.walkRightInterval);
        clearInterval(this.walkLeftInterval);
        clearInterval(this.actionInterval);
    }

    /**
     * Causes the character to fall, simulating a falling effect for when the character is dead.
     */
    fallDown() {
        if (this.speedY === 0) {
            this.speedY = 20;
            this.speedX = 5;
        }
        this.y -= this.speedY;
        this.x += this.speedX;
        this.speedY -= this.acceleration;
        if (this.y > 600) {
            this.y = 600;
        }
    }

    /**
     * Makes the character jump by setting a vertical speed.
     */
    jump() {
        this.speedY = 31;
    }

    /**
     * Restarts the game by reinitializing the character.
     */
    restartGame() {
        this.character.stopIntervals();
        this.character = new Character(this);
    }

    setWorld() {
        this.character.world = this;
    }
    

}