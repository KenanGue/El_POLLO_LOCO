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
    collectibles = [];
    collectedBottles = 0;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.createCoins();
        this.createBottles();
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
                this.character.hit();
                this.statusBarHealth.setPercentage(this.character.energy);
            }
        });
    
        // Überprüfe Kollisionen mit Flaschen
        this.collectibles = this.collectibles.filter(collectible => {
            if (collectible instanceof CollectibleObjects && collectible.type === 'bottle' && this.character.isColliding(collectible)) {
                console.log('Flasche eingesammelt!');
                this.statusBarBottles.collectItem();  // **Aktualisiere die Flaschen-Statusbar**
                return false;  // **Entferne die Flasche**
            }
            return true;
        });
    
        // **Neue Kollisionserkennung für Münzen hinzufügen**
        this.collectibles = this.collectibles.filter(collectible => {
            if (collectible instanceof CollectibleObjects && collectible.type === 'coin' && this.character.isColliding(collectible)) {
                console.log('Münze eingesammelt!');
                this.statusBarCoins.collectItem();  // **Aktualisiere die Münzen-Statusbar**
                return false;  // **Entferne die Münze**
            }
            return true;
        });
    }
    


    createCoins() {
        let totalDistance = 5000;  // Entfernung zum Endboss
        let numColletibles = 10;   // Anzahl der Coins
        let minY = 80;             // Minimale y-Position
        let maxY = 250;            // Maximale y-Position

        for (let i = 0; i < numColletibles; i++) {
            let xPosition = (totalDistance / numColletibles) * (i + 1);
            let yPosition = Math.random() * (maxY - minY) + minY;

            // Füge Coins hinzu (mit 'coin' als Typ)
            this.collectibles.push(new CollectibleObjects(xPosition, yPosition, 'coin'));
        }
    }

    createBottles() {
        let totalDistance = 4800;  // Entfernung zum Endboss
        let numBottles = 5;       // Anzahl der Flaschen
        let groundY = 310;         // y-Position für die Flaschen (auf dem Boden)

        for (let i = 0; i < numBottles; i++) {
            let xPosition = (totalDistance / numBottles) * (i + 1);
            // Füge Flaschen hinzu (mit 'bottle' als Typ)
            this.collectibles.push(new CollectibleObjects(xPosition, groundY, 'bottle'));
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.collectibles);
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