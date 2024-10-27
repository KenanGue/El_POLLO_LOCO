class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    speedX = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    invulnerableDuration = 1000; 

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
        return this.y < 160;
    }
    }

    isColliding(mo) {
        return this.x + this.width > mo.x &&
        this.y + this.height > mo.y &&
        this.x < mo.x + mo.width &&
        this.y < mo.y + mo.height;
    }

    hit() {
        let currentTime = new Date().getTime();

        // Prüfen, ob genug Zeit seit dem letzten Treffer vergangen ist (Unverwundbarkeitsphase)
        if (currentTime - this.lastHit > this.invulnerableDuration) {
            this.energy -= 10;  // Reduziere die Energie um 10 Punkte
            if (this.energy < 0) {
                this.energy = 0;
            } else {
                this.lastHit = currentTime;  // Setze den Zeitpunkt des letzten Treffers neu
            }
        }
    }
    
    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        return timePassed / 1000 < 1;  // Rückgabe, ob der Charakter noch in der Unverwundbarkeitsphase ist
    }
    
    isDead() {
        return this.energy == 0;
    }

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    moveRight() {
        console.log("Moving right, speedX:", this.speedX);  // Debug-Meldung
        this.x += this.speedX > 0 ? this.speedX : this.speed;
    }

    moveLeft() {
        console.log("Moving left, speedX:", this.speedX);  // Debug-Meldung
        this.x -= this.speedX > 0 ? this.speedX : this.speed;
    }


    jump() {
        this.speedY = 30;
    }

}