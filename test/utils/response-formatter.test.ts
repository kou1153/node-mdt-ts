import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import {ApiResponse, createApiResponse} from "../../src/utils/response-formatter";

chai.use(chaiHttp);

describe('Test response-formatter', (): void => {
    describe('createApiResponse', (): void => {
        it('should create the API response object with success', (): void => {
            const response: ApiResponse = createApiResponse(true);

            expect(response).to.deep.equal({success: true});
        });
        it('should create the API response object with success, data, and message', (): void => {
            const data: { name: string; id: number } = {id: 1, name: 'John Doe'};
            const message = 'Data retrieved successfully';

            const response: ApiResponse = createApiResponse(true, data, message);

            expect(response).to.deep.equal({success: true, data: data, message: message});
        });
        it('should create the API response object with success and data', (): void => {
            const data: { name: string; id: number } = {id: 1, name: 'John Doe'};

            const response: ApiResponse = createApiResponse(true, data);

            expect(response).to.deep.equal({success: true, data: data});
        });
        it('should create the API response object with success and message', (): void => {
            const message = 'Operation completed successfully';

            const response: ApiResponse = createApiResponse(true, undefined, message);

            expect(response).to.deep.equal({success: true, message: message});
        });
        it('should create the API response object with success, data, and empty message', (): void => {
            const data: { name: string; id: number } = {id: 1, name: 'John Doe'};

            const response: ApiResponse = createApiResponse(true, data, '');

            expect(response).to.deep.equal({success: true, data: data});
        });
    });
});
