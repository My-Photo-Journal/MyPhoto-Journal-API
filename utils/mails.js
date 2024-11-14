import {createTransport} from "nodemailer";

export const mailTransporter = createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth:  {
        user: 'maymag4on@gmail.com',
        pass: process.env.MAIL_PASS_KEY
    },
    from: 'maymag4on@gmail.com'
});

export const sendConfirmationEmail = async (email, confirmationToken, name) => {
    const confirmationUrl = `${process.env.BASE_URL}/api/users/confirm/${confirmationToken}`;
    
    const mailOptions = {
        from: 'maymag4on@gmail.com',
        to: email,
        subject: 'Welcome! Please confirm your email',
        html: `
            <h1>Welcome to My Photo Journal!</h1>
            <p>Hello ${name},</p>
            <p>Your account has been successfully registered. Please click the link below to confirm your email address:</p>
            <a href="${confirmationUrl}">${confirmationUrl}</a>
            <p>This link will expire in 24 hours.</p>
        `
    };

    return mailTransporter.sendMail(mailOptions);
};
