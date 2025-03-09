/**
 * Solar Savings Calculator - Email Module
 * Handles email sending functionality using server API
 */

// Send email with solar savings report
async function sendEmail() {
    const customerName = document.getElementById('customer-name').value;
    const customerEmail = document.getElementById('customer-email').value;
    
    if (!customerName || !customerEmail) {
        alert('Please enter customer name and email address.');
        return;
    }
    
    // Show loading state
    const emailBtn = document.getElementById('email-btn');
    const originalBtnText = emailBtn.textContent;
    emailBtn.textContent = 'Sending...';
    emailBtn.disabled = true;
    
    try {
        // Get all the calculated values
        const data = collectEmailData();
        
        // Create email content
        const emailSubject = `Solar Savings Report for ${customerName}`;
        const emailHtml = generateEmailHTML(data);
        
        // Send email using server API
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                customerName,
                customerEmail,
                emailSubject,
                emailHtml
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert(`Email sent successfully to ${customerEmail}!`);
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('Error sending email:', error);
        alert('Failed to send email. Please try again later.');
    } finally {
        // Reset button state
        emailBtn.textContent = originalBtnText;
        emailBtn.disabled = false;
    }
}

// Collect all data needed for the email
function collectEmailData() {
    return {
        customerName: document.getElementById('customer-name').value,
        annualKwhUsage: document.getElementById('pge-annual-kwh').textContent,
        pgeRate: document.getElementById('pge-rate-display').textContent,
        pgeIncrease: document.getElementById('pge-increase-display').textContent,
        avgKwhMonth: document.getElementById('avg-kwh-month').textContent,
        monthlyElectricityPayments: document.getElementById('monthly-electricity-payments').textContent,
        annualElectricityPayments: document.getElementById('annual-electricity-payments').textContent,
        sunrunRate: document.getElementById('sunrun-rate-display').textContent,
        inflationEscalator: document.getElementById('inflation-escalator-display').textContent,
        monthlySolar: document.getElementById('monthly-solar').textContent,
        monthlyBattery: document.getElementById('monthly-battery-display').textContent,
        monthlyPayment: document.getElementById('monthly-payment').textContent,
        annualPayment: document.getElementById('annual-payment').textContent,
        rateSavings: document.getElementById('rate-savings').textContent,
        monthlySavings: document.getElementById('monthly-savings').textContent,
        annualSavings: document.getElementById('annual-savings').textContent,
        lifetimeSavings: document.getElementById('lifetime-savings').textContent,
        totalSunrunSpend: document.getElementById('total-sunrun-spend').textContent,
        totalPgeSpend: document.getElementById('total-pge-spend').textContent,
        savingsYear5: document.getElementById('savings-year-5').textContent,
        savingsYear10: document.getElementById('savings-year-10').textContent,
        savingsYear15: document.getElementById('savings-year-15').textContent,
        savingsYear20: document.getElementById('savings-year-20').textContent,
        savingsYear25: document.getElementById('savings-year-25').textContent
    };
}

// Generate HTML content for email
function generateEmailHTML(data) {
    return `
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
                        <span>${data.annualKwhUsage}</span>
                    </div>
                    <div class="item">
                        <span>PG&E Rate:</span>
                        <span>${data.pgeRate}</span>
                    </div>
                    <div class="item">
                        <span>Annual Rate Increase:</span>
                        <span>${data.pgeIncrease}</span>
                    </div>
                    <div class="item">
                        <span>Avg kWh/Month:</span>
                        <span>${data.avgKwhMonth}</span>
                    </div>
                    <div class="item">
                        <span>Monthly Payment:</span>
                        <span>${data.monthlyElectricityPayments}</span>
                    </div>
                    <div class="item">
                        <span>Annual Payment:</span>
                        <span>${data.annualElectricityPayments}</span>
                    </div>
                </div>
                
                <div class="column sunrun">
                    <h3>SUNRUN</h3>
                    <div class="item">
                        <span>Sunrun kWh Rate:</span>
                        <span>${data.sunrunRate}</span>
                    </div>
                    <div class="item">
                        <span>Inflation Escalator:</span>
                        <span>${data.inflationEscalator}</span>
                    </div>
                    <div class="item">
                        <span>Monthly Solar:</span>
                        <span>${data.monthlySolar}</span>
                    </div>
                    <div class="item">
                        <span>Monthly Battery:</span>
                        <span>${data.monthlyBattery}</span>
                    </div>
                    <div class="item">
                        <span>Monthly Payment:</span>
                        <span>${data.monthlyPayment}</span>
                    </div>
                    <div class="item">
                        <span>Annual Payment:</span>
                        <span>${data.annualPayment}</span>
                    </div>
                </div>
                
                <div class="column savings">
                    <h3>SAVINGS</h3>
                    <div class="item">
                        <span>Rate Savings:</span>
                        <span>${data.rateSavings}</span>
                    </div>
                    <div class="item">
                        <span>Monthly Savings:</span>
                        <span>${data.monthlySavings}</span>
                    </div>
                    <div class="item">
                        <span>Annual Savings:</span>
                        <span>${data.annualSavings}</span>
                    </div>
                    <div class="item">
                        <span>Lifetime Savings:</span>
                        <span>${data.lifetimeSavings}</span>
                    </div>
                </div>
            </div>
            
            <div class="section totals">
                <div class="item">
                    <span>Total Sunrun Spend 25yrs:</span>
                    <span>${data.totalSunrunSpend}</span>
                </div>
                <div class="item">
                    <span>Total PG&E Spend 25yrs:</span>
                    <span>${data.totalPgeSpend}</span>
                </div>
            </div>
            
            <div class="section milestones">
                <h3>Cumulative Savings</h3>
                <div class="item">
                    <span>Total thru Year 5:</span>
                    <span>${data.savingsYear5}</span>
                </div>
                <div class="item">
                    <span>Total thru Year 10:</span>
                    <span>${data.savingsYear10}</span>
                </div>
                <div class="item">
                    <span>Total thru Year 15:</span>
                    <span>${data.savingsYear15}</span>
                </div>
                <div class="item">
                    <span>Total thru Year 20:</span>
                    <span>${data.savingsYear20}</span>
                </div>
                <div class="item">
                    <span>Total thru Year 25:</span>
                    <span>${data.savingsYear25}</span>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
}

// Export functions for use in other modules
export { sendEmail };