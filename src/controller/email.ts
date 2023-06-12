import {Request, Response} from "express";
import {SentMail} from "../utils/email";
import {SentMessageInfo} from "nodemailer";
import {validateEmail} from "../utils/joi-validate";
import {errorThrower} from "../utils/error-thrower";

const SentEmail = async (
    req: Request<{ email: string; mdt: string }>,
    res: Response
): Promise<void> => {
    const {error} = validateEmail(req.body);
    if (error) errorThrower(error, error.details[0].message);

    const opts: { receiver: any; subject: string; body: string } = {
        receiver: req.body.email, subject: "Won", body: `Your token is: ${req.body.mdt}`
    }

    const info: SentMessageInfo = await SentMail(
        opts
    ).catch(e =>
        errorThrower(e, "Failed to sent email")
    );

    res.json({success: true, message: info.envelope});
};

export {SentEmail};
