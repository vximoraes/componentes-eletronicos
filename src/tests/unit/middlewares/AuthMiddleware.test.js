import jwt from 'jsonwebtoken';
import AuthMiddleware from '../../../middlewares/AuthMiddleware.js';
import AuthenticationError from '../../../utils/errors/AuthenticationError.js';
import TokenExpiredError from '../../../utils/errors/TokenExpiredError.js';
import { CustomError } from '../../../utils/helpers/index.js';
import AuthService from '../../../services/AuthService.js';

describe('AuthMiddleware', () => {
    let req, res, next, authServiceOriginal;

    beforeEach(() => {
        req = {
            headers: {}
        };
        res = {};

        // Mock da função next.
        next = jest.fn();

        // Salva a implementação original de carregatokens.
        authServiceOriginal = AuthService.prototype.carregatokens;

        // Mock da função carregatokens.
        AuthService.prototype.carregatokens = jest.fn();
    });

    afterEach(() => {
        // Restaura a função carregatokens original.
        AuthService.prototype.carregatokens = authServiceOriginal;

        // Restaura jwt.verify e outros mocks.
        jest.restoreAllMocks();
    });

    it('deve lançar AuthenticationError se nenhum cabeçalho de autorização estiver presente', async () => {
        await AuthMiddleware(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        const error = next.mock.calls[0][0];
        expect(error).toBeInstanceOf(AuthenticationError);
        expect(error.message).toBe("O token de autenticação não existe!");
    });

    it('deve lançar AuthenticationError se o formato do cabeçalho de autorização for inválido', async () => {
        req.headers.authorization = 'InvalidToken';
        await AuthMiddleware(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        const error = next.mock.calls[0][0];
        expect(error).toBeInstanceOf(AuthenticationError);
        expect(error.message).toBe("Formato do token de autenticação inválido!");
    });

    it('deve lançar AuthenticationError se o JWT for inválido', async () => {
        req.headers.authorization = 'Bearer invalidtoken';

        // Mock de jwt.verify para chamar o callback com um erro de token inválido.
        jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
            callback(new jwt.JsonWebTokenError('invalid token'), null);
        });

        await AuthMiddleware(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        const error = next.mock.calls[0][0];
        expect(error).toBeInstanceOf(AuthenticationError);
        expect(error.message).toBe("Token JWT inválido!");
    });

    it('deve lançar TokenExpiredError se o JWT estiver expirado', async () => {
        req.headers.authorization = 'Bearer expiredtoken';

        // Mock de jwt.verify para chamar o callback com um erro de token expirado.
        jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
            callback(new jwt.TokenExpiredError('jwt expired', new Date()), null);
        });

        await AuthMiddleware(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        const error = next.mock.calls[0][0];
        expect(error).toBeInstanceOf(TokenExpiredError);
        expect(error.message).toBe("O token JWT está expirado!");
    });

    it('deve lançar CustomError se o refreshtoken for inválido', async () => {
        req.headers.authorization = 'Bearer validtoken';

        // Mock de jwt.verify para chamar o callback com um payload válido.
        jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
            callback(null, { id: 'userId' });
        });

        // Mock da função carregatokens para retornar refreshtoken nulo.
        AuthService.prototype.carregatokens.mockResolvedValue({
            data: { refreshtoken: null }
        });

        await AuthMiddleware(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        const error = next.mock.calls[0][0];
        expect(error).toBeInstanceOf(CustomError);
        expect(error.customMessage).toBe('Refresh token inválido, autentique novamente!');
    });

    it('deve anexar user_id à requisição e chamar next se o token for válido', async () => {
        req.headers.authorization = 'Bearer validtoken';

        // Mock de jwt.verify para chamar o callback com um payload válido.
        jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
            callback(null, { id: 'userId' });
        });

        // Mock da função carregatokens para retornar um refreshtoken válido.
        AuthService.prototype.carregatokens.mockResolvedValue({
            data: { refreshtoken: 'validrefreshtoken' }
        });

        await AuthMiddleware(req, res, next);
        expect(req.user_id).toBe('userId');
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith();
    });

    // Novo teste para cobrir erros inesperados.
    it('deve passar erros inesperados para o errorHandler', async () => {
        req.headers.authorization = 'Bearer validtoken';

        // Mock de jwt.verify para chamar o callback com um payload válido.
        jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
            callback(null, { id: 'userId' });
        });

        // Mock da função carregatokens para lançar um erro inesperado.
        const unexpectedError = new Error('Erro inesperado');
        AuthService.prototype.carregatokens.mockRejectedValue(unexpectedError);

        await AuthMiddleware(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        const error = next.mock.calls[0][0];
        expect(error).toBe(unexpectedError);
    });

    // Novo teste para cobrir a linha 39.
    it('deve lançar TokenExpiredError se a decodificação do token retornar null', async () => {
        req.headers.authorization = 'Bearer validtoken';

        // Mock de jwt.verify para chamar o callback com null.
        jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
            callback(null, null); // Simula decodificação retornando null.
        });

        await AuthMiddleware(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        const error = next.mock.calls[0][0];
        expect(error).toBeInstanceOf(TokenExpiredError);
        expect(error.message).toBe("O token JWT está expirado!");
    });
});