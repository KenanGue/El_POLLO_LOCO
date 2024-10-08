class Cloud extends MovableObject {
    y = 0;
    width = 500;
    height = 400;
    static imageIndex = 0;
    speed = 0.1;

    constructor(xPosition) {
        super();
        this.x = xPosition;
        this.loadImageAlternating();
        Cloud.imageIndex++;
        this.animate();
    }

    loadImageAlternating() {
        if (Cloud.imageIndex % 2 === 0) {
            this.loadImage('img/5_background/layers/4_clouds/1.png');
        } else {
            this.loadImage('img/5_background/layers/4_clouds/2.png');
        }
    }

    animate() {
        setInterval(() => {
            this.moveLeft();
            if (this.x < -this.width) {
                this.x = 7200; 
            }
        }, 1000 / 60);
    }

    moveLeft() {
        this.x -= this.speed; 
    }
}
