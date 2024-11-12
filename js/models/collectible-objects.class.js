/**
 * The CollectibleObjects class represents items that can be collected in the game, like coins and bottles.
 */
class CollectibleObjects extends MovableObject {
    IMAGES_COINS = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];  
    IMAGES_BOTTLES = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    /**
     * Initializes a collectible object at a specified position and of a specified type.
     * @param {number} x - The x-coordinate of the collectible.
     * @param {number} y - The y-coordinate of the collectible.
     * @param {string} type - Type of the collectible (e.g., 'coin' or 'bottle').
     */
    constructor(x, y, type) {
        super();
        this.x = x;
        this.y = y;
        this.type = type;
        if (type === 'coin') {
            this.width = 150;   
            this.height = 150; 
            this.loadImages(this.IMAGES_COINS);
            this.animateCoin();
        } else if (type === 'bottle') {
            this.width = 100; 
            this.height = 120; 
            this.loadRandomBottleImage();
        }
    }

    /**
     * Animates the coin collectible by cycling through its images to create a twinkling effect.
     */
    animateCoin() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_COINS);
        }, 200);
    }

    /**
     * Loads a random image for a bottle collectible to add visual variation.
     */
    loadRandomBottleImage() {
        let randomIndex = Math.floor(Math.random() * this.IMAGES_BOTTLES.length);
        this.loadImage(this.IMAGES_BOTTLES[randomIndex]);
    }
}
