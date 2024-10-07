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
        subject: 'Mã OTP Đặt Lại Mật Khẩu',
        text: `Mã OTP của bạn là: ${otp}. Mã này chỉ có hiệu lực trong 5 phút.`,
    };

    await transporter.sendMail(mailOptions);
};