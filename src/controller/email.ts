import { Request, Response } from "express";
import { SentMail } from "../utils/email";
import { SentMessageInfo } from "nodemailer";
import { validateEmail } from "../utils/joi-validate";

const SentEmail = async (
  req: Request<{ email: string; mdt: string }>,
  res: Response
) => {
  const { error } = validateEmail(req.body);
  if (error) throw new Error(`${error.details[0].message}`);

  let info: SentMessageInfo = await SentMail(
    req.body.email,
    "You won",
    `Your token is: ${req.body.mdt}`
  );

  res.json({ success: true, message: info });
};

export { SentEmail };
