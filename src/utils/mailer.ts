// src/utils/mailer.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io", // lấy từ Mailtrap
  port: 2525,                        // có thể dùng 25, 465, 587, 2525
  auth: {
    user: "531d4ef383aa7e",          // username Mailtrap cấp
    pass: "ecd422d4180b04",     // password Mailtrap cấp (thay vào)
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: '"Library App" <noreply@yourlibrary.test>', // tên hiển thị
    to,
    subject,
    html,
  });
};
