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

                            // Lecture des titres avec une intonation différente
                            const titleUtterance = new SpeechSynthesisUtterance(title);
                            titleUtterance.pitch = 1.5; // Intonation plus élevée pour les titres
                            titleUtterance.rate = 1.2;  // Légèrement plus rapide

                            // Lecture du contenu principal
                            const contentUtterance = new SpeechSynthesisUtterance(content);
                            contentUtterance.pitch = 1.0; // Intonation normale
                            contentUtterance.rate = 1.0;  // Vitesse normale

                            // Enchaîne la lecture des titres et du contenu
                            speechSynthesis.speak(titleUtterance);
                            titleUtterance.onend = () => {
                                speechSynthesis.speak(contentUtterance);
                            };

                            // Réinitialise le texte du bouton Pause
                            const pauseButton = document.getElementById('pauseButton');
                            pauseButton.textContent = 'Pause';
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
    const pauseButton = document.getElementById('pauseButton');
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause();
        pauseButton.textContent = 'Reprendre';
        console.log('Speech paused');
    } else if (speechSynthesis.paused) {
        speechSynthesis.resume();
        pauseButton.textContent = 'Pause';
        console.log('Speech resumed');
    }
});

// Bouton Arrêter
document.getElementById('stopButton').addEventListener('click', () => {
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        console.log('Speech stopped');

        // Réinitialise le texte du bouton Pause
        const pauseButton = document.getElementById('pauseButton');
        pauseButton.textContent = 'Pause';
    }
});