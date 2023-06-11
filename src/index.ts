import "reflect-metadata";
import * as dotenv from "dotenv";
import path from "path";
import {CreateExpress} from "./app";
import {ConnectDB, CreateDataSource} from "./database/connection";
import {MDT} from "./database/model/MDT";

async function main() {
    dotenv.config({path: path.join(__dirname, "./.env")});

    const host = process.env.DB_HOST || "localhost";
    const port = process.env.DB_PORT || 5433;
    const uname = process.env.DB_UNAME || "postgres";
    const pass = process.env.DB_PASS || "postgres";
    const dbName = process.env.DB_NAME || "postgres";

    let _db = CreateDataSource(host, Number(port), uname, pass, dbName, [MDT])

    await ConnectDB(_db);

    let app = await CreateExpress();
    app.listen(process.env.PORT, () => console.log(`Server started`));
}

main().catch((e) => {
    console.log(e)
});
