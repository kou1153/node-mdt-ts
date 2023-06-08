import { AppDataSource } from "./data-source";

async function ConnectDB() {
  try {
    await AppDataSource.initialize();
    console.log("DataSource is ready");
  } catch (e) {
    console.error(e);
  }
}

export { ConnectDB };
