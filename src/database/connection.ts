import "reflect-metadata";
import {DataSource, EntitySchema, MixedList} from "typeorm";

let DB: DataSource;

const CreateDataSource = (
    host: string,
    port: number,
    username: string,
    password: string,
    database: string,
    entities: MixedList<string | Function | EntitySchema>
): DataSource => new DataSource({
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

const ConnectDB = async (source: DataSource): Promise<void> => {
    DB = await source.initialize()
    console.log("DB Connected")
};

const GetConnection = (): DataSource => DB;

export {CreateDataSource, ConnectDB, GetConnection};
