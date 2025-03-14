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