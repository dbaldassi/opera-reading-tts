document.getElementById('speakButton').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'triggerTTS' });
});