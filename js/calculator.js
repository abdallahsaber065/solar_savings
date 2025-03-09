/**
 * Solar Savings Calculator - Calculation Module
 * Handles all the calculation logic for the solar savings calculator
 */

// Calculate savings based on input values
function calculateSavings(inputValues) {
    // Extract input values
    const {
        annualKwhUsage,
        pgeRate,
        pgeAnnualRateIncrease,
        sunrunKwhRate,
        inflationEscalator,
        monthlyBattery
    } = inputValues;
    
    // Calculate PG&E values
    const avgKwhMonth = annualKwhUsage / 12;
    const monthlyElectricityPayments = (pgeRate * avgKwhMonth).toFixed(2);
    const annualElectricityPayments = (parseFloat(monthlyElectricityPayments) * 12).toFixed(2);
    
    // Calculate Sunrun values
    const monthlySolar = (sunrunKwhRate * avgKwhMonth).toFixed(2);
    const monthlyPayment = (parseFloat(monthlySolar) + monthlyBattery).toFixed(2);
    const annualPayment = (parseFloat(monthlyPayment) * 12).toFixed(2);
    
    // Calculate savings
    const rateSavings = ((pgeRate - sunrunKwhRate) / pgeRate * 100).toFixed(0);
    const monthlySavings = (parseFloat(monthlyElectricityPayments) - parseFloat(monthlyPayment)).toFixed(2);
    const annualSavings = (parseFloat(annualElectricityPayments) - parseFloat(annualPayment)).toFixed(2);
    
    // Calculate 25-year projections
    const projections = calculate25YearProjections(
        pgeRate, 
        pgeAnnualRateIncrease, 
        sunrunKwhRate, 
        inflationEscalator, 
        annualKwhUsage, 
        monthlyBattery
    );
    
    return {
        // PG&E values
        avgKwhMonth,
        monthlyElectricityPayments,
        annualElectricityPayments,
        
        // Sunrun values
        monthlySolar,
        monthlyPayment,
        annualPayment,
        
        // Savings values
        rateSavings,
        monthlySavings,
        annualSavings,
        
        // Projections
        projections
    };
}

// Calculate 25-year projections based on input values
function calculate25YearProjections(pgeRate, pgeAnnualRateIncrease, sunrunKwhRate, inflationEscalator, annualKwhUsage, monthlyBattery) {
    const yearlyData = [];
    let totalPgeSpend = 0;
    let totalSunrunSpend = 0;
    let totalSavings = 0;
    
    const avgKwhMonth = annualKwhUsage / 12;
    
    for (let year = 1; year <= 25; year++) {
        // Calculate PG&E costs with annual rate increase
        const currentPgeRate = pgeRate * Math.pow(1 + pgeAnnualRateIncrease, year - 1);
        const yearlyPgeCost = currentPgeRate * annualKwhUsage;
        const monthlyPgeCost = yearlyPgeCost / 12;
        
        // Calculate Sunrun costs with inflation escalator
        const currentSunrunRate = sunrunKwhRate * Math.pow(1 + inflationEscalator, year - 1);
        const yearlySunrunCost = (currentSunrunRate * annualKwhUsage) + (monthlyBattery * 12);
        const monthlySunrunCost = yearlySunrunCost / 12;
        
        // Calculate savings
        const yearlySavings = yearlyPgeCost - yearlySunrunCost;
        const monthlySavings = yearlySavings / 12;
        
        // Update totals
        totalPgeSpend += yearlyPgeCost;
        totalSunrunSpend += yearlySunrunCost;
        totalSavings += yearlySavings;
        
        // Store data for this year
        yearlyData.push({
            year: year,
            pgeRate: currentPgeRate,
            sunrunRate: currentSunrunRate,
            yearlyPgeCost: yearlyPgeCost,
            yearlySunrunCost: yearlySunrunCost,
            yearlySavings: yearlySavings,
            monthlyPgeCost: monthlyPgeCost,
            monthlySunrunCost: monthlySunrunCost,
            monthlySavings: monthlySavings,
            cumulativeSavings: totalSavings
        });
    }
    
    return {
        yearlyData: yearlyData,
        totalPgeSpend: totalPgeSpend,
        totalSunrunSpend: totalSunrunSpend,
        lifetimeSavings: totalSavings,
        savingsYear5: yearlyData[4].cumulativeSavings,
        savingsYear10: yearlyData[9].cumulativeSavings,
        savingsYear15: yearlyData[14].cumulativeSavings,
        savingsYear20: yearlyData[19].cumulativeSavings,
        savingsYear25: yearlyData[24].cumulativeSavings
    };
}

// Export functions for use in other modules
export { calculateSavings, calculate25YearProjections };