// src/utils/mailer.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "noreply.yourlibrary@gmail.com", // địa chỉ gửi
    pass: "your_app_password_here",        // app password
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: '"Library App" <noreply.yourlibrary@gmail.com>',
    to,
    subject,
    html,
  });
};
