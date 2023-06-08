import nodemailer from "nodemailer";
import { SentMessageInfo } from "nodemailer";

const SentMail = async (receiver: string, subject: string, body: string) => {
  let transporter: nodemailer.Transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: "1959018@itec.hcmus.edu.vn",
      pass: process.env.emailKey,
    },
  });

  let { error, info }: SentMessageInfo = await transporter.sendMail({
    from: "1959018@itec.hcmus.edu.vn",
    to: receiver,
    subject: subject,
    text: body,
  });
  return { error, info };
};

export { SentMail };
