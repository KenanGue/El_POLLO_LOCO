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
    statusBarEndboss = new StatusBar('endboss');
    throwableObjects = [];
    bottleThrown = false;  // Neues Flag, um zu überprüfen, ob bereits eine Flasche geworfen wurde
    collectibles = [];
    collectedBottles = 0;
    showingWinScreen = false;
    showingGameOverScreen = false;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.createCoins();
        this.createBottles();
        this.draw();
        this.setWorld();
        this.run();
        this.mouseMoveHandler = (event) => this.handleMouseMove(event);
        this.clickHandler = (event) => this.handleClick(event);
    }

    handleMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const isHovered = mouseX >= this.buttonX && mouseX <= this.buttonX + this.buttonWidth &&
                          mouseY >= this.buttonY && mouseY <= this.buttonY + this.buttonHeight;
    
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.currentImage, this.imageX, this.imageY, this.imageWidth, this.imageHeight);
        this.drawButton(isHovered);
    }
    
    handleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
    
        if (clickX >= this.buttonX && clickX <= this.buttonX + this.buttonWidth &&
            clickY >= this.buttonY && clickY <= this.buttonY + this.buttonHeight) {
            console.log("Erneut spielen-Button geklickt");
            this.canvas.removeEventListener('mousemove', this.mouseMoveHandler);
            this.canvas.removeEventListener('click', this.clickHandler);
            this.restartGame();
        }
    }
    

    restartGame() {
        // Spielzustände zurücksetzen
        this.showingWinScreen = false;
        this.showingGameOverScreen = false;
        if (this.runInterval) clearInterval(this.runInterval);
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        
        // Charakter und Level neu initialisieren
        this.character.stopIntervals();
        this.character = new Character(this);
        this.level = level1;
    
        // Statusleisten zurücksetzen
        this.statusBarHealth.reset();
        this.statusBarCoins.reset();
        this.statusBarBottles.reset();
        this.statusBarEndboss.reset();
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        // Canvas zurücksetzen und Event-Listener entfernen
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.removeEventListener('mousemove', this.mouseMoveHandler);
        this.canvas.removeEventListener('click', this.clickHandler);
    
        // Spielvariablen neu initialisieren
        this.throwableObjects = [];
        this.collectibles = [];
        this.createCoins();
    this.createBottles();
        this.collectedBottles = 0;
    
        // Zeichnung und Spiel-Loop starten
        this.draw();
        this.run();
    }
    
    
    
    showGameOverScreen() {
        if (this.showingGameOverScreen) return;  // Verhindert mehrfachen Aufruf
        this.showingGameOverScreen = true;
    
        // Canvas leeren und Game-Over-Bild laden
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let img = new Image();
        img.src = 'img/9_intro_outro_screens/game_over/game over!.png';
    
        img.onload = () => {
            let scaleFactor = 0.5;
            let width = img.width * scaleFactor;
            let height = img.height * scaleFactor;
            let x = (this.canvas.width - width) / 2;
            let y = (this.canvas.height - height) / 2;
    
            // Zeichne das Game-Over-Bild
            this.ctx.drawImage(img, x, y, width, height);
    
            // Setze die Position und Größe des Buttons
            let buttonX = x + width / 2 - 50;
            let buttonY = (this.canvas.height / 2) + 100;
            let buttonWidth = 120;
            let buttonHeight = 40;
    
            // Funktion zum Zeichnen des Buttons mit Hover-Effekt
            const drawButton = (isHovered) => {
                this.ctx.fillStyle = isHovered ? "#FFB347" : "#FFA500";  // Hellerer Orange-Ton bei Hover
                this.ctx.strokeStyle = "black";  // Randfarbe des Buttons
                this.ctx.lineWidth = 3;
    
                this.ctx.beginPath();
                this.ctx.moveTo(buttonX + 10, buttonY);
                this.ctx.lineTo(buttonX + buttonWidth - 10, buttonY);
                this.ctx.arcTo(buttonX + buttonWidth, buttonY, buttonX + buttonWidth, buttonY + 10, 10);
                this.ctx.lineTo(buttonX + buttonWidth, buttonY + buttonHeight - 10);
                this.ctx.arcTo(buttonX + buttonWidth, buttonY + buttonHeight, buttonX + buttonWidth - 10, buttonY + buttonHeight, 10);
                this.ctx.lineTo(buttonX + 10, buttonY + buttonHeight);
                this.ctx.arcTo(buttonX, buttonY + buttonHeight, buttonX, buttonY + buttonHeight - 10, 10);
                this.ctx.lineTo(buttonX, buttonY + 10);
                this.ctx.arcTo(buttonX, buttonY, buttonX + 10, buttonY, 10);
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.stroke();
    
                // Text im Button zentriert platzieren und Schriftattribute ändern bei Hover
                this.ctx.fillStyle = isHovered ? "white" : "black";  // Schriftfarbe weiß bei Hover
                this.ctx.font = isHovered ? "20px western" : "18px western";  // Schriftgröße um 4px vergrößern bei Hover
                this.ctx.textAlign = "center";
                this.ctx.textBaseline = "middle";
                this.ctx.fillText("Erneut spielen", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);
            };
    
            // Zeichne den Button das erste Mal ohne Hover-Effekt
            drawButton(false);
    
            // Event-Listener für den Hover-Effekt
            const mouseMoveHandler = (event) => {
                const rect = this.canvas.getBoundingClientRect();
                const mouseX = event.clientX - rect.left;
                const mouseY = event.clientY - rect.top;
    
                // Prüfe, ob der Mauszeiger über dem Button ist
                const isHovered = mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
                                  mouseY >= buttonY && mouseY <= buttonY + buttonHeight;
    
                // Leere den Canvas und zeichne alles neu, einschließlich des Hover-Effekts für den Button
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.drawImage(img, x, y, width, height);  // Game-Over-Bild neu zeichnen
                drawButton(isHovered);  // Button neu zeichnen, basierend auf Hover-Status
            };
    
            // Klick-Event für den Button
            const clickHandler = (event) => {
                const rect = this.canvas.getBoundingClientRect();
                const clickX = event.clientX - rect.left;
                const clickY = event.clientY - rect.top;
    
                // Überprüfen, ob der Klick im Button-Bereich war
                if (clickX >= buttonX && clickX <= buttonX + buttonWidth && clickY >= buttonY && clickY <= buttonY + buttonHeight) {
                    console.log("Erneut spielen-Button geklickt");
                    this.canvas.removeEventListener('mousemove', mouseMoveHandler);  // Entferne Hover-Event
                    this.canvas.removeEventListener('click', clickHandler);  // Entferne Klick-Event
                    this.restartGame();  // Starte das Spiel neu
                }
            };
    
            // Event-Listener für Hover und Klick hinzufügen
            this.canvas.addEventListener('mousemove', mouseMoveHandler);
            this.canvas.addEventListener('click', clickHandler);
        };
    }
    
    
    
    
    
    showWinScreen() {
        if (this.showingWinScreen) return;
        this.showingWinScreen = true;
    
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let img = new Image();
        img.src = 'img/9_intro_outro_screens/win/win_1.png';
    
        img.onload = () => {
            let scaleFactor = 0.5;
            let width = img.width * scaleFactor;
            let height = img.height * scaleFactor;
            let x = (this.canvas.width - width) / 2;
            let y = (this.canvas.height - height) / 2;
            this.ctx.drawImage(img, x, y, width, height);
    
            // Setze die Position und Größe des Buttons
            let buttonX = x + width / 2 - 50;
            let buttonY = (this.canvas.height / 2) + 100;
            let buttonWidth = 120;
            let buttonHeight = 40;
    
            // Button zeichnen (mit Hover-Effekt)
            const drawButton = (isHovered) => {
                this.ctx.fillStyle = isHovered ? "#FFB347" : "#FFA500";
                this.ctx.strokeStyle = "black";
                this.ctx.lineWidth = 3;
    
                this.ctx.beginPath();
                this.ctx.moveTo(buttonX + 10, buttonY);
                this.ctx.lineTo(buttonX + buttonWidth - 10, buttonY);
                this.ctx.arcTo(buttonX + buttonWidth, buttonY, buttonX + buttonWidth, buttonY + 10, 10);
                this.ctx.lineTo(buttonX + buttonWidth, buttonY + buttonHeight - 10);
                this.ctx.arcTo(buttonX + buttonWidth, buttonY + buttonHeight, buttonX + buttonWidth - 10, buttonY + buttonHeight, 10);
                this.ctx.lineTo(buttonX + 10, buttonY + buttonHeight);
                this.ctx.arcTo(buttonX, buttonY + buttonHeight, buttonX, buttonY + buttonHeight - 10, 10);
                this.ctx.lineTo(buttonX, buttonY + 10);
                this.ctx.arcTo(buttonX, buttonY, buttonX + 10, buttonY, 10);
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.stroke();
    
                this.ctx.fillStyle = isHovered ? "white" : "black";
                this.ctx.font = isHovered ? "20px western" : "18px western";
                this.ctx.textAlign = "center";
                this.ctx.textBaseline = "middle";
                this.ctx.fillText("Erneut spielen", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);
            };
    
            drawButton(false);
    
            // Event-Handler speichern, damit sie beim Neustart entfernt werden können
            this.mouseMoveHandler = (event) => {
                const rect = this.canvas.getBoundingClientRect();
                const mouseX = event.clientX - rect.left;
                const mouseY = event.clientY - rect.top;
    
                const isHovered = mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
                                  mouseY >= buttonY && mouseY <= buttonY + buttonHeight;
    
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.drawImage(img, x, y, width, height);
                drawButton(isHovered);
            };
    
            this.clickHandler = (event) => {
                const rect = this.canvas.getBoundingClientRect();
                const clickX = event.clientX - rect.left;
                const clickY = event.clientY - rect.top;
    
                if (clickX >= buttonX && clickX <= buttonX + buttonWidth && clickY >= buttonY && clickY <= buttonY + buttonHeight) {
                    console.log("Erneut spielen-Button geklickt");
                    this.canvas.removeEventListener('mousemove', this.mouseMoveHandler);
                    this.canvas.removeEventListener('click', this.clickHandler);
                    this.restartGame();
                }
            };
    
            this.canvas.addEventListener('mousemove', this.mouseMoveHandler);
            this.canvas.addEventListener('click', this.clickHandler);
        };
    }
    
    setWorld() {
        this.character.world = this;
    }

    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();
        }, 1000 / 60);  // Setze auf 60 FPS für flüssigere Kollisionsüberprüfung
    }

    checkThrowObjects() {
        if (this.keyboard.D && !this.bottleThrown) {  // Prüfe, ob eine Flasche geworfen wurde
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObjects.push(bottle);
            this.bottleThrown = true;  // Setze das Flag auf true, wenn eine Flasche geworfen wird

            // Entferne die Flasche nach der Splash-Animation oder wenn sie aus dem Bildschirm ist
            setTimeout(() => {
                this.bottleThrown = false;  // Setze das Flag auf false, nachdem die Flasche entfernt wurde
            }, 1000);  // 1 Sekunde, bis die Flasche weg ist (anpassen je nach Spielanforderungen)
        }
    }

    checkCollisions() {
        // 1. Überprüfe Kollisionen mit Feinden (Hühner und Endboss)
        this.level.enemies.forEach((enemy, enemyIndex) => {
            if (enemy instanceof Endboss) {
                enemy.alertIfPlayerNearby(this.character);  // Endboss wechselt in Angriffsmodus, wenn der Spieler nahe ist

                if (!enemy.isDead() && this.character.isColliding(enemy)) {
                    // Der Charakter wird getroffen
                    this.character.hit();
                    this.statusBarHealth.setPercentage(this.character.energy);

                    // Zeige Game-Over-Screen, wenn die Energie auf 0 oder weniger fällt
                    if (this.character.energy <= 0) {
                        this.showGameOverScreen();
                        return;  // Beende die Methode, um weitere Kollisionen zu vermeiden
                    }
                }
            }

            // Überprüfe Kollision zwischen Charakter und anderen Feinden
            if (!enemy.isDead && this.character.isColliding(enemy)) {
                if (enemy instanceof Chicken || enemy instanceof SmallChicken) {
                    // Charakter springt auf das Huhn und besiegt es
                    if (this.character.speedY < 0 && this.character.y + this.character.height * 0.9 < enemy.y) {
                        enemy.die();  // Huhn stirbt, wenn der Charakter von oben springt
                        setTimeout(() => {
                            this.level.enemies.splice(enemyIndex, 1);  // Entferne das Huhn nach einer Sekunde
                        }, 1000);
                        this.character.jump();  // Der Charakter prallt nach dem Sprung ab
                    } else {
                        // Kollision von der Seite -> Charakter nimmt Schaden
                        this.character.hit();
                        this.statusBarHealth.setPercentage(this.character.energy);

                        // Zeige Game-Over-Screen, wenn die Energie auf 0 oder weniger fällt
                        if (this.character.energy <= 0) {
                            this.showGameOverScreen();
                            return;  // Beende die Methode
                        }
                    }
                }
            }
        });

        // 2. Überprüfe Kollisionen zwischen Flaschen und dem Endboss
        this.throwableObjects.forEach((bottle, bottleIndex) => {
            this.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy) && enemy instanceof Endboss && !enemy.isDead()) {
                    bottle.playSplashAnimation();  // Spiele die Splash-Animation der Flasche
                    enemy.hit();  // Füge dem Endboss Schaden zu
                    this.statusBarEndboss.setPercentage(enemy.energy);  // Aktualisiere die Statusleiste des Endbosses
                    this.throwableObjects.splice(bottleIndex, 1);  // Entferne die Flasche nach dem Treffer
                }
            });
        });

        // 3. Überprüfe Kollisionen mit Flaschen als sammelbare Objekte
        this.collectibles = this.collectibles.filter(collectible => {
            if (collectible instanceof CollectibleObjects && collectible.type === 'bottle' && this.character.isColliding(collectible)) {
                console.log('Flasche eingesammelt!');
                this.statusBarBottles.collectItem();  // Aktualisiere die Flaschen-Statusbar
                return false;  // Entferne die Flasche, wenn sie eingesammelt wurde
            }
            return true;
        });

        // 4. Überprüfe Kollisionen mit Münzen
        this.collectibles = this.collectibles.filter(collectible => {
            if (collectible instanceof CollectibleObjects && collectible.type === 'coin' && this.character.isColliding(collectible)) {
                this.statusBarCoins.collectItem();  // Aktualisiere die Münzen-Statusbar
                return false;  // Entferne die Münze, wenn sie eingesammelt wurde
            }
            return true;
        });

        // 5. Überprüfe, ob der Endboss besiegt wurde und zeige den Winnerscreen
        let endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
        if (endboss && endboss.isDead()) {
            this.showWinScreen();
        }
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
        let groundY = 310;        // y-Position für die Flaschen (auf dem Boden)

        for (let i = 0; i < numBottles; i++) {
            let xPosition = (totalDistance / numBottles) * (i + 1);
            this.collectibles.push(new CollectibleObjects(xPosition, groundY, 'bottle'));
        }

        // Setze die maximale Anzahl der Flaschen in der Statusbar
        this.statusBarBottles.maxItems = numBottles;
    }

    checkThrowObjects() {
        if (this.keyboard.D && !this.bottleThrown && this.statusBarBottles.currentItems > 0) {  // Prüfe, ob Flaschen übrig sind
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObjects.push(bottle);
            this.bottleThrown = true;

            // Ziehe eine Flasche von der Statusleiste ab
            this.statusBarBottles.useItem();  // Flasche aus der Statusbar entfernen

            setTimeout(() => {
                this.bottleThrown = false;  // Setze das Flag auf false, nachdem die Flasche entfernt wurde
            }, 1000);  // 1 Sekunde, bis die Flasche weg ist
        }
    }

    draw() {
            if (this.showingWinScreen || this.showingGameOverScreen) {
                console.log("Zeichen-Schleife gestoppt wegen Game-Over oder Win-Screen.");
                return;
            }
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
        
        // Überprüfe, ob der Charakter den Endboss erreicht hat
        let endboss = this.level.enemies[this.level.enemies.length - 1];  // Der Endboss ist der letzte Feind
        if (this.character.x >= endboss.x - 700) {  // Wenn der Charakter nahe genug am Endboss ist
            this.addToMap(this.statusBarEndboss);  // Statusleiste des Endbosses anzeigen
        }
        
        this.ctx.translate(this.camera_x, 0);
        this.addToMap(endboss);  // Endboss zeichnen
        
        // Entferne Chickens nur, wenn der Charakter den Endboss erreicht hat
        if (this.character.x >= endboss.x - 300) {
            this.chickenGenerationEnabled = false;  // Stoppe die Generierung neuer Chickens

            // Entferne alle Chickens, sobald der Endboss sichtbar ist
            this.level.enemies = this.level.enemies.filter(enemy => enemy instanceof Endboss);
        } else {
            // Zeichne normale Feinde (Chickens) solange der Endboss nicht sichtbar ist
            this.addObjectsToMap(this.level.enemies.filter(enemy => !(enemy instanceof Endboss)));
        }
        
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0);
        this.animationFrameId = requestAnimationFrame(() => {
            this.draw();
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