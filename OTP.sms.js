const express = require('express');
const bodyParser = require('body-parser');
const mysql2 = require('mysql2/promise');
const request = require('request');

const app = express();
const port = process.env.PORT || 88;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection
const connection = mysql.createConnection({
    host: process.env.HOST,
    user:  process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

connection.connect(); // Connect to MySQL database

const secretKey = process.env.SECRET_KEY;
const token = process.env.TOKEN; 

// Handle POST request to send OTP
app.post('/sendOTP', (req, res) => {
    const { phoneNumber } = req.body;

    // Validasi format Nomor telepon
    if (!isValidPhoneNumber(phoneNumber)) {
        return res.status(400).json({ success: false, message: 'Invalid phone number format' });
    }

    // Cek apakah nomor telepon ada di database user
    connection.query('SELECT * FROM users WHERE phone_number = ?', [phoneNumber], (error, results, fields) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Phone number not found' });
        }

        // Nomor telepon ada di database, kirim otp
        const otp = generateOTP();
        const message = `Your OTP is: ${otp}`;

        // Kirim permintaan HTTP dengan penanganan timeout
        const options = {
            url: `http://wa.nux.my.id/api/sendSMS?to=${phoneNumber}&msg=${message}&sim=0&secret=${secretKey}&token=${token}`,
            timeout: 5000 // Timeout dalam milidetik (misalnya, 5 detik)
        };

        request(options, (error, response, body) => {
            if (error) {
                if (error.code === 'ETIMEDOUT') {
                    return res.status(500).json({ success: false, message: 'OTP sending request timed out' });
                } else {
                    return res.status(500).json({ success: false, message: 'Failed to send OTP', error: error.message });
                }
            }

            if (response.statusCode === 200) {
                res.json({ success: true, message: 'OTP sent successfully' });
            } else {
                res.status(500).json({ success: false, message: 'Failed to send OTP', error: body });
            }
        });
    });
});

// Handle POST request to verify OTP
app.post('/verifyOTP', (req, res) => {
    const { phoneNumber, enteredOTP } = req.body;

    // Validasi format Nomor telepon
    if (!isValidPhoneNumber(phoneNumber)) {
        return res.status(400).json({ success: false, message: 'Invalid phone number format' });
    }

    // Cek apakah OTP sesuai dengan yang dikirim
    connection.query('SELECT * FROM otp WHERE phone_number = ? AND otp = ? AND NOW() <= DATE_ADD(created_at, INTERVAL 5 MINUTE)', [phoneNumber, enteredOTP], (error, results, fields) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        // OTP sesuai, berikan akses
        // Mengarahkan user ke login page dengan field username dan password yang sudah terisi
        res.json({ success: true, message: 'OTP verification successful', phoneNumber: phoneNumber });
    });
});

// Function to generate OTP
function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

// Function untuk mengecek validasi nomor telepon
function isValidPhoneNumber(phoneNumber) {
    const phoneRegex = /^\d{9,}$/;
    return phoneRegex.test(phoneNumber);
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
