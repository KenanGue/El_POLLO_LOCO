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
    pickUpBottleSound = new Audio('audio/bottle.mp3');
    pickUpCoinSound = new Audio('audio/coin.mp3');
    chickenDead = new Audio('audio/dead-chicken.mp3');
    bossChicken = new Audio('audio/chicken.mp3');
    winSound = new Audio('audio/win.mp3');
    loseSound = new Audio('audio/lose.mp3');

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
        this.clearAllIntervals();
        this.introOutro.showGameOverScreen();
        this.showingGameOverScreen = true;
        this.loseSound.play();
    }

    /**
    * Displays the Win screen and sets the win status.
    */
    showWinScreen() {
        this.clearAllIntervals();
        this.introOutro.showWinScreen();
        this.showingWinScreen = true;
        this.winSound.play();
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
        if (this.keyboard.D && this.statusBarBottles.currentItems > 0) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObjects.push(bottle);
            this.statusBarBottles.useItem(); 
            console.log("Neue Flasche geworfen");
        }
    }

    /**
     * Checks various types of collisions in the game, including enemies, bottles, collectibles, 
     * and updates the state of the endboss.
     */
    checkCollisions() {
        this.checkEnemyCollisions();
        this.checkBottleCollisions();
        this.checkCollectibleCollisions();
        this.checkEndbossState();
    }

    /**
     * Iterates through all enemies in the level and checks for collisions with the character.
     * Calls specific collision handling for chickens or the endboss.
     */
    checkEnemyCollisions() {
        this.level.enemies.forEach((enemy, enemyIndex) => {
            if (enemy instanceof Endboss) {
                this.handleEndbossCollision(enemy);
            } else if (!enemy.isDead && (enemy instanceof Chicken || enemy instanceof SmallChicken)) {
                this.handleChickenCollision(enemy, enemyIndex);
            }
        });
    }

    /**
     * Handles collision logic between the character and the endboss.
     * Alerts the endboss if the character is nearby and reduces character health on collision.
     * Displays the game-over screen if the character's energy reaches zero.
     * 
     * @param {Endboss} enemy - The endboss object to check for collisions.
     */
    handleEndbossCollision(enemy) {
        enemy.alertIfPlayerNearby(this.character);
        if (!enemy.isDead() && this.character.isColliding(enemy)) {
            this.character.hit();
            this.statusBarHealth.setPercentage(this.character.energy);
            if (this.character.energy <= 0) {
                setTimeout(() => {
                    this.chickenDead.play();
                    this.showGameOverScreen();
                }, 1000);
            }
        }
    }

    /**
     * Handles collision logic between the character and chickens.
     * Checks whether the character jumps on or collides with a chicken.
     * Removes the chicken if jumped on or reduces character health if collided directly.
     * 
     * @param {Chicken|SmallChicken} enemy - The chicken object to check for collisions.
     * @param {number} enemyIndex - The index of the chicken in the enemy array.
     */
    handleChickenCollision(enemy, enemyIndex) {

        if (this.character.isColliding(enemy)) {
            if (this.character.speedY < 0 && this.character.y + this.character.height * 0.9 < enemy.y) {
                enemy.die();
                setTimeout(() => {
                    this.level.enemies.splice(enemyIndex, 1);
                }, 1000);
                this.character.jump();
                this.chickenDead.play();
            } else {
                this.character.hit();
                this.statusBarHealth.setPercentage(this.character.energy);
                if (this.character.energy <= 0) {
                    setTimeout(() => {
                        this.showGameOverScreen();
                    }, 1000);
                }
            }
        }
    }

    /**
     * Checks for collisions between throwable bottles and enemies.
     * Removes the bottle and damages the endboss if a collision occurs.
     */
    checkBottleCollisions() {
        this.throwableObjects.forEach((bottle, bottleIndex) => {
            this.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy) && enemy instanceof Endboss && !enemy.isDead()) {
                    console.log("Bottle collided with Endboss");
                    bottle.playSplashAnimation();
                    enemy.hit();
                    this.statusBarEndboss.setPercentage(enemy.energy);
                    setTimeout(() => {
                        this.throwableObjects.splice(bottleIndex, 1);
                    }, 1000);
                }
            });
        });
    }

    /**
     * Checks for collisions between the character and collectible items like coins or bottles.
     * Updates the corresponding status bar and plays a sound effect upon collection.
     */
    checkCollectibleCollisions() {
        this.collectibles = this.collectibles.filter(collectible => {
            if (collectible instanceof CollectibleObjects && collectible.type === 'bottle' && this.character.isColliding(collectible)) {
                this.statusBarBottles.collectItem();
                this.pickUpBottleSound.play();
                return false;
            }
            if (collectible instanceof CollectibleObjects && collectible.type === 'coin' && this.character.isColliding(collectible, true)) {
                this.statusBarCoins.collectItem();
                this.pickUpCoinSound.play();
                return false;
            }
            return true;
        });
    }
    
    /**
     * Checks the current state of the endboss.
     * Displays the win screen if the endboss is defeated and ensures the endboss is drawn on the canvas.
     */
    checkEndbossState() {
        let endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
        if (endboss) {
            if (endboss.isDead() && !this.showingWinScreen) {
                setTimeout(() => {
                    this.showWinScreen();
                }, 1000);
            }
            this.addToMap(endboss);
        }
    }

    /**
     * Creates coin collectibles along the level at specified intervals and positions.
     */
    createCoins() {
        let totalDistance = 5000;
        let numColletibles = 10;
        let minY = 80;
        let maxY = 160;
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
        let numBottles = 10;
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

        this.clearCanvas();
        this.drawBackground();
        this.drawGameObjects();
        this.drawStatusBars();
        this.handleEndboss();
        this.finalizeDrawing();
        this.scheduleNextFrame();
    }

    /**
     * Clears the canvas for redrawing.
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draws background elements, clouds, and translates the camera.
     */
    drawBackground() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.ctx.translate(-this.camera_x, 0);
    }

    /**
     * Draws the character, collectibles, enemies, and throwable objects.
     */
    drawGameObjects() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.collectibles);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies.filter(enemy => !(enemy instanceof Endboss)));
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0);
    }

    /**
     * Draws the status bars for health, coins, bottles, and the endboss if needed.
     */
    drawStatusBars() {
        this.addToMap(this.statusBarHealth);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusBarBottles);

        let endboss = this.level.enemies[this.level.enemies.length - 1];
        if (this.character.x >= endboss.x - 700) {
            this.addToMap(this.statusBarEndboss);
            this.bossChicken.play();
        }
    }

    /**
     * Handles the specific drawing logic for the endboss.
     */
    handleEndboss() {
        let endboss = this.level.enemies[this.level.enemies.length - 1];
        this.ctx.translate(this.camera_x, 0);
        this.addToMap(endboss);

        if (this.character.x >= endboss.x - 300) {
            this.chickenGenerationEnabled = false;
        }
        this.ctx.translate(-this.camera_x, 0);
    }

    /**
     * Finalizes the drawing process.
     */
    finalizeDrawing() {
        if (this.character.x < 600 || !this.character.isDead()) {
        }
    }

    /**
     * Schedules the next animation frame for the draw loop.
     */
    scheduleNextFrame() {
        let self = this;
        requestAnimationFrame(() => {
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
}