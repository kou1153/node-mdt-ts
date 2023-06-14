import {expect} from 'chai';
import {ConnectDB, CreateDataSource, GetConnection} from "../../src/database/connection";
import {DataSource} from "typeorm";
import {PostgreSqlContainer, StartedPostgreSqlContainer} from "testcontainers";
import {MDT} from "../../src/database/models/MDT";

describe("Test Connection", (): void => {
    describe('CreateDataSource', (): void => {
        it('should create a new DataSource object with the correct options', (): void => {
            const host = 'localhost';
            const port = 5432;
            const username = 'testuser';
            const password = 'testpass';
            const database = 'testdb';
            const entities = [];
            const dataSource: DataSource = CreateDataSource(host, port, username, password, database, entities);
            expect(dataSource).to.be.an.instanceOf(DataSource);
            expect(dataSource.options).to.deep.equal({
                type: 'postgres',
                host: host,
                port: port,
                username: username,
                password: password,
                database: database,
                synchronize: true,
                logging: false,
                entities: entities,
                migrations: [],
                subscribers: []
            });
        });
    });
    describe('ConnectDB_GetConnection', (): void => {
        it('should connect to the database and set the DB variable', async (): Promise<void> => {
            const container: PostgreSqlContainer = new PostgreSqlContainer();
            const startedContainer: StartedPostgreSqlContainer = await container.start();
            console.log("Container started");

            const TestDataSource: DataSource = CreateDataSource(startedContainer.getHost(), startedContainer.getPort(), startedContainer.getUsername(), startedContainer.getPassword(), startedContainer.getDatabase(), [MDT]);
            await ConnectDB(TestDataSource);

            const DB: DataSource = GetConnection();
            expect(DB).to.be.an.instanceOf(DataSource);
            expect(DB.isInitialized).to.equal(true);

            await TestDataSource.destroy();
            await startedContainer.stop();
            console.log("Container stopped");
        });
    });
});
