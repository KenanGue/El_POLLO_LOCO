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

    IMAGES_ENDBOSS = [
        'img/7_statusbars/2_statusbar_endboss/green/green0.png',
        'img/7_statusbars/2_statusbar_endboss/green/green20.png',
        'img/7_statusbars/2_statusbar_endboss/green/green40.png',
        'img/7_statusbars/2_statusbar_endboss/green/green60.png',
        'img/7_statusbars/2_statusbar_endboss/green/green80.png',
        'img/7_statusbars/2_statusbar_endboss/green/green100.png'
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
        } else if (type === 'endboss') {
            this.loadImages(this.IMAGES_ENDBOSS);
            this.setPercentage(100);  // Endboss startet bei 100%
            this.x = 480;  // Setze x für rechte Seite (je nach Canvas-Breite anpassen)
            this.y = 5;    // Setze y für obere Ecke
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

    useItem() {
        if (this.currentItems > 0) {
            this.currentItems--;  // Verringere die Anzahl der Flaschen
            let percentage = (this.currentItems / this.maxItems) * 100;
            this.setPercentage(percentage);  // Aktualisiere die Statusleiste basierend auf der verbleibenden Anzahl
        }
    }

    // Setze den Prozentsatz und aktualisiere das Bild der Statusleiste
    setPercentage(percentage) {
        this.percentage = Math.max(0, Math.min(percentage, 100));  // Sicherstellen, dass der Wert zwischen 0 und 100 bleibt
    
        let path;
    
        // Wähle das Bild basierend auf dem Typ der Statusleiste
        if (this.type === 'health') {
            path = this.IMAGES_HEALTH[this.resolveImageIndex()];
        } else if (this.type === 'coin') {
            path = this.IMAGES_COIN[this.resolveImageIndex()];
        } else if (this.type === 'bottle') {
            path = this.IMAGES_BOTTLE[this.resolveImageIndex()];
        } else if (this.type === 'endboss') {
            path = this.IMAGES_ENDBOSS[this.resolveImageIndex()];
        }
    
        // Lade das entsprechende Bild nur dann, wenn sich der Wert geändert hat
        if (this.img !== this.imageCache[path]) {
            this.img = this.imageCache[path];  // Aktualisiere das Bild nur bei Bedarf
        }
    }
    
    
    // Berechne den Bildindex basierend auf dem aktuellen Prozentsatz
    resolveImageIndex() {
        const thresholds = [0, 20, 40, 60, 80, 100];  // Definierte Schwellenwerte für die Prozentstufen
        for (let i = thresholds.length - 1; i >= 0; i--) {
            if (this.percentage >= thresholds[i]) {
                return i;  // Gib den Index des Bildes zurück, basierend auf der Schwelle
            }
        }
        return 0;  // Fallback auf 0, wenn die Energie unter dem ersten Schwellenwert liegt
    }
    
    reset() {
        if (this.type === 'coin' || this.type === 'bottle') {
            this.percentage = 0;  // Setze Münzen und Flaschen auf 0
            this.currentItems = 0;  // Setze die Anzahl gesammelter Items auf 0
        } else {
            this.percentage = 100;  // Setze Gesundheit und Endboss auf 100
        }
        this.setPercentage(this.percentage);  // Aktualisiere die Statusleiste
    }
    
    
}
