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

                            // Recherche et concatène tous les titres (h1, h2, h3)
                            const titles = Array.from(document.querySelectorAll('h1, h2, h3'))
                                .map(el => el.innerText.trim())
                                .filter(text => text.length > 0) // Filtre les titres vides
                                .join('. '); // Concatène les titres avec un point

                            return {
                                title: titles || 'Aucun titre trouvé',
                                content: article?.textContent || 'Contenu indisponible',
                            };
                        },
                    },
                    (results) => {
                        if (results && results[0] && results[0].result) {
                            const { title, content } = results[0].result;
                            chrome.runtime.sendMessage({ action: 'speakText', titles: title, content: content });
                        } else {
                            console.error('Failed to extract readable content.');
                        }
                    }
                );
            }
        );
    });
});