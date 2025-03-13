// Ce fichier gère les événements en arrière-plan du plugin. Il peut écouter les messages des scripts de contenu et gérer les actions liées au texte à lire.

chrome.runtime.onInstalled.addListener(() => {
    console.log('Service worker installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received in background:', request);
    if (request.action === "triggerTTS") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tabId = tabs[0].id;
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['content.js']
            }, () => {
                console.log('Content script injected');
            });
        });
    } else if (request.action === "speakText") {
        const utterance = new SpeechSynthesisUtterance(request.text);
        speechSynthesis.speak(utterance);
        sendResponse({ status: "speaking" });
    }
});