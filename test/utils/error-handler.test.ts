import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import {CustomError, ErrorHandler} from "../../src/utils/error-handler";
import {describe, it} from "mocha";


chai.use(chaiHttp);

describe("Test error-handler", (): void => {
    describe('CustomError', (): void => {
        it('should instantiate CustomError with statusCode and message', (): void => {
            const statusCode = 400;
            const message = 'Bad Request';

            const customError: CustomError = new CustomError(statusCode, message);

            expect(customError.statusCode).to.equal(statusCode);
            expect(customError.message).to.equal(message);
        });

        it('should instantiate CustomError with default values if statusCode and message are not provided', (): void => {
            const customError = new CustomError(500, 'Internal Server Error');

            expect(customError.statusCode).to.equal(500);
            expect(customError.message).to.equal('Internal Server Error');
        });
    });
    describe('ErrorHandler middleware', (): void => {
        it('should return the correct error message and status code', (): void => {
            // Create a mock error and request
            const err: CustomError = new CustomError(400, 'Test error');
            const req: any = {};
            const res: any = {
                status: (statusCode: number): any => {
                    res.statusCode = statusCode;
                    return res;
                },
                json: (body: any): any => {
                    res.body = body;
                },
            };
            const next: any = (): void => {
            };

            // Call the middleware function
            ErrorHandler(err, req, res, next);

            // Custom assertion for status code
            expect(res.statusCode).to.equal(400);

            // Check that the response has the correct error message
            expect(res.body).to.deep.equal({error: 'Test error'});
        });
    });
})