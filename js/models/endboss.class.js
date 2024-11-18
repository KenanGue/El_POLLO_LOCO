/**
 * The Endboss class defines the behavior and animations for the end-level boss.
 */
class Endboss extends MovableObject {
    height = 300;
    width = 200;
    y = 150;
    energy = 100;
    speedX = 3;

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

    currentState = 'walking';
    direction = 'left';
    alertTriggered = false;
    minX = 5100;
    maxX = 5200;
    animationCooldown = false;

    /**
     * Initializes the Endboss with properties, images, and animations.
     */
    constructor() {
        super();
        this.speedX = 2;
        this.deadAnimationPlayed = false;
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = this.maxX;
        this.y = 150;
        this.animate();
    }

    /**
     * Reduces the endboss's energy and plays the hurt animation.
     * Transitions to attack state after a short delay unless the boss is dead.
     */
    hit() {
        if (!this.isDead() && !this.hitAlready) {
            this.energy -= Math.min(20, this.energy);  
            this.energy = Math.max(0, this.energy);
            this.hitAlready = true;
            this.changeState('hurt');
            setTimeout(() => {
                this.hitAlready = false;
                if (!this.isDead()) {
                    this.changeState('attack');
                }
            }, 1000); 
        }
    }

    /**
     * Checks if the endboss is dead (energy is 0) and initiates the death animation.
     * Removes the endboss from the world after the animation finishes.
     * @returns {boolean} True if the endboss is dead, otherwise false.
     */
    isDead() {
        if (this.energy === 0 && this.currentState !== 'dead') {
            this.changeState('dead');
        }
        return this.energy === 0;
    }

    /**
     * Changes the state of the endboss, triggering corresponding animations.
     * @param {string} state - The new state (walking, alert, attack, hurt, dead).
     */
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
        } else if (state === 'dead' && !this.deadAnimationPlayed) {
            this.playDeadAnimation();
        }
    }
    
    /**
     * Plays the death animation of the endboss once and stops at the last frame.
     * Ensures that the animation does not repeat and sets the final image.
    */
    playDeadAnimation() {
        let frameIndex = 0;
        this.deadAnimationPlayed = true;
        const deadAnimationInterval = setInterval(() => {
            if (frameIndex < this.IMAGES_DEAD.length) {
                this.img = this.imageCache[this.IMAGES_DEAD[frameIndex]];
                frameIndex++;
            } else {
                clearInterval(deadAnimationInterval);
                this.img = this.imageCache[this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]];
            }
        }, 200);
    }

    /**
     * Animates the endboss by moving and playing the current state's animation.
     */
    animate() {
        setInterval(() => {
            if (this.currentState === 'walking' || this.currentState === 'attack') {
                this.move();
            }
            this.playCurrentStateAnimation();
        }, 150);
    }

    /**
     * Plays the current state's animation based on the endboss's state.
     */
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
            this.playAnimation(this.IMAGES_DEAD);
            this.deadAnimationPlayed = true;
            setTimeout(() => {
                this.img = this.imageCache[this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]];
                this.applyGravity();
            }, this.IMAGES_DEAD.length * 150);
        }
    }

    /**
     * Moves the endboss left or right within its allowed movement boundaries.
     */
    move() {
        if (this.currentState === 'attack' || this.currentState === 'walking') {
            if (this.direction === 'left') {
                this.moveLeft();
            } else if (this.direction === 'right') {
                this.moveRight();
            }
        }
    }

    /**
     * Applies gravity to the endboss, used when it "falls" after being defeated.
     */
    applyGravity() {
        let gravityInterval = setInterval(() => {
            if (this.y < 500) {
                this.y += 5;
            } else {
                clearInterval(gravityInterval);
            }
        }, 1000 / 25);
    }

    /**
     * Triggers the alert state if the player is nearby and prepares the endboss to attack.
     * @param {Character} player - The player character object.
     */
    alertIfPlayerNearby(player) {
        const distance = Math.abs(this.x - player.x);
        if (!this.alertTriggered && distance < 700) {
            this.changeState('alert');
            this.alertTriggered = true;
            setTimeout(() => {
                this.changeState('attack');
            }, this.IMAGES_ALERT.length * 150);
        }
        if (distance < 500) {
            this.followPlayer(player);
        }
    }

    /**
     * Adjusts the movement direction of the endboss to follow the player's position.
     * The endboss moves left or right depending on the player's location.
     * Alternates between attacking and walking states after a cooldown.
     * 
     * @param {Character} player - The player character object.
    */
    followPlayer(player) {
        if (player.x < this.x) {
            this.direction = 'left';
            this.moveLeft();
        } else if (player.x > this.x) {
            this.direction = 'right';
            this.moveRight();
        }
        if (!this.animationCooldown) {
            this.animationCooldown = true;
            setTimeout(() => {
                if (this.currentState === 'walking') {
                    this.changeState('attack');
                } else {
                    this.changeState('walking');
                }
                this.animationCooldown = false;
            }, 500);
        }
    }

    /**
     * Resets the movement parameters and reinitializes animations for the endboss.
     */
    resetMovement() {
        this.speedX = 3;
        this.deadAnimationPlayed = false;
        this.alertTriggered = false;
        this.currentState = 'walking';
        this.animate();
    }

}