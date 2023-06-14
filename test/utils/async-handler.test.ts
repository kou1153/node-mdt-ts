import {expect} from 'chai';
import {NextFunction, Request, Response} from 'express';
import {AsyncHandler} from "../../src/utils/async-handler";
import {describe} from "mocha";

describe("Test async-handler", (): void => {
    describe('AsyncHandler', () => {
        it('should call the controller function and pass the request, response, and next', async (): Promise<void> => {
            let isControllerCalled: boolean = false;

            const controller = async (req: Request, res: Response): Promise<void> => {
                isControllerCalled = true;
            };

            const req: Partial<Request> = {};
            const res: Partial<Response> = {};
            const next: NextFunction = (): void => {
            };

            const asyncHandler = AsyncHandler(controller);
            await asyncHandler(req as Request, res as Response, next);

            expect(isControllerCalled).to.be.true;
        });

        it('should call the next function if an error is thrown', async (): Promise<void> => {
            const controller = async (): Promise<void> => {
                throw new Error('Test Error');
            };

            const req: Partial<Request> = {};
            const res: Partial<Response> = {};
            let isNextCalled: boolean = false;
            const next: NextFunction = (err): void => {
                isNextCalled = true;
                expect(err).to.exist;
                expect(err.message).to.equal('Test Error');
            };

            const asyncHandler = AsyncHandler(controller);
            await asyncHandler(req as Request, res as Response, next);

            expect(isNextCalled).to.be.true;
        });
    });
})