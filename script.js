document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const calculateBtn = document.getElementById('calculate-btn');
    const emailBtn = document.getElementById('email-btn');
    
    // Input elements
    const annualKwhUsageInput = document.getElementById('annual-kwh-usage');
    const pgeRateInput = document.getElementById('pge-rate');
    const pgeAnnualRateIncreaseInput = document.getElementById('pge-annual-rate-increase');
    const sunrunKwhRateInput = document.getElementById('sunrun-kwh-rate');
    const inflationEscalatorInput = document.getElementById('inflation-escalator');
    const monthlyBatteryInput = document.getElementById('monthly-battery');
    
    // Initialize charts
    let pgeChart, sunrunChart, comparisonChart;
    
    // Initialize the calculator with default values
    calculateSavings();
    
    // Add event listener to calculate button
    calculateBtn.addEventListener('click', calculateSavings);
    
    // Add event listener to email button
    emailBtn.addEventListener('click', sendEmail);
    
    function calculateSavings() {
        // Get input values
        const annualKwhUsage = parseFloat(annualKwhUsageInput.value);
        const pgeRate = parseFloat(pgeRateInput.value);
        const pgeAnnualRateIncrease = parseFloat(pgeAnnualRateIncreaseInput.value) / 100;
        const sunrunKwhRate = parseFloat(sunrunKwhRateInput.value);
        const inflationEscalator = parseFloat(inflationEscalatorInput.value) / 100;
        const monthlyBattery = parseFloat(monthlyBatteryInput.value);
        
        // Calculate PG&E values
        const avgKwhMonth = annualKwhUsage / 12;
        const monthlyElectricityPayments = (pgeRate * avgKwhMonth).toFixed(2);
        const annualElectricityPayments = (monthlyElectricityPayments * 12).toFixed(2);
        
        // Calculate Sunrun values
        const monthlySolar = (sunrunKwhRate * avgKwhMonth).toFixed(2);
        const monthlyPayment = (parseFloat(monthlySolar) + monthlyBattery).toFixed(2);
        const annualPayment = (monthlyPayment * 12).toFixed(2);
        
        // Calculate savings
        const rateSavings = ((pgeRate - sunrunKwhRate) / pgeRate * 100).toFixed(0);
        const monthlySavings = (monthlyElectricityPayments - monthlyPayment).toFixed(2);
        const annualSavings = (annualElectricityPayments - annualPayment).toFixed(2);
        
        // Calculate 25-year projections
        const projections = calculate25YearProjections(pgeRate, pgeAnnualRateIncrease, sunrunKwhRate, inflationEscalator, annualKwhUsage, monthlyBattery);
        
        // Update PG&E display values
        document.getElementById('pge-annual-kwh').textContent = annualKwhUsage.toLocaleString();
        document.getElementById('pge-rate-display').textContent = `$${pgeRate.toFixed(3)}`;
        document.getElementById('pge-increase-display').textContent = `${pgeAnnualRateIncreaseInput.value}%`;
        document.getElementById('avg-kwh-month').textContent = avgKwhMonth.toLocaleString();
        document.getElementById('monthly-electricity-payments').textContent = `$${parseFloat(monthlyElectricityPayments).toLocaleString()}`;
        document.getElementById('annual-electricity-payments').textContent = `$${parseFloat(annualElectricityPayments).toLocaleString()}`;
        
        // Update Sunrun display values
        document.getElementById('sunrun-rate-display').textContent = `$${sunrunKwhRate.toFixed(3)}`;
        document.getElementById('inflation-escalator-display').textContent = `${inflationEscalatorInput.value}%`;
        document.getElementById('monthly-solar').textContent = `$${parseFloat(monthlySolar).toLocaleString()}`;
        document.getElementById('monthly-battery-display').textContent = `$${monthlyBattery.toLocaleString()}`;
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
        
        // Update monthly comparison table
        updateMonthlyComparisonTable(projections.yearlyData);
        
        // Update charts
        updateCharts(projections.yearlyData);
    }
    
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
    
    function sendEmail() {
        const customerName = document.getElementById('customer-name').value;
        const customerEmail = document.getElementById('customer-email').value;
        
        if (!customerName || !customerEmail) {
            alert('Please enter customer name and email address.');
            return;
        }
        
        // Get all the calculated values
        const annualKwhUsage = document.getElementById('pge-annual-kwh').textContent;
        const pgeRate = document.getElementById('pge-rate-display').textContent;
        const pgeIncrease = document.getElementById('pge-increase-display').textContent;
        const avgKwhMonth = document.getElementById('avg-kwh-month').textContent;
        const monthlyElectricityPayments = document.getElementById('monthly-electricity-payments').textContent;
        const annualElectricityPayments = document.getElementById('annual-electricity-payments').textContent;
        
        const sunrunRate = document.getElementById('sunrun-rate-display').textContent;
        const inflationEscalator = document.getElementById('inflation-escalator-display').textContent;
        const monthlySolar = document.getElementById('monthly-solar').textContent;
        const monthlyBattery = document.getElementById('monthly-battery-display').textContent;
        const monthlyPayment = document.getElementById('monthly-payment').textContent;
        const annualPayment = document.getElementById('annual-payment').textContent;
        
        const rateSavings = document.getElementById('rate-savings').textContent;
        const monthlySavings = document.getElementById('monthly-savings').textContent;
        const annualSavings = document.getElementById('annual-savings').textContent;
        const lifetimeSavings = document.getElementById('lifetime-savings').textContent;
        
        const totalSunrunSpend = document.getElementById('total-sunrun-spend').textContent;
        const totalPgeSpend = document.getElementById('total-pge-spend').textContent;
        
        const savingsYear5 = document.getElementById('savings-year-5').textContent;
        const savingsYear10 = document.getElementById('savings-year-10').textContent;
        const savingsYear15 = document.getElementById('savings-year-15').textContent;
        const savingsYear20 = document.getElementById('savings-year-20').textContent;
        const savingsYear25 = document.getElementById('savings-year-25').textContent;
        
        // Create email content
        const emailSubject = `Solar Savings Report for ${customerName}`;
        const emailBody = `
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; }
                    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
                    h1 { color: #1a5276; text-align: center; }
                    .section { margin-bottom: 20px; }
                    .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; }
                    .column { padding: 15px; border-radius: 8px; }
                    .pge { background-color: #e74c3c; color: white; }
                    .sunrun { background-color: #3498db; color: white; }
                    .savings { background-color: #27ae60; color: white; }
                    .item { display: flex; justify-content: space-between; margin-bottom: 10px; padding: 5px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.2); }
                    .totals { background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
                    .milestones { background-color: #f9f9f9; padding: 15px; border-radius: 8px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { padding: 10px; text-align: center; border: 1px solid #ddd; }
                    th { background-color: #f2f2f2; }
                    tr:nth-child(even) { background-color: #f9f9f9; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>LIFETIME SOLAR SAVINGS</h1>
                    
                    <div class="section grid">
                        <div class="column pge">
                            <h3>PG&E</h3>
                            <div class="item">
                                <span>Annual kWh Usage:</span>
                                <span>${annualKwhUsage}</span>
                            </div>
                            <div class="item">
                                <span>PG&E Rate:</span>
                                <span>${pgeRate}</span>
                            </div>
                            <div class="item">
                                <span>PG&E Annual Rate Increase:</span>
                                <span>${pgeIncrease}</span>
                            </div>
                            <div class="item">
                                <span>Avg kWh per month:</span>
                                <span>${avgKwhMonth}</span>
                            </div>
                            <div class="item">
                                <span>Monthly Electricity Payments:</span>
                                <span>${monthlyElectricityPayments}</span>
                            </div>
                            <div class="item">
                                <span>Annual Electricity Payments:</span>
                                <span>${annualElectricityPayments}</span>
                            </div>
                        </div>
                        
                        <div class="column sunrun">
                            <h3>SUNRUN</h3>
                            <div class="item">
                                <span>Sunrun kWh Rate:</span>
                                <span>${sunrunRate}</span>
                            </div>
                            <div class="item">
                                <span>Inflation Escalator:</span>
                                <span>${inflationEscalator}</span>
                            </div>
                            <div class="item">
                                <span>Monthly Solar:</span>
                                <span>${monthlySolar}</span>
                            </div>
                            <div class="item">
                                <span>Monthly Battery:</span>
                                <span>${monthlyBattery}</span>
                            </div>
                            <div class="item">
                                <span>Monthly Payment:</span>
                                <span>${monthlyPayment}</span>
                            </div>
                            <div class="item">
                                <span>Annual Payment:</span>
                                <span>${annualPayment}</span>
                            </div>
                        </div>
                        
                        <div class="column savings">
                            <h3>SAVINGS</h3>
                            <div class="item">
                                <span>Rate Savings:</span>
                                <span>${rateSavings}</span>
                            </div>
                            <div class="item">
                                <span>Monthly Savings:</span>
                                <span>${monthlySavings}</span>
                            </div>
                            <div class="item">
                                <span>Annual Savings:</span>
                                <span>${annualSavings}</span>
                            </div>
                            <div class="item">
                                <span>Lifetime Savings:</span>
                                <span>${lifetimeSavings}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="section totals">
                        <div class="item">
                            <span>Total Sunrun Spend 25yrs:</span>
                            <span>${totalSunrunSpend}</span>
                        </div>
                        <div class="item">
                            <span>Total PG&E Spend 25yrs:</span>
                            <span>${totalPgeSpend}</span>
                        </div>
                    </div>
                    
                    <div class="section milestones">
                        <h3>Cumulative Savings</h3>
                        <div class="item">
                            <span>Total thru Year 5:</span>
                            <span>${savingsYear5}</span>
                        </div>
                        <div class="item">
                            <span>Total thru Year 10:</span>
                            <span>${savingsYear10}</span>
                        </div>
                        <div class="item">
                            <span>Total thru Year 15:</span>
                            <span>${savingsYear15}</span>
                        </div>
                        <div class="item">
                            <span>Total thru Year 20:</span>
                            <span>${savingsYear20}</span>
                        </div>
                        <div class="item">
                            <span>Total thru Year 25:</span>
                            <span>${savingsYear25}</span>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;
        
        // In a real implementation, you would send this email using a server-side API
        // For now, we'll just show an alert that the email would be sent
        alert(`Email would be sent to ${customerEmail} from mahoneysunrun@gmail.com with the solar savings report.\n\nIn a production environment, this would connect to a server-side API to send the actual email.`);
        
        console.log('Email Subject:', emailSubject);
        console.log('Email Body:', emailBody);
    }});
