const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'abdallahsaber065@gmail.com',
        pass: process.env.EMAIL_PASS // You'll need to set this in .env file
    }
});

// API endpoint for sending emails
app.post('/api/send-email', async (req, res) => {
    try {
        const {
            customerName,
            customerEmail,
            emailSubject,
            emailHtml
        } = req.body;

        const mailOptions = {
            from: process.env.EMAIL_USER || 'mahoneysunrun@gmail.com',
            to: customerEmail,
            subject: emailSubject,
            html: emailHtml
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send email' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});