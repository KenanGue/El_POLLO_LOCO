class DrawableObject {
    img;
    imageCache = [];
    currentImage = 0;
    x = 120;
    y = 350;
    height = 150;
    width = 100;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
        this.img.onload = () => {
            console.log('Image loaded: ' + path);
        };
        this.img.onerror = () => {
            console.error('Error loading image: ' + path);
        };
    }

    draw(ctx) {
        if (this.img) {
            // Bild wird immer versucht zu zeichnen, wenn es vorhanden ist
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
        // Keine Blockierung, Bild wird angezeigt, wenn es geladen ist
    }

    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof SmallChicken) {
            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
            img.onload = () => {
                console.log('Image loaded into cache: ' + path);
            };
            img.onerror = () => {
                console.error('Error loading image into cache: ' + path);
            };
        });
    }
}
