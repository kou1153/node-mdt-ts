import express, {Express} from "express";
import morgan from "morgan";
import {EmailRouter} from "../router/email";
import {MdtRouter} from "../router/mdt";
import {ErrorHandler} from "./error-handler";
import {errorThrower} from "./error-thrower";

const CreateExpress = async (): Promise<express.Express> => {
    const app: Express = express();

    app.use(morgan("dev"));
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    app.use("/api/v1/mdt", MdtRouter);

    app.use("/api/v1/email", EmailRouter);

    app.use("*", () =>
        errorThrower(Error("CreateExpress() invalid route"), "Invalid Route")
    );

    app.use(ErrorHandler);

    return app;
};

export {CreateExpress};
