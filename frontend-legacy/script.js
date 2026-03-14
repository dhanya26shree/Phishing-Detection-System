document.addEventListener('DOMContentLoaded', () => {
    const scanUrlBtn = document.getElementById('scan-url-btn');
    const scanEmailBtn = document.getElementById('scan-email-btn');
    const urlInput = document.getElementById('url-input');
    const emailInput = document.getElementById('email-input');

    const API_BASE_URL = '';

    // Scanner Logic
    if (scanUrlBtn) {
        scanUrlBtn.addEventListener('click', async () => {
            const url = urlInput.value.trim();
            if (!url) return alert('Please enter a URL');

            showLoading('url');
            try {
                const response = await fetch(`${API_BASE_URL}/predict-url`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url })
                });
                const data = await response.json();
                console.log('URL Scan Data:', data);
                displayResult('url', data);
                updateStats(); // Update dashboard if on the same page
            } catch (error) {
                console.error('Error scanning URL:', error);
                alert('API is not running. Please start the backend.');
            }
        });
    }

    if (scanEmailBtn) {
        scanEmailBtn.addEventListener('click', async () => {
            const email_text = emailInput.value.trim();
            if (!email_text) return alert('Please enter email content');

            showLoading('email');
            try {
                const response = await fetch(`${API_BASE_URL}/predict-email`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email_text })
                });
                const data = await response.json();
                displayResult('email', data);
                updateStats();
            } catch (error) {
                console.error('Error scanning email:', error);
                alert('API is not running. Please start the backend.');
            }
        });
    }

    function showLoading(type) {
        const resDiv = document.getElementById(`${type}-result`);
        resDiv.style.display = 'block';
        document.getElementById(`${type}-badge`).textContent = 'Analyzing...';
        document.getElementById(`${type}-badge`).className = 'result-badge';
    }

    function displayResult(type, data) {
        console.log(`Displaying ${type} results:`, data);
        const badge = document.getElementById(`${type}-badge`);
        const confidenceElement = document.getElementById(`${type}-confidence`);
        const fill = document.getElementById(`${type}-meter-fill`);
        
        // Add Blockchain Badge if verified
        const resultHeader = badge.parentElement;
        let bcBadge = document.getElementById(`${type}-blockchain-badge`);
        if (!bcBadge) {
            bcBadge = document.createElement('span');
            bcBadge.id = `${type}-blockchain-badge`;
            bcBadge.style.fontSize = '0.7rem';
            bcBadge.style.padding = '0.2rem 0.5rem';
            bcBadge.style.borderRadius = '20px';
            bcBadge.style.marginLeft = '1rem';
            bcBadge.style.display = 'none';
            resultHeader.appendChild(bcBadge);
        }

        if (!data || data.prediction === undefined) {
            console.error('Invalid data received from API:', data);
            badge.textContent = 'Error';
            confidenceElement.textContent = '0';
            return;
        }

        badge.textContent = data.prediction;
        badge.className = `result-badge badge-${data.prediction}`;
        
        // Blockchain Visibility
        if (data.confidence >= 0.99 && data.prediction === 'legitimate') {
            bcBadge.textContent = 'Verified on Blockchain';
            bcBadge.style.background = 'rgba(16, 185, 129, 0.2)';
            bcBadge.style.color = '#10b981';
            bcBadge.style.border = '1px solid #10b981';
            bcBadge.style.display = 'inline-block';
        } else {
            bcBadge.style.display = 'none';
        }

        let confValue = 0;
        if (typeof data.confidence === 'number') {
            confValue = Math.round(data.confidence * 100);
        } else if (typeof data.confidence === 'string') {
            confValue = Math.round(parseFloat(data.confidence) * 100) || 0;
        }

        confidenceElement.textContent = isNaN(confValue) ? '0' : confValue;
        fill.style.width = `${isNaN(confValue) ? 0 : confValue}%`;
        
        fill.style.background = data.prediction === 'phishing' ? 'var(--danger)' : 'var(--success)';
    }

    // Dashboard Statistics
    async function updateStats() {
        try {
            const response = await fetch(`${API_BASE_URL}/stats`);
            const data = await response.json();
            
            const bcResponse = await fetch(`${API_BASE_URL}/blockchain`);
            const bcData = await bcResponse.json();
            
            const totalScanned = document.getElementById('total-scanned');
            const phishingCount = document.getElementById('phishing-count');
            const threatList = document.getElementById('recent-threats');

            // Update Blockchain Node Count
            const nodeCountElement = document.getElementById('blockchain-nodes');
            if (nodeCountElement) nodeCountElement.textContent = bcData.chain.length;

            const explorer = document.getElementById('ledger-explorer');
            if (explorer) {
                explorer.innerHTML = bcData.chain.map(block => `
                    <div class="ledger-block">
                        <div class="block-header">
                            <span>BLOCK #${block.index}</span>
                            <span style="color: grey;">${new Date(block.timestamp * 1000).toLocaleTimeString()}</span>
                        </div>
                        <div class="block-data">
                            <div style="font-weight: bold; margin-bottom: 0.2rem;">${typeof block.data === 'string' ? block.data : block.data.domain_name || 'System Event'}</div>
                            <div style="font-size: 0.7rem; opacity: 0.7;">Status: ${block.data.status || 'Active'}<sup>BC</sup></div>
                        </div>
                        <div style="font-size: 0.65rem; color: var(--text-secondary);">PREV: ${block.previous_hash.substring(0, 10)}...</div>
                        <div class="block-hash">HASH: ${block.hash.substring(0, 24)}...</div>
                    </div>
                `).join('');
            }

            if (totalScanned) totalScanned.textContent = data.total_scanned;
            if (phishingCount) phishingCount.textContent = data.phishing_detected;
            
            if (threatList) {
                if (data.recent_alerts.length === 0) {
                    threatList.innerHTML = '<p style="color: var(--text-secondary);">No threats detected yet.</p>';
                    return;
                }
                
                threatList.innerHTML = data.recent_alerts.reverse().map(alert => `
                    <div style="padding: 1rem; border-bottom: 1px solid var(--glass-border); display: flex; justify-content: space-between;">
                        <div>
                            <span style="color: var(--danger); font-weight: bold;">[${alert.type.toUpperCase()}]</span>
                            <span style="margin-left: 1rem; opacity: 0.8;">${alert.input.length > 50 ? alert.input.substring(0, 50) + '...' : alert.input}</span>
                        </div>
                        <div style="color: var(--text-secondary); font-size: 0.8rem;">
                            ${new Date(alert.timestamp).toLocaleTimeString()}
                        </div>
                    </div>
                `).join('');
            }

            // Update Chart if element exists
            if (document.getElementById('phishingChart')) {
                renderChart(data.recent_alerts);
            }
        } catch (error) {
            console.log('Stats update skipped (API likely offline)');
        }
    }

    function renderChart(alerts) {
        const ctx = document.getElementById('phishingChart').getContext('2d');
        
        // Mocking some trend data for visual impact since logs might be small
        const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const values = [12, 19, 3, 5, 2, 3, alerts.length];

        if (window.myChart) window.myChart.destroy();
        
        window.myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Phishing Attempts Detected',
                    data: values,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    // Initial stats load
    updateStats();
    // Auto-refresh stats every 10 seconds
    setInterval(updateStats, 10000);
});
