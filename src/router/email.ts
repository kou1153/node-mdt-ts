import express, { Router } from "express";
import { AsyncHandler } from "../utils/async-handler";
import { SentEmail } from "../controller/email";

const router: Router = express.Router();
router.route("/create").post(AsyncHandler(SentEmail));

export { router as EmailRouter };
