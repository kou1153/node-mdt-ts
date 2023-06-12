import nodemailer from "nodemailer";

const SentMail = async (opts): Promise<any> => {
    const transporter: nodemailer.Transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        secure: true,
        auth: {
            type: "login",
            user: "1959018@itec.hcmus.edu.vn",
            pass: process.env.EMAIL_KEY,
        },
    });

    const mailOptions: { subject: any; from: string; to: any; text: any } = {
        from: "MDT Mail",
        to: opts.receiver, subject: opts.subject, text: opts.body
    }

    return await transporter.sendMail(mailOptions);
};

export {SentMail};
