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

    percentage = 100;  // Initialer Wert für Health, Coins und Bottles beginnen bei 0
    type;              // Typ der Statusleiste ('health', 'coin', 'bottle')
    maxItems;          // Maximale Anzahl an Items (nur für Münzen und Flaschen relevant)
    currentItems = 0;  // Gesammelte Anzahl an Münzen oder Flaschen

    constructor(type, maxItems = 10) {
        super();
        this.type = type;
        this.maxItems = maxItems;  // Setze maximale Anzahl der Items (z.B. 10 Flaschen oder Münzen)

        // Initialisiere Statusleisten basierend auf dem Typ
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
            this.setPercentage(0);  // Flaschen starten bei 0%
            this.x = 40;
            this.y = 120;  // Bottle-Statusbar ist unter der Coin-Statusbar
        }

        this.width = 200;
        this.height = 60;
    }

    // Methode, um gesammelte Münzen oder Flaschen zu erhöhen
    collectItem() {
        if (this.currentItems < this.maxItems) {
            this.currentItems++;  // Erhöhe die Anzahl der gesammelten Items
            let percentage = (this.currentItems / this.maxItems) * 100;
            this.setPercentage(percentage);  // Aktualisiere die Statusleiste basierend auf der Anzahl der gesammelten Items
        }
    }

    // Setze den Prozentsatz und aktualisiere das Bild der Statusleiste
    setPercentage(percentage) {
        this.percentage = percentage;
        let path;

        // Wähle das Bild basierend auf dem Typ der Statusleiste (Health, Coin, Bottle)
        if (this.type === 'health') {
            path = this.IMAGES_HEALTH[this.resolveImageIndex()];
        } else if (this.type === 'coin') {
            path = this.IMAGES_COIN[this.resolveImageIndex()];
        } else if (this.type === 'bottle') {
            path = this.IMAGES_BOTTLE[this.resolveImageIndex()];
        }

        this.img = this.imageCache[path];  // Lade das entsprechende Bild aus dem Cache
    }

    // Berechne den Bildindex basierend auf dem aktuellen Prozentsatz
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
