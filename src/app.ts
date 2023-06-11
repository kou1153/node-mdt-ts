import express, {Express} from "express";
import morgan from "morgan";
import {EmailRouter} from "./router/email";
import {MdtRouter} from "./router/mdt";
import {ErrorHandler} from "./utils/error-handler";

async function CreateExpress() {
    let app: Express = express();

    app.use(morgan("dev"));
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    app.use("/api/v1/mdt", MdtRouter);

    app.use("/api/v1/email", EmailRouter);

    app.use("*", () => {
        throw new Error("Invalid Routes");
    });

    app.use(ErrorHandler);

    return app;
}

export {CreateExpress};
