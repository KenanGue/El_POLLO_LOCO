/**
 * MovableObject class defines behavior for game objects that can move, including applying gravity and collision detection.
 */
class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    speedX = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    invulnerableDuration = 1000; 

    /**
     * Applies gravity to the object, causing it to fall if above ground level.
     */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    /**
     * Checks if the object is above ground level.
     * @returns {boolean} True if above ground.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
        return this.y < 160;
    }
    }

    /**
     * Checks for collision with another MovableObject.
     * @param {MovableObject} mo - The object to check collision with.
     * @returns {boolean} True if colliding with the specified object.
     */
    isColliding(mo, fromBelow = false) {
        const horizontalOffset = 60; 
        const verticalOffset = 10; 
        const colliding = 
            this.x + this.width - horizontalOffset > mo.x &&
            this.x + horizontalOffset < mo.x + mo.width &&
            this.y + this.height - verticalOffset > mo.y &&
            this.y + verticalOffset < mo.y + mo.height;
        if (fromBelow) {
            return colliding && this.speedY > 0 && this.y + this.height < mo.y + mo.height;
        }
        return colliding;
    }
    
    /**
     * Reduces the object's energy upon being hit, with a cooldown period for invulnerability.
     */
    hit() {
        let currentTime = new Date().getTime();
        if (currentTime - this.lastHit > this.invulnerableDuration) {
            this.energy -= 10;  
            if (this.energy < 0) {
                this.energy = 0;
            } else {
                this.lastHit = currentTime;  
            }
        }
    }
    
    /**
     * Checks if the object is currently hurt (i.e., recently hit).
     * @returns {boolean} True if the object is hurt.
     */
    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        return timePassed / 1000 < 1;  
    }
    
    /**
     * Checks if the object is dead (energy is 0).
     * @returns {boolean} True if the object is dead.
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Plays an animation by cycling through the provided image array.
     * @param {Array<string>} images - Array of image paths to animate.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Moves the object to the right, applying speed.
     */
    moveRight() {
        this.x += this.speedX > 0 ? this.speedX : this.speed;
    }

    /**
     * Moves the object to the left, applying speed.
     */
    moveLeft() {
        this.x -= this.speedX > 0 ? this.speedX : this.speed;
    }

    /**
     * Makes the object jump by setting its vertical speed.
     */
    jump() {
        this.speedY = 30;
    }

    /**
     * Marks the object for removal from the game world.
     */
    removeFromWorld() {
        this.markedForRemoval = true; 
    }

}