import { computeSHA256, getVerificationData } from './src/lib/crypto';

async function computeDemoHashes() {
    const demos = [
        {
            url: 'https://secure-bank-verify.xyz/login',
            prediction: 'phishing',
            timestamp: '2026-03-23T18:00:00.000Z',
        },
        {
            url: 'https://google.com',
            prediction: 'safe',
            timestamp: '2026-03-23T17:00:00.000Z',
        },
        {
            url: 'https://paypal-secure-alert.net',
            prediction: 'suspicious',
            timestamp: '2026-03-23T16:00:00.000Z',
        }
    ];

    for (const d of demos) {
        const hash = await computeSHA256(getVerificationData(d));
        console.log(`URL: ${d.url} | Timestamp: ${d.timestamp} | Prediction: ${d.prediction}`);
        console.log(`Computed Hash: ${hash}`);
    }
}

computeDemoHashes();
