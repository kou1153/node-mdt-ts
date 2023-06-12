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
import {ConnectDB, CreateDataSource, GetConnection} from "../src/database/connection";
import {errorThrower} from "../src/utils/error-thrower";
import e from "express";
import * as dotenv from "dotenv";
import path from "path";

chai.use(chaitHttp);
chai.should();
let container: PostgreSqlContainer;
let startedContainer: StartedPostgreSqlContainer;
let TestDataSource: DataSource;

describe("Test All", (): void => {
    describe("Test MDT", (): void => {
        beforeEach("Setup resources", async (): Promise<void> => {
            container = new PostgreSqlContainer();
            startedContainer = await container.start().catch(e => errorThrower(e, "Failed to start container"));
            console.log("Container started");

            TestDataSource = CreateDataSource(startedContainer.getHost(), startedContainer.getPort(), startedContainer.getUsername(), startedContainer.getPassword(), startedContainer.getDatabase(), [MDT])
            await ConnectDB(TestDataSource).catch(e => errorThrower(e, "Failed to connect database"))
        });

        describe("Success POST /api/v1/mdt/create CreateMDT", (): void => {
            it("Should return created MDT", async (): Promise<void> => {
                const sampleMDT: MDT = new MDT();

                sampleMDT.id = 1
                sampleMDT.HoVaTen = "SampleName";
                sampleMDT.TKCK = "SampleTKCK";
                sampleMDT.SDT = "SampleSDT";
                sampleMDT.Email = "SampleEmail";
                sampleMDT.MDT = "SampleMDT";
                sampleMDT.DeletedAt = false;

                const app: e.Express = await CreateExpress().catch(e => errorThrower(e, "Failed to create Express"));

                const res = await chai
                    .request(app)
                    .post("/api/v1/mdt/create")
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

        describe("Failed POST /api/v1/mdt/create CreateMDT", (): void => {
            it("Should return missing parameter error", async (): Promise<void> => {
                const sampleMDT: MDT = new MDT();

                sampleMDT.id = 1
                sampleMDT.HoVaTen = "SampleName";
                sampleMDT.TKCK = "SampleTKCK";
                // sampleMDT.SDT = "SampleSDT"; // Simulate missing required attributes
                sampleMDT.Email = "SampleEmail";
                sampleMDT.MDT = "SampleMDT";
                sampleMDT.DeletedAt = false;

                const app: e.Express = await CreateExpress().catch(e => errorThrower(e, "Failed to create Express"));

                const res = await chai
                    .request(app)
                    .post("/api/v1/mdt/create")
                    .send({
                        hovaten: sampleMDT.HoVaTen,
                        tkck: sampleMDT.TKCK,
                        // sdt: sampleMDT.SDT,  // Simulate missing required attributes
                        email: sampleMDT.Email,
                        mdt: sampleMDT.MDT,
                    }).catch(e => errorThrower(e, "Chai failed to mock request"));
                res.should.have.status(404);
                res.body.should.be.a("object");
                res.body.should.have.property("success").eql(false);
                res.body.should.have.property("error").eql("\"sdt\" is required");
            });
        });

        describe("Success GET /api/v1/mdt/read GetAllMDT", (): void => {
            it("Should return type array contains MDT(s)", async (): Promise<void> => {
                const sampleMDT: MDT = new MDT();

                sampleMDT.id = 1
                sampleMDT.HoVaTen = "SampleName";
                sampleMDT.TKCK = "SampleTKCK";
                sampleMDT.SDT = "SampleSDT";
                sampleMDT.Email = "SampleEmail";
                sampleMDT.MDT = "SampleMDT";
                sampleMDT.DeletedAt = false;

                await GetConnection().manager.save(sampleMDT)

                const mdtArray: MDT[] = [sampleMDT]

                const app: e.Express = await CreateExpress().catch(e => errorThrower(e, "Failed to create Express"));

                const res = await chai
                    .request(app)
                    .get("/api/v1/mdt/read")
                    .catch(e => errorThrower(e, "Chai failed to mock request"));
                res.should.have.status(200);
                res.body.should.be.a("object");
                res.body.should.have.property("success").eql(true);
                res.body.should.have.property("message").eql(mdtArray);
            });
        });

        describe("Failed GET /api/v1/mdt/read GetAllMDT", (): void => {
            it("Should return error for empty MDT", async (): Promise<void> => {
                const sampleMDT: MDT = new MDT();

                sampleMDT.id = 1
                sampleMDT.HoVaTen = "SampleName";
                sampleMDT.TKCK = "SampleTKCK";
                sampleMDT.SDT = "SampleSDT";
                sampleMDT.Email = "SampleEmail";
                sampleMDT.MDT = "SampleMDT";
                sampleMDT.DeletedAt = false;

                // await GetConnection().manager.save(sampleMDT) //Simulate empty mdt

                const app: e.Express = await CreateExpress().catch(e => errorThrower(e, "Failed to create Express"));

                const res = await chai
                    .request(app)
                    .get("/api/v1/mdt/read")
                    .catch(e => errorThrower(e, "Chai failed to mock request"));
                res.should.have.status(404);
                res.body.should.be.a("object");
                res.body.should.have.property("success").eql(false);
                res.body.should.have.property("error").eql("Mdts is empty");
            });
        });

        describe("Success PUT /api/v1/mdt/update UpdateMDT", (): void => {
            it("Should return updated MDT", async (): Promise<void> => {
                const sampleMDT: MDT = new MDT();

                sampleMDT.id = 1
                sampleMDT.HoVaTen = "SampleName";
                sampleMDT.TKCK = "SampleTKCK";
                sampleMDT.SDT = "SampleSDT";
                sampleMDT.Email = "SampleEmail";
                sampleMDT.MDT = "SampleMDT";
                sampleMDT.DeletedAt = false;

                await GetConnection().manager.save(sampleMDT)

                const updatedMDT: MDT = new MDT();
                updatedMDT.id = 1
                updatedMDT.HoVaTen = "UpdatedName";
                updatedMDT.TKCK = "SampleTKCK";
                updatedMDT.SDT = "SampleSDT";
                updatedMDT.Email = "SampleEmail";
                updatedMDT.MDT = "SampleMDT";
                updatedMDT.DeletedAt = false;

                const app: e.Express = await CreateExpress().catch(e => errorThrower(e, "Failed to create Express"));

                const res = await chai
                    .request(app)
                    .put(`/api/v1/mdt/update/${sampleMDT.id}`)
                    .send({
                        hovaten: updatedMDT.HoVaTen,
                        tkck: updatedMDT.TKCK,
                        sdt: updatedMDT.SDT,
                        email: updatedMDT.Email,
                        mdt: updatedMDT.MDT,
                    }).catch(e => errorThrower(e, "Chai failed to mock request"));
                res.should.have.status(200);
                res.body.should.be.a("object");
                res.body.should.have.property("success").eql(true);
                res.body.should.have.property("message").eql(updatedMDT);
            });
        });

        describe("Failed PUT /api/v1/mdt/update UpdateMDT", (): void => {
            it("Should return invalid id error", async (): Promise<void> => {
                const sampleMDT: MDT = new MDT();

                sampleMDT.id = 1
                sampleMDT.HoVaTen = "SampleName";
                sampleMDT.TKCK = "SampleTKCK";
                sampleMDT.SDT = "SampleSDT";
                sampleMDT.Email = "SampleEmail";
                sampleMDT.MDT = "SampleMDT";
                sampleMDT.DeletedAt = false;

                await GetConnection().manager.save(sampleMDT)

                const updatedMDT: MDT = new MDT();
                updatedMDT.id = 1
                updatedMDT.HoVaTen = "UpdatedName";
                updatedMDT.TKCK = "SampleTKCK";
                updatedMDT.SDT = "SampleSDT";
                updatedMDT.Email = "SampleEmail";
                updatedMDT.MDT = "SampleMDT";
                updatedMDT.DeletedAt = false;

                const app: e.Express = await CreateExpress().catch(e => errorThrower(e, "Failed to create Express"));

                const invalidID = 9999

                const res = await chai
                    .request(app)
                    .put(`/api/v1/mdt/update/${invalidID}`) //Simulate invalid id
                    .send({
                        hovaten: updatedMDT.HoVaTen,
                        tkck: updatedMDT.TKCK,
                        sdt: updatedMDT.SDT,
                        email: updatedMDT.Email,
                        mdt: updatedMDT.MDT,
                    }).catch(e => errorThrower(e, "Chai failed to mock request"));
                res.should.have.status(404);
                res.body.should.be.a("object");
                res.body.should.have.property("success").eql(false);
                res.body.should.have.property("error").eql(`Failed to find mdt to update with id: ${invalidID}`);
            });
        });

        describe("Failed PUT /api/v1/mdt/update UpdateMDT", (): void => {
            it("Should return missing parameter error", async (): Promise<void> => {
                const sampleMDT: MDT = new MDT();

                sampleMDT.id = 1
                sampleMDT.HoVaTen = "SampleName";
                sampleMDT.TKCK = "SampleTKCK";
                sampleMDT.SDT = "SampleSDT";
                sampleMDT.Email = "SampleEmail";
                sampleMDT.MDT = "SampleMDT";
                sampleMDT.DeletedAt = false;

                await GetConnection().manager.save(sampleMDT)

                const updatedMDT: MDT = new MDT();
                updatedMDT.id = 1
                updatedMDT.HoVaTen = "UpdatedName";
                updatedMDT.TKCK = "SampleTKCK";
                updatedMDT.SDT = "SampleSDT";
                // updatedMDT.Email = "SampleEmail"; Simulate missing param error
                updatedMDT.MDT = "SampleMDT";
                updatedMDT.DeletedAt = false;

                const app: e.Express = await CreateExpress().catch(e => errorThrower(e, "Failed to create Express"));

                const res = await chai
                    .request(app)
                    .put(`/api/v1/mdt/update/${sampleMDT.id}`)
                    .send({
                        hovaten: updatedMDT.HoVaTen,
                        tkck: updatedMDT.TKCK,
                        sdt: updatedMDT.SDT,
                        // email: updatedMDT.Email,
                        mdt: updatedMDT.MDT,
                    }).catch(e => errorThrower(e, "Chai failed to mock request"));
                res.should.have.status(404);
                res.body.should.be.a("object");
                res.body.should.have.property("success").eql(false);
                res.body.should.have.property("error").eql("\"email\" is required");
            });
        });

        describe("Success DELETE /api/v1/mdt/delete DeleteMDT", (): void => {
            it("Should return Deleted MDT", async (): Promise<void> => {
                const sampleMDT: MDT = new MDT();

                sampleMDT.id = 1
                sampleMDT.HoVaTen = "SampleName";
                sampleMDT.TKCK = "SampleTKCK";
                sampleMDT.SDT = "SampleSDT";
                sampleMDT.Email = "SampleEmail";
                sampleMDT.MDT = "SampleMDT";
                sampleMDT.DeletedAt = false;

                await GetConnection().manager.save(sampleMDT)

                sampleMDT.DeletedAt = true

                const app: e.Express = await CreateExpress().catch(e => errorThrower(e, "Failed to create Express"));

                const res = await chai
                    .request(app)
                    .delete(`/api/v1/mdt/delete/${sampleMDT.id}`)
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

        describe("Failed DELETE /api/v1/mdt/delete DeleteMDT", (): void => {
            it("Should return invalid id error", async (): Promise<void> => {
                const sampleMDT: MDT = new MDT();

                sampleMDT.id = 1
                sampleMDT.HoVaTen = "SampleName";
                sampleMDT.TKCK = "SampleTKCK";
                sampleMDT.SDT = "SampleSDT";
                sampleMDT.Email = "SampleEmail";
                sampleMDT.MDT = "SampleMDT";
                sampleMDT.DeletedAt = false;

                await GetConnection().manager.save(sampleMDT)

                const updatedMDT: MDT = new MDT();
                updatedMDT.id = 1
                updatedMDT.HoVaTen = "SampleName";
                updatedMDT.TKCK = "SampleTKCK";
                updatedMDT.SDT = "SampleSDT";
                updatedMDT.Email = "SampleEmail";
                updatedMDT.MDT = "SampleMDT";
                updatedMDT.DeletedAt = false;

                const app: e.Express = await CreateExpress().catch(e => errorThrower(e, "Failed to create Express"));

                const invalidID = 9999

                const res = await chai
                    .request(app)
                    .delete(`/api/v1/mdt/delete/${invalidID}`) //Simulate invalid id
                    .send({
                        hovaten: updatedMDT.HoVaTen,
                        tkck: updatedMDT.TKCK,
                        sdt: updatedMDT.SDT,
                        email: updatedMDT.Email,
                        mdt: updatedMDT.MDT,
                    }).catch(e => errorThrower(e, "Chai failed to mock request"));
                res.should.have.status(404);
                res.body.should.be.a("object");
                res.body.should.have.property("success").eql(false);
                res.body.should.have.property("error").eql(`Failed to find mdt to delete with id: ${invalidID}`);
            });
        });

        describe("Success RandomMDT /api/v1/mdt/random RandomMDT", (): void => {
            it("Should return random MDT", async (): Promise<void> => {
                const sampleMDT: MDT = new MDT();
                sampleMDT.id = 1
                sampleMDT.HoVaTen = "SampleName";
                sampleMDT.TKCK = "SampleTKCK";
                sampleMDT.SDT = "SampleSDT";
                sampleMDT.Email = "SampleEmail";
                sampleMDT.MDT = "SampleMDT";
                sampleMDT.DeletedAt = false;


                const sampleMDT2: MDT = new MDT();
                sampleMDT2.id = 2
                sampleMDT2.HoVaTen = "SampleName2";
                sampleMDT2.TKCK = "SampleTKCK2";
                sampleMDT2.SDT = "SampleSDT2";
                sampleMDT2.Email = "SampleEmail2";
                sampleMDT2.MDT = "SampleMDT2";
                sampleMDT2.DeletedAt = false;

                await GetConnection().manager.save(sampleMDT)
                await GetConnection().manager.save(sampleMDT2)

                sampleMDT.DeletedAt = true
                sampleMDT2.DeletedAt = true

                const app: e.Express = await CreateExpress().catch(e => errorThrower(e, "Failed to create Express"));

                const res = await chai
                    .request(app)
                    .get(`/api/v1/mdt/random`)
                    .catch(e => errorThrower(e, "Chai failed to mock request"));
                res.should.have.status(200);
                res.body.should.be.a("object");
                res.body.should.have.property("success").eql(true);
                res.body.should.have.property("message").that.deep.oneOf([sampleMDT, sampleMDT2]);
            });
        });

        describe("Failed RandomMDT /api/v1/mdt/random RandomMDT", (): void => {
            it("Should return error for empty MDT", async (): Promise<void> => {
                const sampleMDT: MDT = new MDT();
                sampleMDT.id = 1
                sampleMDT.HoVaTen = "SampleName";
                sampleMDT.TKCK = "SampleTKCK";
                sampleMDT.SDT = "SampleSDT";
                sampleMDT.Email = "SampleEmail";
                sampleMDT.MDT = "SampleMDT";
                sampleMDT.DeletedAt = false;


                const sampleMDT2: MDT = new MDT();
                sampleMDT2.id = 2
                sampleMDT2.HoVaTen = "SampleName2";
                sampleMDT2.TKCK = "SampleTKCK2";
                sampleMDT2.SDT = "SampleSDT2";
                sampleMDT2.Email = "SampleEmail2";
                sampleMDT2.MDT = "SampleMDT2";
                sampleMDT2.DeletedAt = false;

                //Simulate empty mdt
                // await GetConnection().manager.save(sampleMDT)
                // await GetConnection().manager.save(sampleMDT2)

                sampleMDT.DeletedAt = true
                sampleMDT2.DeletedAt = true

                const app: e.Express = await CreateExpress().catch(e => errorThrower(e, "Failed to create Express"));

                const res = await chai
                    .request(app)
                    .get(`/api/v1/mdt/random`)
                    .catch(e => errorThrower(e, "Chai failed to mock request"));
                res.should.have.status(404);
                res.body.should.be.a("object");
                res.body.should.have.property("success").eql(false);
                res.body.should.have.property("error").eql("Mdts is empty")
            });
        });

        describe("Invalid Routes /api/v1/**/* any invalid route", (): void => {
            it("Should return invalid route error", async (): Promise<void> => {
                const app: e.Express = await CreateExpress().catch(e => errorThrower(e, "Failed to create Express"));

                const res = await chai
                    .request(app)
                    .get(`/api/v1/invalid`)// Simulate any unregistered route
                    .catch(e => errorThrower(e, "Chai failed to mock request"));
                res.should.have.status(404);
                res.body.should.be.a("object");
                res.body.should.have.property("success").eql(false);
                res.body.should.have.property("error").eql("Invalid Route")
            })
        })

        afterEach("Cleanup resources", async (): Promise<void> => {
            await TestDataSource.destroy().catch(e => errorThrower(e, "Failed to disconnect test database"));
            console.log("DB disconnected");
            await startedContainer.stop().catch(e => errorThrower(e, "Failed to stop testcontainer"));
            console.log("Container stopped");
        });
    });

    describe("Test Email", (): void => {
        beforeEach("Setup Resources", (): void => {
            dotenv.config({path: path.resolve(__dirname, '../.env')});
        });

        describe("Success POST /api/v1/email/create SentEmail", (): void => {
            it("Should return mail envelop", async (): Promise<void> => {
                const app: e.Express = await CreateExpress().catch(e => errorThrower(e, "Failed to create Express"));

                const mailOpts: { mdt: string; email: string } = {
                    "email": "truongminh453534@gmail.com",
                    "mdt": "00113"
                }

                const res = await chai
                    .request(app)
                    .post(`/api/v1/email/create`)
                    .send(mailOpts)
                    .catch(e => errorThrower(e, "Chai failed to mock request"));
                res.should.have.status(200);
                res.body.should.be.a("object");
                res.body.should.have.property("success").eql(true);
                res.body.should.have.property("message").eql({
                    "from": "",
                    "to": [
                        "truongminh453534@gmail.com"
                    ]
                })
            })
        });

        describe("Failed POST /api/v1/email/create SentEmail", (): void => {
            it("Should return missing param error", async (): Promise<void> => {
                const app: e.Express = await CreateExpress().catch(e => errorThrower(e, "Failed to create Express"));

                const mailOpts: { email: string } = {
                    "email": "truongminh453534@gmail.com",
                    // "mdt": "00113" // Simulate missing param
                }

                const res = await chai
                    .request(app)
                    .post(`/api/v1/email/create`)
                    .send(mailOpts)
                    .catch(e => errorThrower(e, "Chai failed to mock request"));
                res.should.have.status(404);
                res.body.should.be.a("object");
                res.body.should.have.property("success").eql(false);
                res.body.should.have.property("error").eql("\"mdt\" is required");
            })
        });

        describe("Failed POST /api/v1/email/create SentEmail", (): void => {
            it("Should return failed to sent email", async (): Promise<void> => {
                const app: e.Express = await CreateExpress().catch(e => errorThrower(e, "Failed to create Express"));

                const mailOpts: { mdt: string; email: string } = {
                    "email": "truongminh453534@gmail.com",
                    "mdt": "00113"
                }

                process.env.EMAIL_KEY = "bad email key" // Simulate wrong email key

                const res = await chai
                    .request(app)
                    .post(`/api/v1/email/create`)
                    .send(mailOpts)
                    .catch(e => errorThrower(e, "Chai failed to mock request"));
                res.should.have.status(404);
                res.body.should.be.a("object");
                res.body.should.have.property("success").eql(false);
                res.body.should.have.property("error").eql("Failed to sent email");
            })
        });

    })
});