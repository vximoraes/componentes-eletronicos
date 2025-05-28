import CustomError from '../../../../utils/helpers/CustomError.js';

describe('CustomError', () => {
    it('deve criar uma instância de CustomError com todas as propriedades', () => {
        const errorParams = {
            statusCode: 400,
            errorType: 'validationError',
            field: 'email',
            details: [{ path: 'email', message: 'Email inválido' }],
            customMessage: 'Endereço de email inválido'
        };
        const error = new CustomError(errorParams);

        if (!(error instanceof CustomError)) throw new Error('Esperado que o erro seja uma instância de CustomError');
        if (error.statusCode !== errorParams.statusCode) throw new Error('O código de status não corresponde');
        if (error.errorType !== errorParams.errorType) throw new Error('O tipo de erro não corresponde');
        if (error.field !== errorParams.field) throw new Error('O campo não corresponde');
        if (JSON.stringify(error.details) !== JSON.stringify(errorParams.details)) throw new Error('Os detalhes não correspondem');
        if (error.customMessage !== errorParams.customMessage) throw new Error('A mensagem personalizada não corresponde');
        if (!error.isOperational) throw new Error('Esperado que isOperational seja verdadeiro');
    });

    it('deve criar uma instância de CustomError com valores padrão para propriedades opcionais', () => {
        const errorParams = {
            statusCode: 404,
            errorType: 'notFound'
        };
        const error = new CustomError(errorParams);

        if (!(error instanceof CustomError)) throw new Error('Esperado que o erro seja uma instância de CustomError');
        if (error.statusCode !== errorParams.statusCode) throw new Error('O código de status não corresponde');
        if (error.errorType !== errorParams.errorType) throw new Error('O tipo de erro não corresponde');
        if (error.field !== null) throw new Error('Esperado que o campo seja nulo');
        if (JSON.stringify(error.details) !== JSON.stringify([])) throw new Error('Esperado que os detalhes sejam um array vazio');
        if (error.customMessage !== null) throw new Error('Esperado que a mensagem personalizada seja nula');
        if (!error.isOperational) throw new Error('Esperado que isOperational seja verdadeiro');
    });

    it('deve capturar o rastreamento de pilha', () => {
        const errorParams = {
            statusCode: 500,
            errorType: 'serverError',
            customMessage: 'Erro interno do servidor'
        };
        const error = new CustomError(errorParams);

        if (typeof error.stack !== 'string') throw new Error('Esperado que a pilha seja uma string');
        if (!error.stack.includes('CustomError')) throw new Error('Esperado que a pilha inclua "CustomError"');
    });    it('deve criar CustomError mesmo com parâmetros nulos/undefined', () => {
        const error = new CustomError({ statusCode: 500, errorType: undefined, field: undefined, details: undefined, customMessage: undefined });
        if (!(error instanceof CustomError)) throw new Error('Esperado que o erro seja uma instância de CustomError');
        if (error.statusCode !== 500) throw new Error('O código de status não corresponde');
        if (typeof error.errorType !== 'undefined') throw new Error('Esperado que errorType seja undefined');
        if (error.field !== null) throw new Error('Esperado que o campo seja nulo');
        if (JSON.stringify(error.details) !== JSON.stringify([])) throw new Error('Esperado que os detalhes sejam um array vazio');
        if (error.customMessage !== null) throw new Error('Esperado que a mensagem personalizada seja nula');
    });    it('deve criar CustomError sem nenhum parâmetro, usando valores padrão', () => {
        const error = new CustomError();
        if (!(error instanceof CustomError)) throw new Error('Esperado que o erro seja uma instância de CustomError');
        if (error.message !== 'An error occurred') throw new Error('A mensagem padrão não corresponde');
        if (error.field !== null) throw new Error('Esperado que o campo seja nulo');
        if (JSON.stringify(error.details) !== JSON.stringify([])) throw new Error('Esperado que os detalhes sejam um array vazio');
        if (error.customMessage !== null) throw new Error('Esperado que a mensagem personalizada seja nula');
    });

    it('deve usar a mensagem padrão quando customMessage não é fornecido', () => {
        const error = new CustomError({ statusCode: 403, errorType: 'forbidden' });
        if (!(error instanceof CustomError)) throw new Error('Esperado que o erro seja uma instância de CustomError');
        if (error.message !== 'An error occurred') throw new Error('A mensagem padrão não corresponde');
        if (error.statusCode !== 403) throw new Error('O código de status não corresponde');
        if (error.errorType !== 'forbidden') throw new Error('O tipo de erro não corresponde');
    });
});
