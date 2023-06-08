import "reflect-metadata"
import { DataSource } from "typeorm"
import { MDT } from "./entity/MDT"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5433,
    username: "postgres",
    password: "postgres",
    database: "postgres",
    synchronize: true,
    logging: false,
    entities: [MDT],
    migrations: [],
    subscribers: [],
})
