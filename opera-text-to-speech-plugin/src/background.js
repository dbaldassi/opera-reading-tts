// Ce fichier gère les événements en arrière-plan du plugin. Il peut écouter les messages des scripts de contenu et gérer les actions liées au texte à lire.

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received in background:', request);
    if (request.action === "speakText") {
        const utterance = new SpeechSynthesisUtterance(request.text);
        speechSynthesis.speak(utterance);
        sendResponse({status: "speaking"});
    }
});