/**
 * Solar Savings Calculator - Single-file Script
 * Works when opened directly via file:// (no ES modules)
 */

// ---------- Calculator Logic ----------

function calculateSavings(inputValues) {
    const {
        annualKwhUsage,
        pgeRate,
        pgeAnnualRateIncrease,
        sunrunKwhRate,
        inflationEscalator,
        monthlyBattery
    } = inputValues;

    const avgKwhMonth = annualKwhUsage / 12;
    const monthlyElectricityPayments = (pgeRate * avgKwhMonth).toFixed(2);
    const annualElectricityPayments = (parseFloat(monthlyElectricityPayments) * 12).toFixed(2);

    const monthlySolar = (sunrunKwhRate * avgKwhMonth).toFixed(2);
    const monthlyPayment = (parseFloat(monthlySolar) + monthlyBattery).toFixed(2);
    const annualPayment = (parseFloat(monthlyPayment) * 12).toFixed(2);

    const rateSavings = ((pgeRate - sunrunKwhRate) / pgeRate * 100).toFixed(0);
    const monthlySavings = (parseFloat(monthlyElectricityPayments) - parseFloat(monthlyPayment)).toFixed(2);
    const annualSavings = (parseFloat(annualElectricityPayments) - parseFloat(annualPayment)).toFixed(2);

    const projections = calculate25YearProjections(
        pgeRate,
        pgeAnnualRateIncrease / 100,
        sunrunKwhRate,
        inflationEscalator / 100,
        annualKwhUsage,
        monthlyBattery
    );

    return {
        avgKwhMonth,
        monthlyElectricityPayments,
        annualElectricityPayments,
        monthlySolar,
        monthlyPayment,
        annualPayment,
        rateSavings,
        monthlySavings,
        annualSavings,
        projections
    };
}

function calculate25YearProjections(pgeRate, pgeAnnualRateIncrease, sunrunKwhRate, inflationEscalator, annualKwhUsage, monthlyBattery) {
    const yearlyData = [];
    let totalPgeSpend = 0;
    let totalSunrunSpend = 0;
    let totalSavings = 0;

    for (let year = 1; year <= 25; year++) {
        const currentPgeRate = pgeRate * Math.pow(1 + pgeAnnualRateIncrease, year - 1);
        const yearlyPgeCost = currentPgeRate * annualKwhUsage;
        const monthlyPgeCost = yearlyPgeCost / 12;

        const currentSunrunRate = sunrunKwhRate * Math.pow(1 + inflationEscalator, year - 1);
        const yearlySunrunCost = (currentSunrunRate * annualKwhUsage) + (monthlyBattery * 12);
        const monthlySunrunCost = yearlySunrunCost / 12;

        const yearlySavings = yearlyPgeCost - yearlySunrunCost;
        const monthlySavings = yearlySavings / 12;

        totalPgeSpend += yearlyPgeCost;
        totalSunrunSpend += yearlySunrunCost;
        totalSavings += yearlySavings;

        yearlyData.push({
            year,
            pgeRate: currentPgeRate,
            sunrunRate: currentSunrunRate,
            yearlyPgeCost,
            yearlySunrunCost,
            yearlySavings,
            monthlyPgeCost,
            monthlySunrunCost,
            monthlySavings,
            cumulativeSavings: totalSavings
        });
    }

    return {
        yearlyData,
        totalPgeSpend,
        totalSunrunSpend,
        lifetimeSavings: totalSavings,
        savingsYear5: yearlyData[4].cumulativeSavings,
        savingsYear10: yearlyData[9].cumulativeSavings,
        savingsYear15: yearlyData[14].cumulativeSavings,
        savingsYear20: yearlyData[19].cumulativeSavings,
        savingsYear25: yearlyData[24].cumulativeSavings
    };
}

// ---------- UI Helpers ----------

