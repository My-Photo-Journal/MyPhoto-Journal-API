import {createTransport} from "nodemailer";


export const mailTransporter = createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth:  {
        user: 'maymag4on@gmail.com',
        pass: process.env.MAIL_PASS_KEY
    }
});