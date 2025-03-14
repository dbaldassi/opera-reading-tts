// Ce fichier gère les événements en arrière-plan du plugin. Il peut écouter les messages des scripts de contenu et gérer les actions liées au texte à lire.

chrome.runtime.onInstalled.addListener(() => {
    console.log('Service worker installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received in background:', request);

    if (request.action === "speakText") {
        const tabId = sender.tab ? sender.tab.id : null;

        if (tabId) {
            console.log('Sending message to content script with tabId:', tabId);
            chrome.tabs.sendMessage(tabId, { 
                action: "speakText", 
                titles: request.titles, 
                content: request.content 
            });
            sendResponse({ status: "forwarded to content script" });
        } else {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length > 0) {
                    console.log('Sending message to active tab:', tabs[0].id);
                    chrome.tabs.sendMessage(tabs[0].id, { 
                        action: "speakText", 
                        titles: request.titles, 
                        content: request.content 
                    });
                    sendResponse({ status: "forwarded to content script via active tab" });
                } else {
                    console.error('Error: No active tab found. Cannot send message to content script.');
                    sendResponse({ status: "error", message: "No active tab found" });
                }
            });

            return true; // Indique que la réponse sera envoyée de manière asynchrone
        }
    }
});