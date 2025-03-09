/**
 * Solar Savings Calculator - UI Module
 * Handles all UI updates and DOM manipulation
 */

// Update the UI with calculated values
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

    // Update PG&E display values
    updateElement('pge-annual-kwh', getInputValue('annual-kwh-usage'));
    updateElement('pge-rate-display', `$${getInputValue('pge-rate')}`);
    updateElement('pge-increase-display', `${getInputValue('pge-annual-rate-increase')}%`);
    updateElement('avg-kwh-month', formatNumber(avgKwhMonth));
    updateElement('monthly-electricity-payments', formatCurrency(monthlyElectricityPayments));
    updateElement('annual-electricity-payments', formatCurrency(annualElectricityPayments));

    // Update Sunrun display values
    updateElement('sunrun-rate-display', `$${getInputValue('sunrun-kwh-rate')}`);
    updateElement('inflation-escalator-display', `${getInputValue('inflation-escalator')}%`);
    updateElement('monthly-solar', formatCurrency(monthlySolar));
    updateElement('monthly-battery-display', formatCurrency(getInputValue('monthly-battery')));
    updateElement('monthly-payment', formatCurrency(monthlyPayment));
    updateElement('annual-payment', formatCurrency(annualPayment));

    // Update Savings display values
    updateElement('rate-savings', `${rateSavings}%`);
    updateElement('monthly-savings', formatCurrency(monthlySavings));
    updateElement('annual-savings', formatCurrency(annualSavings));
    updateElement('lifetime-savings', formatCurrency(projections.lifetimeSavings));

    // Update totals
    updateElement('total-sunrun-spend', formatCurrency(projections.totalSunrunSpend));
    updateElement('total-pge-spend', formatCurrency(projections.totalPgeSpend));

    // Update milestone savings
    updateElement('savings-year-5', formatCurrency(projections.savingsYear5));
    updateElement('savings-year-10', formatCurrency(projections.savingsYear10));
    updateElement('savings-year-15', formatCurrency(projections.savingsYear15));
    updateElement('savings-year-20', formatCurrency(projections.savingsYear20));
    updateElement('savings-year-25', formatCurrency(projections.savingsYear25));
}

// Update the monthly comparison table
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

// Get all input values from the form
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

// Helper function to get input value
function getInputValue(id) {
    return document.getElementById(id).value;
}

// Helper function to update element text
function updateElement(id, value) {
    document.getElementById(id).textContent = value;
}

// Helper function to format currency
function formatCurrency(value) {
    return `$${formatNumber(value)}`;
}

// Helper function to format numbers
function formatNumber(value) {
    return parseFloat(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

export { updateUI, updateMonthlyComparisonTable, getInputValues };