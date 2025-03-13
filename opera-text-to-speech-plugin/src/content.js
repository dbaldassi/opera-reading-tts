document.addEventListener('DOMContentLoaded', function() {
    // Vérifie si l'utilisateur est en mode "reader view"
    if (document.body.classList.contains('reader-view')) {
        // Extrait le texte du document
        const textContent = document.body.innerText;

        // Envoie le texte au script d'arrière-plan pour traitement
        chrome.runtime.sendMessage({ action: 'speak', text: textContent });
    }
});