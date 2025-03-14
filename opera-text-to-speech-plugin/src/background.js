// Ce fichier gère les événements en arrière-plan du plugin. Il peut écouter les messages des scripts de contenu et gérer les actions liées au texte à lire.

chrome.runtime.onInstalled.addListener(() => {
    console.log('Service worker installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received in background:', request);

    if (request.action === "speakText") {
        // Vérifie si sender.tab est défini
        if (sender.tab && sender.tab.id) {
            // Envoie un message au script de contenu pour lire le texte
            chrome.tabs.sendMessage(sender.tab.id, { action: "speakText", text: request.text });
            sendResponse({ status: "forwarded to content script" });
        } else {
            console.error('Error: sender.tab is undefined. Cannot send message to content script.');
            sendResponse({ status: "error", message: "sender.tab is undefined" });
        }
    }
});