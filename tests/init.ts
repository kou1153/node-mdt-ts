import "reflect-metadata";
import chai from "chai";
import chaitHttp from "chai-http";
// import {app} from "../src/app"
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "testcontainers";
import { DataSource } from "typeorm";
import { MDT } from "../src/database/model/MDT";
import { afterEach } from "mocha";

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

    await TestDataSource.initialize();
    console.log("DB connected");
  });

  describe("POST /api/v1/mdt/create CreateMDT", () => {
    it("Should return created MDT", async function () {
      const sampleMDT = new MDT();

      sampleMDT.HoVaTen = "SampleName";
      sampleMDT.TKCK = "SampleTKCK";
      sampleMDT.SDT = "SampleSDT";
      sampleMDT.Email = "SampleEmail";
      sampleMDT.MDT = "SampleMDT";
      sampleMDT.DeletedAt = false;

      // const res = await chai
      //   .request(app)
      //   .post("/api/v1/mdt/create")
      //   .set("Content-Type", "application/json")
      //   .send({
      //     hovaten: "u9",
      //     tkck: "0119",
      //     sdt: "11119",
      //     email: "mail9@mail.com",
      //     mdt: "00000009",
      //   });
      // console.log(res.body);
      // res.should.have.status(200);
      // res.body.should.be.a("object");
      // res.body.should.have.property("success").eql(true);
      // res.body.should.have.property("message").eql(sampleMDT);
    });
  });

  afterEach(async function () {
    await TestDataSource.destroy();
    console.log("DB disconnected");
    await startedContainer.stop();
    console.log("container stopped");
  });
});
