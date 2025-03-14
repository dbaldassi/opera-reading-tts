let utterance; // Variable pour stocker l'instance de SpeechSynthesisUtterance

document.getElementById('speakButton').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs[0].id;
        chrome.scripting.executeScript(
            {
                target: { tabId: tabId },
                files: ['readability.js'], // Charge Readability
            },
            () => {
                chrome.scripting.executeScript(
                    {
                        target: { tabId: tabId },
                        func: () => {
                            // Utilise Readability pour extraire le contenu principal
                            const article = new Readability(document.cloneNode(true)).parse();
                            if (article) {
                                return {
                                    title: article.title || 'Titre indisponible',
                                    content: article.textContent || 'Contenu indisponible',
                                };
                            } else {
                                return null;
                            }
                        },
                    },
                    (results) => {
                        if (results && results[0] && results[0].result) {
                            const { title, content } = results[0].result;

                            // Crée une instance de SpeechSynthesisUtterance pour lire le texte
                            utterance = new SpeechSynthesisUtterance(`${title}. ${content}`);
                            utterance.pitch = 1.0; // Intonation normale
                            utterance.rate = 1.0;  // Vitesse normale

                            // Démarre la lecture
                            speechSynthesis.speak(utterance);
                        } else {
                            console.error('Failed to extract readable content.');
                        }
                    }
                );
            }
        );
    });
});

// Bouton Pause
document.getElementById('pauseButton').addEventListener('click', () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause();
        console.log('Speech paused');
    }
});

// Bouton Arrêter
document.getElementById('stopButton').addEventListener('click', () => {
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        console.log('Speech stopped');
    }
});