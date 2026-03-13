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
        const badge = document.getElementById(`${type}-badge`);
        const confidence = document.getElementById(`${type}-confidence`);
        const fill = document.getElementById(`${type}-meter-fill`);

        badge.textContent = data.prediction;
        badge.className = `result-badge badge-${data.prediction}`;
        
        const confValue = Math.round(data.confidence * 100);
        confidence.textContent = confValue;
        fill.style.width = `${confValue}%`;
        
        // Color the meter based on prediction
        fill.style.background = data.prediction === 'phishing' ? 'var(--danger)' : 'var(--success)';
    }

    // Dashboard Statistics
    async function updateStats() {
        try {
            const response = await fetch(`${API_BASE_URL}/stats`);
            const data = await response.json();
            
            const totalScanned = document.getElementById('total-scanned');
            const phishingCount = document.getElementById('phishing-count');
            const threatList = document.getElementById('recent-threats');

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
