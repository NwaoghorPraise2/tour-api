const nodeMailer = require('nodemailer');

const sendEmail = async options => {
    // 1) Transporter
    const transporter = nodeMailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,

        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // 2) Define Email Options
    const mailOptions = {
        from: 'Nwaoghor Praise <hello@nwaoghorpraise.io>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html:// 2) Define Email Options
    }

    // 3) Actually Send Mail
    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;