import "reflect-metadata";
import chai from "chai";
import chaitHttp from "chai-http";
import {CreateExpress} from "../src/app";
import {
    PostgreSqlContainer,
    StartedPostgreSqlContainer,
} from "testcontainers";
import {DataSource} from "typeorm";
import {MDT} from "../src/database/model/MDT";
import {afterEach} from "mocha";
import {ConnectDB} from "../src/database/connection";

chai.use(chaitHttp);
chai.should();
let container: PostgreSqlContainer;
let startedContainer: StartedPostgreSqlContainer;
let TestDataSource: DataSource;

describe("Setup resources", () => {
    beforeEach(async function () {
        container = new PostgreSqlContainer();
        startedContainer = await container.start();
        console.log("container started");

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

        await ConnectDB(TestDataSource)

        console.log("DB connected");
    });

    describe("POST /api/v1/mdt/create CreateMDT", () => {
        it("Should return created MDT", async function () {
            const sampleMDT = new MDT();

            sampleMDT.id = 1
            sampleMDT.HoVaTen = "SampleName";
            sampleMDT.TKCK = "SampleTKCK";
            sampleMDT.SDT = "SampleSDT";
            sampleMDT.Email = "SampleEmail";
            sampleMDT.MDT = "SampleMDT";
            sampleMDT.DeletedAt = false;

            let app = await CreateExpress();

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
                });
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("success").eql(true);
            res.body.should.have.property("message").eql(sampleMDT);
        });
    });

    afterEach(async function () {
        await TestDataSource.destroy();
        console.log("DB disconnected");
        await startedContainer.stop();
        console.log("container stopped");
    });
});
