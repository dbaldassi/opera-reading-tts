console.log('Content script loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded');

    // Vérifie si l'utilisateur est en mode "reader view"
    if (document.body.classList.contains('reader-view')) {
        console.log('Reader view detected');
        
        // Extrait le texte du document
        const textContent = document.body.innerText;
        console.log('Text content extracted:', textContent);

        // Envoie le texte au script d'arrière-plan pour traitement
        chrome.runtime.sendMessage({ action: 'speakText', text: textContent }, function(response) {
            console.log('Response from background:', response);
        });
    } else {
        console.log('Not in reader view');
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "speakText") {
        console.log('Speaking text:', request.text);
        const utterance = new SpeechSynthesisUtterance(request.text);
        speechSynthesis.speak(utterance);
        sendResponse({ status: "speaking" });
    }
});