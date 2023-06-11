import express, { Router } from "express";
import { AsyncHandler } from "../utils/async-handler";
import {
  CreateMDT,
  DeleteMDT,
  GetAllMDT,
  RandomMDT,
  UpdateMDT,
} from "../controller/mdt";

const router: Router = express.Router();

router.route("/create").post(AsyncHandler(CreateMDT));

router.route("/read").get(AsyncHandler(GetAllMDT));

router.route("/update/:id").put(AsyncHandler(UpdateMDT));

router.route("/delete/:id").delete(AsyncHandler(DeleteMDT));

router.route("/random").get(AsyncHandler(RandomMDT));

export { router as MdtRouter };
