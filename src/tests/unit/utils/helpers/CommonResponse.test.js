import assert from 'assert';
import CommonResponse from '../../../../../src/utils/helpers/CommonResponse.js';
import StatusService from '../../../../../src/utils/helpers/StatusService.js';

describe('CommonResponse', () => {
    let res;

    beforeEach(() => {
        res = {
            statusCalledWith: null,
            jsonCalledWith: null,
            status(code) {
                this.statusCalledWith = code;
                return this;
            },
            json(data) {
                this.jsonCalledWith = data.toJSON ? data.toJSON() : data;
            }
        };
    });

    afterEach(() => {
        if (StatusService.getHttpCodeMessage.restore) {
            StatusService.getHttpCodeMessage.restore();
        }
        if (StatusService.getErrorMessage.restore) {
            StatusService.getErrorMessage.restore();
        }
    });    describe('success', () => {
        it('deve retornar uma resposta de sucesso com mensagem padrão', () => {
            const originalGetHttpCodeMessage = StatusService.getHttpCodeMessage;
            StatusService.getHttpCodeMessage = () => 'OK';

            CommonResponse.success(res, { key: 'value' });

            assert.strictEqual(res.statusCalledWith, 200, 'O status HTTP deve ser 200');
            assert.deepStrictEqual(res.jsonCalledWith, {
                error: false,
                code: 200,
                message: 'OK',
                data: { key: 'value' },
                errors: []
            }, 'A resposta JSON deve corresponder ao esperado');

            StatusService.getHttpCodeMessage = originalGetHttpCodeMessage;
        });

        it('deve retornar uma resposta de sucesso com data null', () => {
            const originalGetHttpCodeMessage = StatusService.getHttpCodeMessage;
            StatusService.getHttpCodeMessage = () => 'OK';

            CommonResponse.success(res, null);

            assert.strictEqual(res.statusCalledWith, 200, 'O status HTTP deve ser 200');
            assert.deepStrictEqual(res.jsonCalledWith, {
                error: false,
                code: 200,
                message: 'OK',
                data: null,
                errors: []
            }, 'A resposta JSON deve corresponder ao esperado');

            StatusService.getHttpCodeMessage = originalGetHttpCodeMessage;
        });

        it('deve retornar uma resposta de sucesso com mensagem personalizada', () => {
            CommonResponse.success(res, { key: 'value' }, 200, 'Mensagem de Sucesso Personalizada');

            assert.strictEqual(res.statusCalledWith, 200, 'O status HTTP deve ser 200');
            assert.deepStrictEqual(res.jsonCalledWith, {
                error: false,
                code: 200,
                message: 'Mensagem de Sucesso Personalizada',
                data: { key: 'value' },
                errors: []
            }, 'A resposta JSON deve corresponder ao esperado');
        });
    });    describe('error', () => {
        it('deve retornar uma resposta de erro com mensagem padrão', () => {
            const originalGetErrorMessage = StatusService.getErrorMessage;
            StatusService.getErrorMessage = () => 'Mensagem de Erro Padrão';

            CommonResponse.error(res, 400, 'errorType');

            assert.strictEqual(res.statusCalledWith, 400, 'O status HTTP deve ser 400');
            assert.deepStrictEqual(res.jsonCalledWith, {
                error: true,
                code: 400,
                message: 'Mensagem de Erro Padrão',
                data: null,
                errors: []
            }, 'A resposta JSON deve corresponder ao esperado');

            StatusService.getErrorMessage = originalGetErrorMessage;
        });

        it('deve retornar uma resposta de erro com lista de erros personalizada', () => {
            const originalGetErrorMessage = StatusService.getErrorMessage;
            StatusService.getErrorMessage = () => 'Mensagem de Erro Padrão';
            
            const listaErros = [{ campo: 'nome', mensagem: 'Campo obrigatório' }];
            CommonResponse.error(res, 400, 'errorType', 'campo', listaErros);

            assert.strictEqual(res.statusCalledWith, 400, 'O status HTTP deve ser 400');
            assert.deepStrictEqual(res.jsonCalledWith, {
                error: true,
                code: 400,
                message: 'Mensagem de Erro Padrão',
                data: null,
                errors: listaErros
            }, 'A resposta JSON deve corresponder ao esperado');

            StatusService.getErrorMessage = originalGetErrorMessage;
        });

        it('deve retornar uma resposta de erro com mensagem personalizada', () => {
            CommonResponse.error(res, 400, 'errorType', null, [], 'Mensagem de Erro Personalizada');

            assert.strictEqual(res.statusCalledWith, 400, 'O status HTTP deve ser 400');
            assert.deepStrictEqual(res.jsonCalledWith, {
                error: true,
                code: 400,
                message: 'Mensagem de Erro Personalizada',
                data: null,
                errors: []
            }, 'A resposta JSON deve corresponder ao esperado');
        });
    });    describe('created', () => {
        it('deve retornar uma resposta de criação sem mensagem personalizada', () => {
            const originalGetHttpCodeMessage = StatusService.getHttpCodeMessage;
            StatusService.getHttpCodeMessage = () => 'Created';

            CommonResponse.created(res, { key: 'value' });

            assert.strictEqual(res.statusCalledWith, 201, 'O status HTTP deve ser 201');
            assert.deepStrictEqual(res.jsonCalledWith, {
                error: false,
                code: 201,
                message: 'Created',
                data: { key: 'value' },
                errors: []
            }, 'A resposta JSON deve corresponder ao esperado');

            StatusService.getHttpCodeMessage = originalGetHttpCodeMessage;
        });

        it('deve retornar uma resposta de criação com data null', () => {
            const originalGetHttpCodeMessage = StatusService.getHttpCodeMessage;
            StatusService.getHttpCodeMessage = () => 'Created';

            CommonResponse.created(res, null);

            assert.strictEqual(res.statusCalledWith, 201, 'O status HTTP deve ser 201');
            assert.deepStrictEqual(res.jsonCalledWith, {
                error: false,
                code: 201,
                message: 'Created',
                data: null,
                errors: []
            }, 'A resposta JSON deve corresponder ao esperado');

            StatusService.getHttpCodeMessage = originalGetHttpCodeMessage;
        });

        it('deve retornar uma resposta de criação com mensagem personalizada', () => {
            CommonResponse.created(res, { key: 'value' }, 'Recurso Criado com Sucesso');

            assert.strictEqual(res.statusCalledWith, 201, 'O status HTTP deve ser 201');
            assert.deepStrictEqual(res.jsonCalledWith, {
                error: false,
                code: 201,
                message: 'Recurso Criado com Sucesso',
                data: { key: 'value' },
                errors: []
            }, 'A resposta JSON deve corresponder ao esperado');
        });
    });

    describe('serverError', () => {
        it('deve retornar uma resposta de erro de servidor com mensagem padrão', () => {
            const originalGetErrorMessage = StatusService.getErrorMessage;
            StatusService.getErrorMessage = () => 'Erro Interno do Servidor';

            CommonResponse.serverError(res);

            assert.strictEqual(res.statusCalledWith, 500, 'O status HTTP deve ser 500');
            assert.deepStrictEqual(res.jsonCalledWith, {
                error: true,
                code: 500,
                message: 'Erro Interno do Servidor',
                data: null,
                errors: []
            }, 'A resposta JSON deve corresponder ao esperado');

            StatusService.getErrorMessage = originalGetErrorMessage;
        });

        it('deve retornar uma resposta de erro de servidor com mensagem personalizada', () => {
            CommonResponse.serverError(res, 'Mensagem de Erro de Servidor Personalizada');

            assert.strictEqual(res.statusCalledWith, 500, 'O status HTTP deve ser 500');
            assert.deepStrictEqual(res.jsonCalledWith, {
                error: true,
                code: 500,
                message: 'Mensagem de Erro de Servidor Personalizada',
                data: null,
                errors: []
            }, 'A resposta JSON deve corresponder ao esperado');
        });
    });

    describe('Instanciação Direta', () => {
        it('deve criar uma instância sem parâmetros, usando valores padrão', () => {
            const response = new CommonResponse();
            assert.deepStrictEqual(response.toJSON(), {
                error: false,
                code: 200,
                message: '',
                data: null,
                errors: []
            }, 'A instância criada deve corresponder ao objeto esperado com todos os valores padrão');
        });

        it('deve criar uma instância diretamente com parâmetros mínimos', () => {
            const response = new CommonResponse(false, 200, 'OK');
            assert.deepStrictEqual(response.toJSON(), {
                error: false,
                code: 200,
                message: 'OK',
                data: null,
                errors: []
            }, 'A instância criada deve corresponder ao objeto esperado com valores padrão');
        });

        it('deve criar uma instância diretamente com todos os parâmetros', () => {
            const response = new CommonResponse(true, 400, 'Erro', { detail: 'Detalhe do erro' }, ['Erro 1', 'Erro 2']);
            assert.deepStrictEqual(response.toJSON(), {
                error: true,
                code: 400,
                message: 'Erro',
                data: { detail: 'Detalhe do erro' },
                errors: ['Erro 1', 'Erro 2']
            }, 'A instância criada deve corresponder ao objeto esperado com todos os parâmetros fornecidos');
        });
    });

    describe('Cobertura de status code customizado', () => {
        it('deve retornar resposta com status code customizado', () => {
            CommonResponse.success(res, { key: 'value' }, 418, 'Sou um bule de chá');
            assert.strictEqual(res.statusCalledWith, 418);
            assert.deepStrictEqual(res.jsonCalledWith, {
                error: false,
                code: 418,
                message: 'Sou um bule de chá',
                data: { key: 'value' },
                errors: []
            });
        });
    });
});
