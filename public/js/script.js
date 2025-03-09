// Import modules
import { calculateSavings } from './calculator.js';
import { updateUI, updateMonthlyComparisonTable, getInputValues } from './ui.js';
import { initializeCharts, updateCharts } from './chart.js';
import { sendEmail } from './email.js';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize calculator
    const calculateBtn = document.getElementById('calculate-btn');
    const emailBtn = document.getElementById('email-btn');
    
    // Add event listeners
    calculateBtn.addEventListener('click', performCalculation);
    emailBtn.addEventListener('click', sendEmail);
    
    // Run initial calculation
    performCalculation();
});

function performCalculation() {
    // Get input values
    const inputValues = getInputValues();
    
    // Calculate savings
    const calculatedValues = calculateSavings(inputValues);
    
    // Update UI
    updateUI(calculatedValues);
    
    // Update the monthly comparison table
    updateMonthlyComparisonTable(calculatedValues.projections.yearlyData);
    
    // Update charts
    updateCharts(calculatedValues.projections.yearlyData);
}