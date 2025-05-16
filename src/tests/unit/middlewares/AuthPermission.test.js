import jwt from 'jsonwebtoken';
import PermissionService from '../../../services/PermissionService.js';
import Rota from '../../../models/Rota.js';
import authPermission from '../../../middlewares/AuthPermission.js';
import { CustomError, errorHandler, messages } from '../utils/helpers/index.js';

// Mock dos módulos externos.
jest.mock('jsonwebtoken');
jest.mock('../../../models/Rota.js');
jest.mock('../../../services/PermissionService.js', () => ({
    hasPermission: jest.fn(),
}));

describe('Middleware authPermission', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {},
            url: '',
            method: '',
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        next = jest.fn();

        // Limpar todas as chamadas anteriores dos mocks.
        jest.clearAllMocks();
    });

    afterEach(() => {
        // Restaurar implementações originais, se necessário.
        jest.restoreAllMocks();
    });

    it('deve retornar erro se o cabeçalho de autorização não estiver presente', async () => {
        await authPermission(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: messages.error.resourceNotFound('Token')
        }));
    });

    it('deve retornar erro se o token for inválido', async () => {
        req.headers.authorization = 'Bearer invalidtoken';
        jwt.verify.mockImplementation(() => {
            throw new Error('invalid token');
        });

        await authPermission(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Token de autenticação inválido ou expirado.'
        }));
    });

    it('deve retornar erro se a rota não for encontrada no banco de dados', async () => {
        req.headers.authorization = 'Bearer validtoken';
        req.url = '/api/usuarios';
        req.method = 'GET';

        jwt.verify.mockReturnValue({ id: 'userId' });
        Rota.findOne.mockResolvedValue(null);

        await authPermission(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Rota não encontrada.'
        }));
    });

    it('deve retornar erro se o método HTTP não for suportado', async () => {
        req.headers.authorization = 'Bearer validtoken';
        req.url = '/api/usuarios';
        req.method = 'INVALID';

        jwt.verify.mockReturnValue({ id: 'userId' });

        await authPermission(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(405);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Método HTTP não suportado.'
        }));
    });

    it('deve retornar erro se a rota estiver inativa ou não suportar o método', async () => {
        req.headers.authorization = 'Bearer validtoken';
        req.url = '/api/usuarios';
        req.method = 'GET';

        jwt.verify.mockReturnValue({ id: 'userId' });
        Rota.findOne.mockResolvedValue({ ativo: false, buscar: false });

        await authPermission(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Ação não permitida nesta rota.'
        }));
    });

    it('deve retornar erro se o usuário não tiver permissão', async () => {
        req.headers.authorization = 'Bearer validtoken';
        req.url = '/api/usuarios';
        req.method = 'GET';

        jwt.verify.mockReturnValue({ id: 'userId' });
        Rota.findOne.mockResolvedValue({ ativo: true, buscar: true });
        PermissionService.hasPermission.mockResolvedValue(false);

        await authPermission(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Você não tem permissão para realizar esta ação.'
        }));
    });

    it('deve chamar next se o usuário tiver permissão', async () => {
        req.headers.authorization = 'Bearer validtoken';
        req.url = '/api/usuarios';
        req.method = 'GET';

        jwt.verify.mockReturnValue({ id: 'userId' });
        Rota.findOne.mockResolvedValue({ ativo: true, buscar: true });
        PermissionService.hasPermission.mockResolvedValue(true);

        await authPermission(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.user).toEqual({ id: 'userId' });
    });
});