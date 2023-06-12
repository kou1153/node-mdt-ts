import "reflect-metadata";
import chai from "chai";
import chaitHttp from "chai-http";
import {CreateExpress} from "../src/utils/app";
import {
    PostgreSqlContainer,
    StartedPostgreSqlContainer,
} from "testcontainers";
import {DataSource} from "typeorm";
import {MDT} from "../src/database/model/MDT";
import {afterEach} from "mocha";
import {ConnectDB} from "../src/database/connection";
import {errorThrower} from "../src/utils/error-thrower";
import e from "express";

chai.use(chaitHttp);
chai.should();
let container: PostgreSqlContainer;
let startedContainer: StartedPostgreSqlContainer;
let TestDataSource: DataSource;

describe("Setup resources", (): void => {
    beforeEach(async function (): Promise<void> {
        container = new PostgreSqlContainer();
        startedContainer = await container.start().catch(e => errorThrower(e, "Failed to start container"));
        console.log("Container started");

        TestDataSource = new DataSource({
            type: "postgres",
            host: startedContainer.getHost(),
            port: startedContainer.getPort(),
            username: startedContainer.getUsername(),
            password: startedContainer.getPassword(),
            database: startedContainer.getDatabase(),
            synchronize: true,
            entities: [MDT],
            dropSchema: true,
        });

        await ConnectDB(TestDataSource).catch(e => errorThrower(e, "Failed to connect database"))
    });

    describe("POST /api/v1/mdt/create CreateMDT", (): void => {
        it("Should return created MDT", async function (): Promise<void> {
            const sampleMDT: MDT = new MDT();

            sampleMDT.id = 1
            sampleMDT.HoVaTen = "SampleName";
            sampleMDT.TKCK = "SampleTKCK";
            sampleMDT.SDT = "SampleSDT";
            sampleMDT.Email = "SampleEmail";
            sampleMDT.MDT = "SampleMDT";
            sampleMDT.DeletedAt = false;

            let app: e.Express = await CreateExpress().catch(e => errorThrower(e, "Failed to create Express"));

            const res = await chai
                .request(app)
                .post("/api/v1/mdt/create")
                .set("Content-Type", "application/json")
                .send({
                    hovaten: sampleMDT.HoVaTen,
                    tkck: sampleMDT.TKCK,
                    sdt: sampleMDT.SDT,
                    email: sampleMDT.Email,
                    mdt: sampleMDT.MDT,
                }).catch(e => errorThrower(e, "Chai failed to mock request"));
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("success").eql(true);
            res.body.should.have.property("message").eql(sampleMDT);
        });
    });

    afterEach(async function (): Promise<void> {
        await TestDataSource.destroy().catch(e => errorThrower(e, "Failed to disconnect test database"));
        console.log("DB disconnected");
        await startedContainer.stop().catch(e => errorThrower(e, "Failed to stop testcontainer"));
        console.log("Container stopped");
    });
});
