import assert from 'assert';
import * as Helpers from '../../../../utils/helpers/index.js';

describe('Módulo Helpers', () => {
    it('deve exportar CommonResponse', () => {
        assert.ok(Helpers.hasOwnProperty('CommonResponse'), "Helpers deve ter a propriedade 'CommonResponse'");
    });

    it('deve exportar CustomError', () => {
        assert.ok(Helpers.hasOwnProperty('CustomError'), "Helpers deve ter a propriedade 'CustomError'");
    });

    it('deve exportar HttpStatusCodes', () => {
        assert.ok(Helpers.hasOwnProperty('HttpStatusCodes'), "Helpers deve ter a propriedade 'HttpStatusCodes'");
    });

    it('deve exportar errorHandler', () => {
        assert.ok(Helpers.hasOwnProperty('errorHandler'), "Helpers deve ter a propriedade 'errorHandler'");
    });

    it('deve exportar messages', () => {
        assert.ok(Helpers.hasOwnProperty('messages'), "Helpers deve ter a propriedade 'messages'");
    });

    it('deve exportar StatusService', () => {
        assert.ok(Helpers.hasOwnProperty('StatusService'), "Helpers deve ter a propriedade 'StatusService'");
    });

    it('deve exportar asyncWrapper', () => {
        assert.ok(Helpers.hasOwnProperty('asyncWrapper'), "Helpers deve ter a propriedade 'asyncWrapper'");
    });
});
