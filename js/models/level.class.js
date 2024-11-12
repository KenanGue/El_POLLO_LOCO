/**
 * The Level class represents a game level containing enemies, clouds, and background objects.
 */
class Level {
    enemies;
    clouds;
    backgroundObjects;
    level_end_x = 5200;
    
    /**
     * Initializes the level with the given enemies, clouds, and background objects.
     * @param {Array} enemies - Array of enemy objects in the level.
     * @param {Array} clouds - Array of cloud objects in the level.
     * @param {Array} backgroundObjects - Array of background layers in the level.
     */
    constructor (enemies, clouds, backgroundObjects) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
    }
}