function updateUI(calculatedValues) {
    const {
        avgKwhMonth,
        monthlyElectricityPayments,
        annualElectricityPayments,
        monthlySolar,
        monthlyPayment,
        annualPayment,
        rateSavings,
        monthlySavings,
        annualSavings,
        projections
    } = calculatedValues;

    updateElement('pge-annual-kwh', getInputValue('annual-kwh-usage'));
    updateElement('pge-rate-display', `$${getInputValue('pge-rate')}`);
    updateElement('pge-increase-display', `${getInputValue('pge-annual-rate-increase')}%`);
    updateElement('avg-kwh-month', formatNumber(avgKwhMonth));
    updateElement('monthly-electricity-payments', formatCurrency(monthlyElectricityPayments));
    updateElement('annual-electricity-payments', formatCurrency(annualElectricityPayments));

    updateElement('sunrun-rate-display', `$${getInputValue('sunrun-kwh-rate')}`);
    updateElement('inflation-escalator-display', `${getInputValue('inflation-escalator')}%`);
    updateElement('monthly-solar', formatCurrency(monthlySolar));
    updateElement('monthly-battery-display', formatCurrency(getInputValue('monthly-battery')));
    updateElement('monthly-payment', formatCurrency(monthlyPayment));
    updateElement('annual-payment', formatCurrency(annualPayment));

    updateElement('rate-savings', `${rateSavings}%`);
    updateElement('monthly-savings', formatCurrency(monthlySavings));
    updateElement('annual-savings', formatCurrency(annualSavings));
    updateElement('lifetime-savings', formatCurrency(projections.lifetimeSavings));

    updateElement('total-sunrun-spend', formatCurrency(projections.totalSunrunSpend));
    updateElement('total-pge-spend', formatCurrency(projections.totalPgeSpend));

    updateElement('savings-year-5', formatCurrency(projections.savingsYear5));
    updateElement('savings-year-10', formatCurrency(projections.savingsYear10));
    updateElement('savings-year-15', formatCurrency(projections.savingsYear15));
    updateElement('savings-year-20', formatCurrency(projections.savingsYear20));
    updateElement('savings-year-25', formatCurrency(projections.savingsYear25));
}

function updateMonthlyComparisonTable(yearlyData) {
    const tableBody = document.querySelector('#monthly-comparison-table tbody');
    tableBody.innerHTML = '';

    yearlyData.forEach(data => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${data.year}</td>
            <td>${formatCurrency(data.monthlyPgeCost)}</td>
            <td>${formatCurrency(data.monthlySunrunCost)}</td>
            <td>${formatCurrency(data.monthlySavings)}</td>
        `;
        tableBody.appendChild(row);
    });
}

function getInputValues() {
    return {
        annualKwhUsage: parseFloat(getInputValue('annual-kwh-usage')),
        pgeRate: parseFloat(getInputValue('pge-rate')),
        pgeAnnualRateIncrease: parseFloat(getInputValue('pge-annual-rate-increase')),
        sunrunKwhRate: parseFloat(getInputValue('sunrun-kwh-rate')),
        inflationEscalator: parseFloat(getInputValue('inflation-escalator')),
        monthlyBattery: parseFloat(getInputValue('monthly-battery'))
    };
}

function getInputValue(id) {
    return document.getElementById(id).value;
}

function updateElement(id, value) {
    document.getElementById(id).textContent = value;
}

function formatCurrency(value) {
    return `$${formatNumber(value)}`;
}

function formatNumber(value) {
    return parseFloat(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// ---------- Charts ----------

let pgeChart, sunrunChart, comparisonChart;
let sharedMaxValue;

function updateCharts(yearlyData) {
    const labels = yearlyData.map(data => `Year ${data.year}`);
    const pgeCosts = yearlyData.map(data => data.monthlyPgeCost);
    const sunrunCosts = yearlyData.map(data => data.monthlySunrunCost);

    sharedMaxValue = Math.ceil(Math.max(...pgeCosts) * 1.1);

    if (pgeChart) pgeChart.destroy();
    if (sunrunChart) sunrunChart.destroy();
    if (comparisonChart) comparisonChart.destroy();

    pgeChart = createLineChart('pge-chart', 'Monthly PG&E Cost', labels, pgeCosts, '#e74c3c');
    sunrunChart = createLineChart('sunrun-chart', 'Monthly Sunrun Cost', labels, sunrunCosts, '#3498db');
    comparisonChart = createComparisonChart('comparison-chart', labels, pgeCosts, sunrunCosts);
}

function createLineChart(canvasId, label, labels, data, color) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label,
                data,
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

function createComparisonChart(canvasId, labels, pgeCosts, sunrunCosts) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels,
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

// ---------- Main wiring ----------

document.addEventListener('DOMContentLoaded', function () {
    const calculateBtn = document.getElementById('calculate-btn');
    const downloadPdfBtn = document.getElementById('download-pdf-btn');

    calculateBtn.addEventListener('click', performCalculation);
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', downloadReportAsPdf);
    }

    performCalculation();
});

function performCalculation() {
    const inputValues = getInputValues();
    const calculatedValues = calculateSavings(inputValues);
    updateUI(calculatedValues);
    updateMonthlyComparisonTable(calculatedValues.projections.yearlyData);
    updateCharts(calculatedValues.projections.yearlyData);
}

function downloadReportAsPdf() {
    window.print();
}
