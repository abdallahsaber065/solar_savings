/**
 * Solar Savings Calculator - Main Script
 * Integrates all modules and initializes the calculator
 */

// Import modules
import { calculateSavings } from './js/calculator.js';
import { updateUI, updateMonthlyComparisonTable, getInputValues } from './js/ui.js';
import { initializeCharts, updateCharts } from './js/chart.js';
import { sendEmail } from './js/email.js';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the calculator directly since Chart.js is loaded in the HTML
    initializeCalculator();
    
    function initializeCalculator() {
        // Get DOM elements
        const calculateBtn = document.getElementById('calculate-btn');
        const emailBtn = document.getElementById('email-btn');
        
        // Add event listeners
        calculateBtn.addEventListener('click', performCalculation);
        emailBtn.addEventListener('click', sendEmail);
        
        // Run initial calculation
        performCalculation();
    }
    
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
});
