import { DataSource, EntityTarget, ObjectLiteral, Repository } from "typeorm";
import { AppDataSource } from "./data-source";

let DbInstance: DataSource;

async function ConnectDB() {
  try {
    let dbConn: DataSource = await AppDataSource.initialize();
    console.log("🚀 ~ file: db-connection.ts:9 ~ ConnectDB ~ dbConn:", dbConn)
    
    DbInstance = dbConn;
    console.log("🚀 ~ file: db-connection.ts:12 ~ ConnectDB ~ DbInstance:", DbInstance)
  } catch (e) {
    console.error(e);
  }
}

export { ConnectDB, DbInstance };
