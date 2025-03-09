/**
 * Solar Savings Calculator - Chart Module
 * Handles chart creation and updates
 */

// Store chart instances and shared max value
let pgeChart, sunrunChart, comparisonChart;
let sharedMaxValue;

// Initialize charts with data
function initializeCharts(yearlyData) {
    updateCharts(yearlyData);
}

// Update all charts with new data
function updateCharts(yearlyData) {
    const labels = yearlyData.map(data => `Year ${data.year}`);
    const pgeCosts = yearlyData.map(data => data.monthlyPgeCost);
    const sunrunCosts = yearlyData.map(data => data.monthlySunrunCost);

    // Calculate shared max value from PG&E costs (highest value)
    sharedMaxValue = Math.ceil(Math.max(...pgeCosts) * 1.1); // Add 10% padding

    // Destroy existing charts if they exist
    if (pgeChart) pgeChart.destroy();
    if (sunrunChart) sunrunChart.destroy();
    if (comparisonChart) comparisonChart.destroy();

    // Create PG&E chart
    pgeChart = createLineChart('pge-chart', 'Monthly PG&E Cost', labels, pgeCosts, '#e74c3c');

    // Create Sunrun chart
    sunrunChart = createLineChart('sunrun-chart', 'Monthly Sunrun Cost', labels, sunrunCosts, '#3498db');

    // Create comparison chart
    comparisonChart = createComparisonChart('comparison-chart', labels, pgeCosts, sunrunCosts);
}

// Create a line chart with given parameters
function createLineChart(canvasId, label, labels, data, color) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                borderColor: color,
                backgroundColor: color.replace(')', ', 0.1)').replace('rgb', 'rgba'),
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: getChartOptions()
    });
}

// Create a comparison chart with both PG&E and Sunrun data
function createComparisonChart(canvasId, labels, pgeCosts, sunrunCosts) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'PG&E',
                    data: pgeCosts,
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Sunrun',
                    data: sunrunCosts,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: getChartOptions()
    });
}

// Get common chart options
function getChartOptions() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: sharedMaxValue,
                ticks: {
                    callback: value => '$' + value.toFixed(0)
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: context => {
                        const label = context.dataset.label || '';
                        const value = context.parsed.y;
                        return `${label}: $${value.toFixed(2)}`;
                    }
                }
            }
        }
    };
}

export { initializeCharts, updateCharts };