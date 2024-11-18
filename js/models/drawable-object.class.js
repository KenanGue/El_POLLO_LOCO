/**
 * DrawableObject is the base class for objects that can be drawn on the canvas.
 */
class DrawableObject {
    img;
    imageCache = [];
    currentImage = 0;
    x = 120;
    y = 350;
    height = 150;
    width = 100;

    /**
     * Loads a single image for the object.
     * @param {string} path - Path to the image file.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
        this.img.onload = () => {
        };
        this.img.onerror = () => {
            console.error('Error loading image: ' + path);
        };
    }

    /**
     * Draws the object on the specified canvas context.
     * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on.
     */
    draw(ctx) {
        if (this.img) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }

    /**
     * Draws a frame around the object, useful for debugging.
     * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on.
     */
    drawFrame(ctx) {
        
    }
    
    /**
     * Loads multiple images and caches them, useful for animations.
     * @param {Array<string>} arr - Array of image paths to load.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
            img.onload = () => {
            };
            img.onerror = () => {
            };
        });
    }
}
