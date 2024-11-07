function openGameplayOverlay() {
    document.getElementById('gameplayOverlay').style.display = 'flex';
}

function closeGameplayOverlay(event) {
    if (event.target.id === 'gameplayOverlay' || event.target.className === 'close-btn') {
        document.getElementById('gameplayOverlay').style.display = 'none';
    }
}

function openImpressumOverlay() {
    document.getElementById('impressumOverlay').style.display = 'flex';
}

function closeImpressumOverlay(event) {
    if (event.target.id === 'impressumOverlay' || event.target.className === 'close-btn') {
        document.getElementById('impressumOverlay').style.display = 'none';
    }
}