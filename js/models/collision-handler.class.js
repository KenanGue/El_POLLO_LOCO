/**
 * The `CollisionHandler` class manages and processes all collision-related events in the game.
 * It handles interactions between the character, enemies, bottles, collectibles, and the endboss.
 */
class CollisionHandler {
  
    constructor(world) {
        this.world = world;
    }

    /**
     * Checks for all types of collisions in the game.
     * This includes enemy collisions, bottle collisions, collectible collisions, and endboss state updates.
     */
    checkCollisions() {
        this.checkEnemyCollisions();
        this.checkBottleCollisions();
        this.checkCollectibleCollisions();
        this.checkEndbossState();
    }

    /**
     * Checks for collisions between the character and enemies.
     * Handles specific logic for different enemy types (e.g., chickens, endboss).
     */
    checkEnemyCollisions() {
        this.world.level.enemies.forEach((enemy, enemyIndex) => {
            if (enemy instanceof Endboss) {
                this.handleEndbossCollision(enemy);
            } else if (!enemy.isDead && (enemy instanceof Chicken || enemy instanceof SmallChicken)) {
                this.handleChickenCollision(enemy, enemyIndex);
            }
        });
    }

    /**
     * Handles collisions between the character and the endboss.
     * Reduces the character's energy on collision and triggers game-over logic if energy reaches zero.
     * @param {Object} enemy - The endboss instance.
     */
    handleEndbossCollision(enemy) {
        enemy.alertIfPlayerNearby(this.world.character);
        if (!enemy.isDead() && this.world.character.isColliding(enemy)) {
            this.world.character.hit();
            this.world.statusBarHealth.setPercentage(this.world.character.energy);
            if (this.world.character.energy <= 0) {
                setTimeout(() => {
                    this.world.chickenDead.play();
                    this.world.showGameOverScreen();
                }, 1000);
            }
        }
    }

    /**
     * Handles collisions between the character and a chicken (or small chicken).
     * Differentiates between jumping on the chicken and direct collision.
     * @param {Object} enemy - The chicken instance.
     * @param {number} enemyIndex - The index of the chicken in the enemies array.
     */
    handleChickenCollision(enemy, enemyIndex) {
        const nearbyChickens = this.getNearbyChickens(enemy);
        if (this.characterCollidesWithGroup(nearbyChickens)) {
            const isJumping = this.isCharacterJumpingOnChicken(enemy);
            if (isJumping) {
                this.handleChickenJump(nearbyChickens);
            } else {
                this.handleChickenHit();
            }
        }
    }

    /**
     * Finds nearby chickens within a collision radius of the specified chicken.
     * @param {Object} enemy - The chicken instance.
     * @returns {Object[]} - Array of nearby chickens.
     */
    getNearbyChickens(enemy) {
        const collisionRadius = 50;
        return this.world.level.enemies.filter(e =>
            (e instanceof Chicken || e instanceof SmallChicken) &&
            !e.isDead &&
            Math.abs(e.x - enemy.x) < collisionRadius
        );
    }

    /**
     * Checks if the character is colliding with a group of chickens.
     * @param {Object[]} nearbyChickens - Array of chickens to check.
     * @returns {boolean} - True if collision occurs, false otherwise.
     */
    characterCollidesWithGroup(nearbyChickens) {
        return nearbyChickens.some(e => this.world.character.isColliding(e));
    }

    /**
     * Determines if the character is jumping on a chicken.
     * @param {Object} enemy - The chicken instance.
     * @returns {boolean} - True if the character is jumping, false otherwise.
     */
    isCharacterJumpingOnChicken(enemy) {
        return (
            this.world.character.speedY < 0 &&
            this.world.character.y + this.world.character.height * 0.8 < enemy.y
        );
    }

    /**
     * Handles the logic when the character jumps on a chicken.
     * Kills the chicken and plays the appropriate animation and sound.
     * @param {Object[]} nearbyChickens - Array of chickens to handle.
     */
    handleChickenJump(nearbyChickens) {
        nearbyChickens.forEach(chicken => {
            chicken.die();
            chicken.isDead = true;
            this.world.character.jump();
            this.world.chickenDead.play();
            setTimeout(() => {
                const index = this.world.level.enemies.indexOf(chicken);
                if (index > -1) this.world.level.enemies.splice(index, 1);
            }, 500);
        });
    }

    /**
     * Handles the logic when the character collides directly with a chicken.
     * Reduces the character's energy and triggers game-over logic if energy reaches zero.
     */
    handleChickenHit() {
        this.world.character.hit();
        this.world.statusBarHealth.setPercentage(this.world.character.energy);
        if (this.world.character.energy <= 0) {
            setTimeout(() => {
                this.world.showGameOverScreen();
            }, 1000);
        }
    }

    /**
     * Checks for collisions between throwable bottles and enemies.
     * Handles damage to the endboss when hit by a bottle.
     */
    checkBottleCollisions() {
        this.world.throwableObjects.forEach((bottle, bottleIndex) => {
            this.world.level.enemies.forEach(enemy => {
                if (bottle.isColliding(enemy) && enemy instanceof Endboss && !enemy.isDead()) {
                    bottle.playSplashAnimation();
                    enemy.hit();
                    this.world.statusBarEndboss.setPercentage(enemy.energy);
                    setTimeout(() => {
                        this.world.throwableObjects.splice(bottleIndex, 1);
                    }, 1000);
                }
            });
        });
    }

    /**
     * Checks for collisions between the character and collectible items.
     * Updates the game state when bottles or coins are collected.
     */
    checkCollectibleCollisions() {
        this.world.collectibles = this.world.collectibles.filter(collectible => {
            if (collectible instanceof CollectibleObjects && collectible.type === 'bottle' && this.world.character.isColliding(collectible)) {
                this.world.statusBarBottles.collectItem();
                this.world.pickUpBottleSound.play();
                return false;
            }
            if (collectible instanceof CollectibleObjects && collectible.type === 'coin' && this.world.character.isColliding(collectible, true)) {
                this.world.statusBarCoins.collectItem();
                this.world.pickUpCoinSound.play();
                return false;
            }
            return true;
        });
    }

    /**
     * Checks the state of the endboss.
     * Triggers the win screen if the endboss is defeated.
     */
    checkEndbossState() {
        let endboss = this.world.level.enemies.find(enemy => enemy instanceof Endboss);
        if (endboss) {
            if (endboss.isDead() && !this.world.showingWinScreen) {
                setTimeout(() => {
                    this.world.showWinScreen();
                }, 1000);
            }
            this.world.addToMap(endboss);
        }
    }
}
