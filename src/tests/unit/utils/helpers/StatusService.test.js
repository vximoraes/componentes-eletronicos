import assert from 'assert';
import StatusService from '../../../../../src/utils/helpers/StatusService.js';
import HttpStatusCodes from '../../../../../src/utils/helpers/HttpStatusCodes.js';
import messages from '../../../../../src/utils/helpers/messages.js';

describe('StatusService', () => {
    describe('getHttpCodeMessage', () => {
        it('deve retornar a mensagem correta para um código de status HTTP conhecido', () => {
            const code = 200;
            const expectedMessage = 'OK';
            HttpStatusCodes[code] = { code, message: expectedMessage };

            const result = StatusService.getHttpCodeMessage(code);
            assert.strictEqual(result, expectedMessage);
        });

        it('deve retornar "Status desconhecido." para um código de status HTTP desconhecido', () => {
            const code = 999;
            const result = StatusService.getHttpCodeMessage(code);
            assert.strictEqual(result, 'Status desconhecido.');
        });
    });

    describe('getErrorMessage', () => {
        it('deve retornar a mensagem de erro correta para um tipo de erro conhecido', () => {
            const type = 'REQUIRED_FIELD';
            const expectedMessage = 'This field is required.';
            messages.error[type] = expectedMessage;

            const result = StatusService.getErrorMessage(type);
            assert.strictEqual(result, expectedMessage);
        });

        it('deve retornar a mensagem de erro correta para um tipo de erro conhecido com um campo', () => {
            const type = 'INVALID_FIELD';
            const field = 'email';
            const expectedMessage = `The field ${field} is invalid.`;
            messages.error[type] = (field) => `The field ${field} is invalid.`;

            const result = StatusService.getErrorMessage(type, field);
            assert.strictEqual(result, expectedMessage);
        });

        it('deve retornar "Tipo de erro desconhecido." para um tipo de erro desconhecido', () => {
            const type = 'UNKNOWN_ERROR';
            const result = StatusService.getErrorMessage(type);
            assert.strictEqual(result, 'Tipo de erro desconhecido.');
        });
    });
});
