import chai from 'chai';
import chaiHttp from 'chai-http';
import {SentMail} from "../../src/utils/email";
import * as dotenv from "dotenv"
import {describe} from "mocha";

dotenv.config({path: `${__dirname}/../../.env`});
chai.use(chaiHttp);
const expect: Chai.ExpectStatic = chai.expect;

describe("Test email", (): void => {
    describe('SentMail', (): void => {
        it('should send an email successfully', async (): Promise<void> => {
            const opts: { receiver: string; subject: string; body: string } = {
                receiver: 'test@example.com',
                subject: 'Test Email',
                body: 'This is a test email',
            };
            const result = await SentMail(opts);
            expect(result).to.exist;
            expect(result.accepted).to.be.an('array').that.includes(opts.receiver);
            expect(result.rejected).to.be.an('array').that.is.empty;
            expect(result.ehlo).to.deep.equal([
                'SIZE 35882577',
                '8BITMIME',
                'AUTH LOGIN PLAIN XOAUTH2 PLAIN-CLIENTTOKEN OAUTHBEARER XOAUTH',
                'ENHANCEDSTATUSCODES',
                'PIPELINING',
                'CHUNKING',
                'SMTPUTF8',
            ]);
            expect(result.envelopeTime).to.be.a('number');
            expect(result.messageTime).to.be.a('number');
            expect(result.messageSize).to.be.a('number');
            expect(result.response).to.be.a('string').that.matches(/^250 2\.0\.0 OK/);
            expect(result.envelope).to.deep.equal({
                from: '',
                to: [opts.receiver],
            });
            expect(result.messageId).to.be.a('string');
        });
        it('should throw an error for invalid login', async (): Promise<void> => {
            const opts: { receiver: string; subject: string; body: string } = {
                receiver: 'test@example.com',
                subject: 'Test Email',
                body: 'This is a test email',
            };
            process.env.EMAIL_KEY = 'invalid';
            let error;
            try {
                await SentMail(opts);
            } catch (err) {
                error = err;
            }
            expect(error).to.exist;
        });
        it('should throw an error for missing credentials', async (): Promise<void> => {
            const originalEnv = {...process.env};
            process.env = {};
            const opts: { receiver: string; subject: string; body: string } = {
                receiver: 'test@example.com',
                subject: 'Test Email',
                body: 'This is a test email',
            };
            let error;
            try {
                await SentMail(opts);
            } catch (err) {
                error = err;
            }
            process.env = originalEnv;
            expect(error).to.exist;
            expect(error.code).to.equal('EAUTH');
            expect(error.command).to.equal('API');
        });
    });
})