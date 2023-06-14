import {expect} from 'chai';
import Joi from 'joi';
import {validateEmail, validateMDT, validator} from '../../src/utils/joi-validate';

describe("Test Joi-validate", (): void => {
    describe('validator', (): void => {
        it('should return a function that validates a payload against a schema', (): void => {
            const schema: Joi.ObjectSchema = Joi.object({
                name: Joi.string().required(),
                age: Joi.number().integer().min(18).max(99).required(),
            });
            const validate = validator(schema);
            const payload: { name: string; age: number } = {
                name: 'John Doe',
                age: 30,
            };
            const result: Joi.ValidationResult = validate(payload);
            expect(result.value).to.deep.equal(payload);
        });
    });
    describe('validateEmail', (): void => {
        it('should validate an email and mdt', (): void => {
            const payload: { mdt: string; email: string } = {
                email: 'test@example.com',
                mdt: 'testmdt',
            };
            const result: Joi.ValidationResult = validateEmail(payload);
            expect(result.value).to.deep.equal(payload);
        });
        it('should return an error if email or mdt is missing', (): void => {
            const payload: { email: string } = {
                email: 'test@example.com',
            };
            const result: Joi.ValidationResult = validateEmail(payload);
            expect(result.error).to.exist;
        });
    });
    describe('validateMDT', (): void => {
        it('should validate an MDT', (): void => {
            const payload: { sdt: string; hovaten: string; tkck: string; mdt: string; email: string } = {
                hovaten: 'John Doe',
                tkck: '123456789',
                sdt: '0123456789',
                email: 'test@example.com',
                mdt: 'testmdt',
            };
            const result: Joi.ValidationResult = validateMDT(payload);
            expect(result.value).to.deep.equal(payload);
        });
        it('should return an error if any required field is missing', (): void => {
            const payload: { sdt: string; hovaten: string; tkck: string; email: string } = {
                hovaten: 'John Doe',
                tkck: '123456789',
                sdt: '0123456789',
                email: 'test@example.com',
            };
            const result: Joi.ValidationResult = validateMDT(payload);
            expect(result.error).to.exist;
        });
    });
})