import {createTransport} from "nodemailer";


export const mailTransporter = createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth:  {
        user: 'maymag4on@gmail.com',
        pass: process.env.MAIL_PASS_KEY
    },
    from: 'maymag4on@gmail.com'
});