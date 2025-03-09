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
    document.getElementById('pge-annual-kwh').textContent = parseFloat(document.getElementById('annual-kwh-usage').value).toLocaleString();
    document.getElementById('pge-rate-display').textContent = `$${parseFloat(document.getElementById('pge-rate').value).toFixed(3)}`;
    document.getElementById('pge-increase-display').textContent = `${document.getElementById('pge-annual-rate-increase').value}%`;
    document.getElementById('avg-kwh-month').textContent = avgKwhMonth.toLocaleString();
    document.getElementById('monthly-electricity-payments').textContent = `$${parseFloat(monthlyElectricityPayments).toLocaleString()}`;
    document.getElementById('annual-electricity-payments').textContent = `$${parseFloat(annualElectricityPayments).toLocaleString()}`;
    
    // Update Sunrun display values
    document.getElementById('sunrun-rate-display').textContent = `$${parseFloat(document.getElementById('sunrun-kwh-rate').value).toFixed(3)}`;
    document.getElementById('inflation-escalator-display').textContent = `${document.getElementById('inflation-escalator').value}%`;
    document.getElementById('monthly-solar').textContent = `$${parseFloat(monthlySolar).toLocaleString()}`;
    document.getElementById('monthly-battery-display').textContent = `$${parseFloat(document.getElementById('monthly-battery').value).toLocaleString()}`;
    document.getElementById('monthly-payment').textContent = `$${parseFloat(monthlyPayment).toLocaleString()}`;
    document.getElementById('annual-payment').textContent = `$${parseFloat(annualPayment).toLocaleString()}`;
    
    // Update Savings display values
    document.getElementById('rate-savings').textContent = `${rateSavings}%`;
    document.getElementById('monthly-savings').textContent = `$${parseFloat(monthlySavings).toLocaleString()}`;
    document.getElementById('annual-savings').textContent = `$${parseFloat(annualSavings).toLocaleString()}`;
    document.getElementById('lifetime-savings').textContent = `$${projections.lifetimeSavings.toLocaleString()}`;
    
    // Update totals
    document.getElementById('total-sunrun-spend').textContent = `$${projections.totalSunrunSpend.toLocaleString()}`;
    document.getElementById('total-pge-spend').textContent = `$${projections.totalPgeSpend.toLocaleString()}`;
    
    // Update milestone savings
    document.getElementById('savings-year-5').textContent = `$${projections.savingsYear5.toLocaleString()}`;
    document.getElementById('savings-year-10').textContent = `$${projections.savingsYear10.toLocaleString()}`;
    document.getElementById('savings-year-15').textContent = `$${projections.savingsYear15.toLocaleString()}`;
    document.getElementById('savings-year-20').textContent = `$${projections.savingsYear20.toLocaleString()}`;
    document.getElementById('savings-year-25').textContent = `$${projections.savingsYear25.toLocaleString()}`;
}

// Update the monthly comparison table with yearly data
function updateMonthlyComparisonTable(yearlyData) {
    const tableBody = document.querySelector('#monthly-comparison-table tbody');
    tableBody.innerHTML = '';
    
    yearlyData.forEach(data => {
        const row = document.createElement('tr');
        
        // Year column
        const yearCell = document.createElement('td');
        yearCell.textContent = data.year;
        row.appendChild(yearCell);
        
        // PG&E column
        const pgeCell = document.createElement('td');
        pgeCell.textContent = `$${data.monthlyPgeCost.toFixed(2)}`;
        row.appendChild(pgeCell);
        
        // Sunrun column
        const sunrunCell = document.createElement('td');
        sunrunCell.textContent = `$${data.monthlySunrunCost.toFixed(2)}`;
        row.appendChild(sunrunCell);
        
        // Monthly Savings column
        const savingsCell = document.createElement('td');
        savingsCell.textContent = `$${data.monthlySavings.toFixed(2)}`;
        row.appendChild(savingsCell);
        
        tableBody.appendChild(row);
    });
}

// Get the current input values from the form
function getInputValues() {
    return {
        annualKwhUsage: parseFloat(document.getElementById('annual-kwh-usage').value),
        pgeRate: parseFloat(document.getElementById('pge-rate').value),
        pgeAnnualRateIncrease: parseFloat(document.getElementById('pge-annual-rate-increase').value) / 100,
        sunrunKwhRate: parseFloat(document.getElementById('sunrun-kwh-rate').value),
        inflationEscalator: parseFloat(document.getElementById('inflation-escalator').value) / 100,
        monthlyBattery: parseFloat(document.getElementById('monthly-battery').value)
    };
}

// Export functions for use in other modules
export { updateUI, updateMonthlyComparisonTable, getInputValues };