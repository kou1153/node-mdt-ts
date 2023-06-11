import "reflect-metadata";
import {DataSource, EntitySchema, MixedList} from "typeorm";

let DB: DataSource;

function CreateDataSource(
    host: string,
    port: number,
    username: string,
    password: string,
    database: string,
    entities: MixedList<string | Function | EntitySchema<any>>
): DataSource {
    return new DataSource({
        type: "postgres",
        host: host,
        port: port,
        username: username,
        password: password,
        database: database,
        synchronize: true,
        logging: false,
        entities: entities,
        migrations: [],
        subscribers: [],
    });
}

async function ConnectDB(source: DataSource) {
    try {
        DB = await source.initialize()
    } catch (err) {
        console.error("Error during Data Source initialization", err);
    }
}

function GetConnection() {
    return DB;
}

export {CreateDataSource, ConnectDB, GetConnection};
