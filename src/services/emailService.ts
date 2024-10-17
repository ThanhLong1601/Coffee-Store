import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE, 
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
    },
});

export const sendOtpEmail = async (to: string, otp: string) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Your OTP code to reset Password',
        text: `Your OTP code is: ${otp}. This code is valid in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
};