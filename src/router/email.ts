import express, { Router } from "express";
import { AsyncHandler } from "../utils/async-handler";
import { SentEmail } from "../controller/email";

const router: Router = express.Router();
router.route("/email").post(AsyncHandler(SentEmail));

export { router as EmailRouter };
