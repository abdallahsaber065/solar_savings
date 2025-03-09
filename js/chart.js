/**
 * Solar Savings Calculator - Chart Module
 * Handles chart creation and updates
 */

// Store chart instances to update them later
let pgeChart, sunrunChart, comparisonChart;

// Initialize charts with data
function initializeCharts(yearlyData) {
    updateCharts(yearlyData);
}

// Update charts with new data
function updateCharts(yearlyData) {
    // Extract data for charts
    const years = yearlyData.map(data => `Year ${data.year}`);
    const pgeCosts = yearlyData.map(data => data.monthlyPgeCost);
    const sunrunCosts = yearlyData.map(data => data.monthlySunrunCost);
    
    // Destroy existing charts if they exist
    if (pgeChart) pgeChart.destroy();
    if (sunrunChart) sunrunChart.destroy();
    if (comparisonChart) comparisonChart.destroy();
    
    // Create PG&E chart
    const pgeCtx = document.getElementById('pge-chart').getContext('2d');
    pgeChart = new Chart(pgeCtx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Monthly PG&E Cost',
                data: pgeCosts,
                borderColor: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toFixed(0);
                        }
                    }
                }
            }
        }
    });
    
    // Create Sunrun chart
    const sunrunCtx = document.getElementById('sunrun-chart').getContext('2d');
    sunrunChart = new Chart(sunrunCtx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Monthly Sunrun Cost',
                data: sunrunCosts,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toFixed(0);
                        }
                    }
                }
            }
        }
    });
    
    // Create comparison chart
    const comparisonCtx = document.getElementById('comparison-chart').getContext('2d');
    comparisonChart = new Chart(comparisonCtx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    label: 'PG&E',
                    data: pgeCosts,
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.5)',
                    borderWidth: 2,
                    fill: true
                },
                {
                    label: 'Sunrun',
                    data: sunrunCosts,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.5)',
                    borderWidth: 2,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toFixed(0);
                        }
                    }
                }
            }
        }
    });
}

// Export functions for use in other modules
export { initializeCharts, updateCharts };