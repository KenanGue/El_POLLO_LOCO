class StatusBar extends DrawableObject {
    IMAGES_HEALTH = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/100.png'
    ];
    IMAGES_COIN = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png'
    ];
    IMAGES_BOTTLE = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png'
    ];
    percentage = 100;
    type;  // Füge eine Eigenschaft hinzu, um den Typ zu speichern

    constructor(type) {
        super();
        this.type = type;  // Weise den übergebenen Typ zu
        if (type === 'health') {
            this.loadImages(this.IMAGES_HEALTH);
            this.setPercentage(100);  // Health startet bei 100%
            this.x = 40;
            this.y = 0;  // Health-Statusbar bleibt oben
        } else if (type === 'coin') {
            this.loadImages(this.IMAGES_COIN);
            this.setPercentage(0);  // Coins starten bei 0%
            this.x = 40;
            this.y = 60;  // Coin-Statusbar ist direkt unter der Health-Statusbar
        } else if (type === 'bottle') {
            this.loadImages(this.IMAGES_BOTTLE);
            this.setPercentage(0);  // Bottles starten bei 0%
            this.x = 40;
            this.y = 120;  // Bottle-Statusbar ist unter der Coin-Statusbar
        }
        this.width = 200;
        this.height = 60;
    }

    setPercentage(percentage) {
        this.percentage = percentage;
        let path;
        if (this.type === 'health') {
            path = this.IMAGES_HEALTH[this.resolveImageIndex()];
        } else if (this.type === 'coin') {
            path = this.IMAGES_COIN[this.resolveImageIndex()];
        } else if (this.type === 'bottle') {
            path = this.IMAGES_BOTTLE[this.resolveImageIndex()];
        }
        this.img = this.imageCache[path];
    }

    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage > 80) {
            return 4;
        } else if (this.percentage > 60) {
            return 3;
        } else if (this.percentage > 40) {
            return 2;
        } else if (this.percentage > 20) {
            return 1;
        } else {
            return 0;
        }
    }
}
 