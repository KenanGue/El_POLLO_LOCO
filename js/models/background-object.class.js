/**
 * The BackgroundObject class represents a background element in the game world.
 */
class BackgroundObject extends MovableObject {
    width = 720;
    height = 480;
    
    /**
     * Initializes a background object at a given x-position with a specified image.
     * @param {string} imagePath - Path to the background image.
     * @param {number} x - The x-coordinate of the background object.
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
    }
}