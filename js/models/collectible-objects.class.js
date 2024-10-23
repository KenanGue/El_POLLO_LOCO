class CollectibleObjects extends MovableObject {
    IMAGES_COINS = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];  
    IMAGES_BOTTLES = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    constructor(x, y, type) {
        super();
        this.x = x;
        this.y = y;
        this.type = type;

        // Setze die Größe basierend auf dem Typ (coin oder bottle)
        if (type === 'coin') {
            this.width = 150;   // Breite der Münze
            this.height = 150;  // Höhe der Münze
            this.loadImages(this.IMAGES_COINS);
            this.animateCoin();
        } else if (type === 'bottle') {
            this.width = 100;  // Breite der Flasche
            this.height = 120; // Höhe der Flasche
            this.loadRandomBottleImage();
        }
    }

    animateCoin() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_COINS);
        }, 200);
    }

    loadRandomBottleImage() {
        let randomIndex = Math.floor(Math.random() * this.IMAGES_BOTTLES.length);
        this.loadImage(this.IMAGES_BOTTLES[randomIndex]);
    }
}
