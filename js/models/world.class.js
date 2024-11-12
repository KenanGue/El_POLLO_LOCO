/**
 * The World class manages the game environment, including the character, enemies, and collectibles.
 * It is responsible for game initialization, updating object states, handling collisions, and rendering.
 */
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
    bottleThrown = false;
    collectibles = [];
    collectedBottles = 0;
    showingWinScreen = false;
    showingGameOverScreen = false;

    /**
     * Initializes the World instance, sets up the canvas context, character, and game status bars.
     * @param {HTMLCanvasElement} canvas - The game's canvas element.
     * @param {Keyboard} keyboard - The keyboard input object for controlling the character.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.introOutro = new Intro_Outro(canvas, this.ctx);
        this.createCoins();
        this.createBottles();
        this.draw();
        this.setWorld();
        this.run();
    }

    /**
     * Displays the Game Over screen and sets the game-over status.
     */
    showGameOverScreen() {
        this.introOutro.showGameOverScreen();
        this.showingGameOverScreen = true;
    }

    /**
    * Displays the Win screen and sets the win status.
    */
    showWinScreen() {
        this.introOutro.showWinScreen();
        this.showingWinScreen = true;
    }

    /**
    * Links the character with the game world, allowing for interactions within the game.
    */
    setWorld() {
        this.character.world = this;
    }

    /**
    * Starts the game loop by regularly checking collisions and throwable objects.
    */
    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();
        }, 1000 / 60);
    }

    /**
    * Checks if a throwable object (bottle) can be thrown and initiates its movement.
    */
    checkThrowObjects() {
        if (this.keyboard.D && !this.bottleThrown) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObjects.push(bottle);
            this.bottleThrown = true;
            setTimeout(() => {
                this.bottleThrown = false;
            }, 1000);
        }
    }

    /**
    * Checks for collisions between the character, enemies, and collectibles, handling effects like
    * health reduction or collectible gathering.
    */
    checkCollisions() {
        this.level.enemies.forEach((enemy, enemyIndex) => {
            if (enemy instanceof Endboss) {
                enemy.alertIfPlayerNearby(this.character);
                if (!enemy.isDead() && this.character.isColliding(enemy)) {
                    this.character.hit();
                    this.statusBarHealth.setPercentage(this.character.energy);
                    if (this.character.energy <= 0) {
                        this.showGameOverScreen();
                        return;
                    }
                }
            }
            if (!enemy.isDead && (enemy instanceof Chicken || enemy instanceof SmallChicken)) {
                if (this.character.x >= this.level.enemies[this.level.enemies.length - 1].x - 300) {
                    return;
                }
                if (this.character.isColliding(enemy)) {
                    if (enemy instanceof Chicken || enemy instanceof SmallChicken) {
                        if (this.character.speedY < 0 && this.character.y + this.character.height * 0.9 < enemy.y) {
                            enemy.die();
                            setTimeout(() => {
                                this.level.enemies.splice(enemyIndex, 1);
                            }, 1000);
                            this.character.jump();
                        } else {
                            this.character.hit();
                            this.statusBarHealth.setPercentage(this.character.energy);
                            if (this.character.energy <= 0) {
                                this.showGameOverScreen();
                                this.stopGame();
                                return;
                            }
                        }
                    }
                }
            }
        });
        this.throwableObjects.forEach((bottle, bottleIndex) => {
            this.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy) && enemy instanceof Endboss && !enemy.isDead()) {
                    bottle.playSplashAnimation();
                    enemy.hit();
                    this.statusBarEndboss.setPercentage(enemy.energy);
                    this.throwableObjects.splice(bottleIndex, 1);
                }
            });
        });
        this.collectibles = this.collectibles.filter(collectible => {
            if (collectible instanceof CollectibleObjects && collectible.type === 'bottle' && this.character.isColliding(collectible)) {
                this.statusBarBottles.collectItem();
                return false;
            }
            return true;
        });
        this.collectibles = this.collectibles.filter(collectible => {
            if (collectible instanceof CollectibleObjects && collectible.type === 'coin' && this.character.isColliding(collectible)) {
                this.statusBarCoins.collectItem();
                return false;
            }
            return true;
        });

        let endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
        if (endboss && endboss.isDead()) {
            this.showWinScreen();
        }
    }

    /**
     * Creates coin collectibles along the level at specified intervals and positions.
     */
    createCoins() {
        let totalDistance = 5000;
        let numColletibles = 10;
        let minY = 80;
        let maxY = 250;
        for (let i = 0; i < numColletibles; i++) {
            let xPosition = (totalDistance / numColletibles) * (i + 1);
            let yPosition = Math.random() * (maxY - minY) + minY;
            this.collectibles.push(new CollectibleObjects(xPosition, yPosition, 'coin'));
        }
    }

    /**
     * Creates bottle collectibles along the level at specified intervals and positions.
     */
    createBottles() {
        let totalDistance = 4800;
        let numBottles = 5;
        let groundY = 310;
        for (let i = 0; i < numBottles; i++) {
            let xPosition = (totalDistance / numBottles) * (i + 1);
            this.collectibles.push(new CollectibleObjects(xPosition, groundY, 'bottle'));
        }
        this.statusBarBottles.maxItems = numBottles;
    }

    /**
    * Checks if the player can throw a bottle and, if allowed, creates a throwable bottle object.
    * Limits bottle throws to prevent spamming and updates the bottle status bar.
    * The bottle can only be thrown if the player has bottles available in the status bar.
    */
    checkThrowObjects() {
        if (this.keyboard.D && !this.bottleThrown && this.statusBarBottles.currentItems > 0) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObjects.push(bottle);
            this.bottleThrown = true;
            this.statusBarBottles.useItem();
            setTimeout(() => {
                this.bottleThrown = false;
            }, 1000);
        }
    }

    /**
     * Continuously redraws the game canvas and translates the camera based on character position.
     */
    draw() {
        if (this.showingWinScreen || this.showingGameOverScreen) return;
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
        let endboss = this.level.enemies[this.level.enemies.length - 1];
        if (this.character.x >= endboss.x - 700) {
            this.addToMap(this.statusBarEndboss);
        }

        this.ctx.translate(this.camera_x, 0);
        this.addToMap(endboss);
        if (this.character.x >= endboss.x - 300) {
            this.chickenGenerationEnabled = false;
        } else {
            this.addObjectsToMap(this.level.enemies.filter(enemy => !(enemy instanceof Endboss)));
        }
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0);
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    /**
     * Adds multiple objects to the game map by drawing each object in the provided list.
     * @param {Array} objects - The list of objects to add.
     */
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    /**
     * Draws a single movable object (e.g., character, enemy) onto the canvas, flipping if necessary.
     * @param {MovableObject} mo - The object to draw.
     */
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

    /**
     * Flips an object horizontally, used for characters facing left.
     * @param {MovableObject} mo - The object to flip.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores an object’s original orientation after flipping.
     * @param {MovableObject} mo - The object to unflip.
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    /**
     * Generates additional enemies if chicken generation is enabled.
     */
    generateEnemies() {
        if (!this.chickenGenerationEnabled) return;
    }

    /**
     * Stops all active intervals in the game to pause actions.
     */
    clearAllIntervals() {
        for (let i = 1; i < 9999; i++) window.clearInterval(i);
    }

    /**
     * Stops the game by clearing intervals and displaying the game-over screen.
     */
    stopGame() {
        this.clearAllIntervals();
        this.showingGameOverScreen = true;
    }
}