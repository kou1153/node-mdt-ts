import "reflect-metadata";
import express, { Express, Request, Response } from "express";

import morgan from "morgan";
import * as dotenv from "dotenv";

import { ConnectDB } from "./db-connection";
import { ErrorHandler } from "./utils/error-handler";

import {
  CreateMDT,
  DeleteMDT,
  GetAllMDT,
  RandomMDT,
  UpdateMDT,
} from "./mdt-handler";

dotenv.config({ path: ".env" });

let app: Express = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/v1/mdt/create", CreateMDT);

app.get("/api/v1/mdt/read", GetAllMDT);

app.put("/api/v1/mdt/update/:id", UpdateMDT);

app.delete("/api/v1/mdt/delete/:id", DeleteMDT);

app.get("/api/v1/mdt/random", RandomMDT);

app.post("/api/v1/email");

app.use(ErrorHandler);

app.use("*", (req: Request, res: Response) => {
  res.status(404).json({ message: "Invalid Route(s)" });
});

app.listen(process.env.port, async () => {
  await ConnectDB();
  console.log("Server is running on: ", process.env.port);
});
