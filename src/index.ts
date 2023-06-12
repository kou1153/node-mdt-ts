import "reflect-metadata";
import * as dotenv from "dotenv";
import path from "path";
import {CreateExpress} from "./utils/app";
import {ConnectDB, CreateDataSource} from "./database/connection";
import {MDT} from "./database/model/MDT";
import e from "express";
import {DataSource} from "typeorm";
import {errorThrower} from "./utils/error-thrower";

const main = async (): Promise<void> => {
    dotenv.config({path: path.resolve(__dirname, '../.env')});

    const host = process.env.DB_HOST || "localhost";
    const port = process.env.DB_PORT || 5432;
    const uname = process.env.DB_UNAME || "postgres";
    const pass = process.env.DB_PASS || "postgres";
    const dbName = process.env.DB_NAME || "postgres";

    let _db: DataSource = CreateDataSource(host, Number(port), uname, pass, dbName, [MDT])

    await ConnectDB(_db).catch(e =>
        errorThrower(e, "Failed to connect DB")
    );

    let app: e.Express = await CreateExpress().catch(e =>
        errorThrower(e, "Failed to create Express")
    );
    app.listen(process.env.PORT, () => console.log(`Server started`));
};

main().catch(e => errorThrower(e, "Something wrong with main()"));
