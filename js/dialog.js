/**
 * Opens the gameplay overlay, making it visible to the user.
 */
function openGameplayOverlay() {
    document.getElementById('gameplayOverlay').style.display = 'flex';
}

/**
 * Closes the gameplay overlay when the specified target element is clicked.
 * @param {Event} event - The event object containing information about the clicked element.
 */
function closeGameplayOverlay(event) {
    if (event.target.id === 'gameplayOverlay' || event.target.className === 'close-btn') {
        document.getElementById('gameplayOverlay').style.display = 'none';
    }
}

/**
 * Opens the impressum overlay, making it visible to the user.
 */
function openImpressumOverlay() {
    document.getElementById('impressumOverlay').style.display = 'flex';
}

/**
 * Closes the impressum overlay when the specified target element is clicked.
 * @param {Event} event - The event object containing information about the clicked element.
 */
function closeImpressumOverlay(event) {
    if (event.target.id === 'impressumOverlay' || event.target.className === 'close-btn') {
        document.getElementById('impressumOverlay').style.display = 'none';
    }
}