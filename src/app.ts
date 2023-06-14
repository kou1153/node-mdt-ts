import express, {Express} from "express";
import morgan from "morgan";
import {EmailRouter} from "./routes/email";
import {MdtRouter} from "./routes/mdt";
import {ErrorHandler} from "./utils/error-handler";

const CreateExpress = async (): Promise<express.Express> => {
    const app: Express = express();

    app.use(morgan("dev"));
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    app.use("/api/v1/mdt", MdtRouter);

    app.use("/api/v1/email", EmailRouter);

    app.use("*", () => {
            throw new Error("Invalid Route")
        }
    );

    app.use(ErrorHandler);

    return app;
};

export {CreateExpress};
