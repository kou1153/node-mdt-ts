import express, {Router} from "express";
import {AsyncHandler} from "../utils/async-handler";
import {SentEmail} from "../controllers/email";

const router: Router = express.Router();
router.route("/create").post(AsyncHandler(SentEmail));

export { router as EmailRouter };
