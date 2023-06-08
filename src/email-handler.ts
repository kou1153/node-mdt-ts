import { Request, Response } from "express";
import { SentMail } from "./utils/email";
import { SentMessageInfo } from "nodemailer";

const SentEmail = async (
  req: Request<{ email: string; mdt: string }>,
  res: Response
) => {
  let { e, info }: SentMessageInfo = await SentMail(
    req.body.email,
    "You won",
    `Your token is: ${req.body.mdt}`
  );

  if (e !== undefined) throw new Error("Failed to sent mail");

  res.json({ success: true, message: info });
};

export { SentEmail };
