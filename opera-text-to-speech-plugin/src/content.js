console.log('Content script loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded');

    // Vérifie si l'utilisateur est en mode "reader view"
    if (document.body.classList.contains('reader-view')) {
        console.log('Reader view detected');
        
        // Extrait les titres (par exemple, <h1>, <h2>)
        const titles = Array.from(document.querySelectorAll('h1, h2')).map(el => el.innerText).join('. ');

        // Extrait le contenu principal
        const content = document.body.innerText;

        // Envoie les titres et le contenu pour lecture
        chrome.runtime.sendMessage({ action: 'speakText', titles, content }, function(response) {
            console.log('Response from background:', response);
        });
    } else {
        console.log('Not in reader view');
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "speakText") {
        console.log('Speaking text:', request);

        // Lecture des titres avec une intonation différente
        const titleUtterance = new SpeechSynthesisUtterance(request.titles);
        titleUtterance.pitch = 1.5; // Intonation plus élevée pour les titres
        titleUtterance.rate = 1.2;  // Légèrement plus rapide

        // Lecture du contenu principal
        const contentUtterance = new SpeechSynthesisUtterance(request.content);
        contentUtterance.pitch = 1.0; // Intonation normale
        contentUtterance.rate = 1.0;  // Vitesse normale

        // Enchaîne la lecture des titres et du contenu
        speechSynthesis.speak(titleUtterance);
        titleUtterance.onend = () => {
            speechSynthesis.speak(contentUtterance);
        };

        sendResponse({ status: "speaking" });
    }
});