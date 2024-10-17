class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBarHealth = new StatusBar('health');
    statusBarCoins = new StatusBar('coin');
    statusBarBottles = new StatusBar('bottle');
    throwableObjects = [];
    chickenGenerationEnabled = true;
    coins = []; 

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.createCoins();
        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld() {
        this.character.world = this;
    }

    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();
        }, 1000);
    }

    checkThrowObjects() {
        if (this.keyboard.D) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObjects.push(bottle);
        }
    }

    checkCollisions() {
        // Überprüfe Kollisionen mit Feinden (Chickens und Endboss)
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                this.character.hit();  // Charakter erleidet Schaden
                this.statusBarHealth.setPercentage(this.character.energy);  // Aktualisiere die Health StatusBar
            }
        });
    }

    createCoins() {
        // Coins an verschiedenen Positionen erstellen
        this.coins.push(new Coin(300, 350));  // Coin bei x=300, y=350
        this.coins.push(new Coin(600, 250));  // Coin bei x=600, y=250
        this.coins.push(new Coin(1000, 300)); // Coin bei x=1000, y=300
        this.coins.push(new Coin(1500, 200)); // Coin bei x=1500, y=200
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.coins);
        this.addToMap(this.character);
        if (!this.character.isDead() || this.character.y < 600) {
            this.addToMap(this.character);
        }
        this.addObjectsToMap(this.level.clouds);
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBarHealth);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusBarBottles);
        this.ctx.translate(this.camera_x, 0);
        this.addToMap(this.level.enemies[this.level.enemies.length - 1]); // Zeichne den Endboss
    
        // Entferne Chickens nur, wenn der Charakter den Endboss erreicht hat
        if (this.character.x >= this.level.enemies[this.level.enemies.length - 1].x - 500) {
            this.chickenGenerationEnabled = false;  // Stoppe die Generierung neuer Chickens
    
            // Entferne alle Chickens, sobald der Endboss sichtbar ist
            this.level.enemies = this.level.enemies.filter(enemy => enemy instanceof Endboss);
        } else {
            // Zeichne normale Feinde (Chickens) solange der Endboss nicht sichtbar ist
            this.addObjectsToMap(this.level.enemies.filter(enemy => !(enemy instanceof Endboss)));
        }
    
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0);
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }

        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    generateEnemies() {
        if (!this.chickenGenerationEnabled) return;
    }
    
}