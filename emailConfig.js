
const nodemailer = require("nodemailer");
require('dotenv').config();


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_SYSTEM,
        pass: process.env.EMAIL_SYSPASS
    }
});

module.exports = transporter;