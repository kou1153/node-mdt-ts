import * as dotenv from "dotenv";
import "reflect-metadata";
import path from "path";
import express, { Express } from "express";

import morgan from "morgan";

import { ConnectDB } from "./db-connection";
import { ErrorHandler } from "./utils/error-handler";

import {
  CreateMDT,
  DeleteMDT,
  GetAllMDT,
  RandomMDT,
  UpdateMDT,
} from "./mdt-handler";
import { SentEmail } from "./email-handler";
import { AsyncHandler } from "./utils/async-handler";

dotenv.config({ path: path.join(__dirname, "./.env") });

ConnectDB();

let app: Express = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/v1/mdt/create", AsyncHandler(CreateMDT));

app.get("/api/v1/mdt/read", AsyncHandler(GetAllMDT));

app.put("/api/v1/mdt/update/:id", AsyncHandler(UpdateMDT));

app.delete("/api/v1/mdt/delete/:id", AsyncHandler(DeleteMDT));

app.get("/api/v1/mdt/random", AsyncHandler(RandomMDT));

app.post("/api/v1/email", AsyncHandler(SentEmail));

app.use("*", () => {
  throw new Error("Invalid Routes");
});

app.use(ErrorHandler);

app.listen(process.env.port, async () => {
  console.log("Server is running on: ", process.env.port);
});
