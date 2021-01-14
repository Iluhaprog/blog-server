const nodemailer = require('nodemailer');

const USER = process.env.MAIL_USER;
const PASS = process.env.MAIL_PASS;

function getTransporter() {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com' ,
        port: 465,
        secure: true,
        auth: {
            user: USER,
            pass: PASS,
        },
    });
    return transporter;
}

async function send(user, message) {
    const transporter = getTransporter();
    try {
        await transporter.sendMail({
            from: 'Ilya Novak Blog',
            to: user.email,
            subject: `Thank you ${user.name} for registering, confirm account.`,
            html: `
                <p>
                Ilya follow this link to verify your account    
                </p>
                <a href=${message.href}>${message.href}</a>
            `,
        });
    } catch (error) {
        console.error(error);
    }
}

module.exports ={
    send,
};