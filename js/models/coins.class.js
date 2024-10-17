class Coin extends MovableObject {
    static imageIndex = 0; // Statischer Index
    width = 150;
    height = 150;
    coinImages = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];  // Array mit den Pfaden zu den Coin-Bildern

    constructor(x, y) {
        super();
        this.loadImages(this.coinImages); // Bilder vorladen
        Coin.imageIndex++;
        this.x = x;
        this.y = y;
        this.animate(); // Starte die Animation bei Erstellung des Coins
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.coinImages); // Array der Bilder für Animation übergeben
        }, 200); // 200ms Interval für Animation
    }
}
