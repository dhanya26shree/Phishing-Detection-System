// Basic content script to scan current URL
console.log("Phish Shield AI: Scanning current page...");

const currentUrl = window.location.href;

async function checkUrl(url) {
    try {
        const response = await fetch('http://localhost:8000/predict-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });
        const data = await response.json();
        
        if (data.prediction === 'phishing') {
            showWarning(data.confidence);
        }
    } catch (error) {
        console.log("Phish Shield AI: Detection API offline or unreachable.");
    }
}

function showWarning(confidence) {
    const div = document.createElement('div');
    div.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 20px;
        border-radius: 12px;
        z-index: 10000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        font-family: sans-serif;
        max-width: 300px;
    `;
    div.innerHTML = `
        <h3 style="margin: 0 0 10px 0;">⚠️ Phishing Detected!</h3>
        <p style="margin: 0; font-size: 14px;">This site has a <b>${Math.round(confidence * 100)}%</b> probability of being a phishing attempt.</p>
        <button id="close-phish-warn" style="margin-top: 15px; background: white; color: #ef4444; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Close</button>
    `;
    document.body.appendChild(div);
    
    document.getElementById('close-phish-warn').onclick = () => div.remove();
}

// Run check
if (!currentUrl.includes('localhost')) {
    checkUrl(currentUrl);
}
