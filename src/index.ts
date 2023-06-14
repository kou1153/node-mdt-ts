import "reflect-metadata";
import * as dotenv from "dotenv";
import {CreateExpress} from "./app";
import {ConnectDB, CreateDataSource} from "./database/connection";
import {MDT} from "./database/models/MDT";
import e from "express";
import {DataSource} from "typeorm";

const main = async (): Promise<void> => {
    dotenv.config({path: `${__dirname}/../.env`});
    if (dotenv.config({path: `${__dirname}/../.env`}).error !== undefined) {
        throw Error("Failed to load .env file")
    }

    const host = process.env.DB_HOST || "localhost";
    const port = process.env.DB_PORT || 5432;
    const uname = process.env.DB_UNAME || "postgres";
    const pass = process.env.DB_PASS || "postgres";
    const dbName = process.env.DB_NAME || "postgres";

    let _db: DataSource = CreateDataSource(host, Number(port), uname, pass, dbName, [MDT])

    await ConnectDB(_db).catch((): void => {
            throw Error("Failed to connect DB")
        }
    );

    let app: e.Express = await CreateExpress().catch(() => {
        throw Error("Failed to create Express");
    });
    app.listen(process.env.PORT, () => console.log(`Server started`));
};

main().catch((): void => {
    throw Error("Something wrong with main()")
});
