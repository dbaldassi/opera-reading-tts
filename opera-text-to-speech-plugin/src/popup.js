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
                            return article ? article.textContent : 'Impossible d\'extraire le contenu.';
                        },
                    },
                    (results) => {
                        if (results && results[0] && results[0].result) {
                            const textContent = results[0].result;
                            chrome.runtime.sendMessage({ action: 'speakText', text: textContent });
                        } else {
                            console.error('Failed to extract readable content.');
                        }
                    }
                );
            }
        );
    });
});