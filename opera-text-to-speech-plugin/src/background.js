// Ce fichier gère les événements en arrière-plan du plugin. Il peut écouter les messages des scripts de contenu et gérer les actions liées au texte à lire.

chrome.runtime.onInstalled.addListener(() => {
    console.log('Service worker installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received in background:', request);

    if (request.action === "speakText") {
        // Vérifie si sender.tab est défini
        const tabId = sender.tab ? sender.tab.id : null;

        if (tabId) {
            // Envoie un message au script de contenu pour lire le texte
            chrome.tabs.sendMessage(tabId, { action: "speakText", text: request.text });
            sendResponse({ status: "forwarded to content script" });
        } else {
            // Si sender.tab est undefined, récupère l'onglet actif
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length > 0) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: "speakText", text: request.text });
                    sendResponse({ status: "forwarded to content script via active tab" });
                } else {
                    console.error('Error: No active tab found. Cannot send message to content script.');
                    sendResponse({ status: "error", message: "No active tab found" });
                }
            });

            // Indique que la réponse sera envoyée de manière asynchrone
            return true;
        }
    }
});