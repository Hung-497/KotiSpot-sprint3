const nodemailer = require('nodemailer');

let transporter = null;

const getTransporter = async () => {
    if (transporter) {
        return transporter;
    }

    if (process.env.NODE_ENV === "test") {
        transporter = nodemailer.createTransport({
            jsonTransport: true,
        });
        return transporter;
    }

    const testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    return transporter;
};

const sendLoginCode = async (email, code) => {
    const transporter = await getTransporter();

    return transporter.sendMail({
        from: process.env.EMAIL_FROM || "KotiSpot <noreply@kotispot.app>",
        to: email,
        subject: "Your KotiSpot Login Code",
        text: `Your KotiSpot login code is ${code}. It will expire in 10 minutes.`,
    });
};

module.exports = {
    sendLoginCode,
};