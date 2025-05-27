jest.mock('../../../utils/helpers/index.js', () => {
    return {
        CommonResponse: {
            success: jest.fn(),
            created: jest.fn()
        },
        CustomError: jest.fn((opts) => {
            const err = new Error(opts.customMessage);
            err.statusCode = opts.statusCode;
            err.errorType = opts.errorType;
            err.field = opts.field;
            err.details = opts.details;
            return err;
        }),
        HttpStatusCodes: {
            BAD_REQUEST: { code: 400 },
            NOT_FOUND: { code: 404 },
            CONFLICT: { code: 409 },
            INTERNAL_SERVER_ERROR: { code: 500 }
        },
        errorHandler: jest.fn(),
        messages: {
            usuario: {
                email_ja_cadastrado: 'E-mail já cadastrado',
                usuario_nao_encontrado: 'Usuário não encontrado',
                erro_interno: 'Erro interno',
                erro_validacao: 'Erro de validação',
                erro_filtro: 'Filtro inválido',
                erro_remocao: 'Não foi possível remover usuário',
                sucesso: 'Operação realizada com sucesso',
                sucesso_remocao: 'Usuário removido com sucesso',
            }
        },
        StatusService: {},
        asyncWrapper: jest.fn()
    };
});

jest.mock('../../../utils/validators/schemas/zod/UsuarioSchema.js', () => {
    return {
        UsuarioSchema: { parse: jest.fn() },
        UsuarioUpdateSchema: { parse: jest.fn() }
    };
});

jest.mock('../../../utils/validators/schemas/zod/querys/UsuarioQuerySchema.js', () => {
    return {
        UsuarioQuerySchema: { parse: jest.fn(), parseAsync: jest.fn() },
        UsuarioIdSchema: { parse: jest.fn() }
    };
});

import UsuarioController from '../../../controllers/UsuarioController.js';
import { CommonResponse, CustomError, messages } from '../../../utils/helpers/index.js';
import { UsuarioSchema, UsuarioUpdateSchema } from '../../../utils/validators/schemas/zod/UsuarioSchema.js';
import { UsuarioQuerySchema, UsuarioIdSchema } from '../../../utils/validators/schemas/zod/querys/UsuarioQuerySchema.js';

describe('UsuarioController - regras de negócio (simples)', () => {
    let controller, req, res, next;

    beforeEach(() => {
        controller = new UsuarioController();
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            setHeader: jest.fn(),
            sendFile: jest.fn()
        };
        req = { params: {}, query: {}, body: {}, files: {} };
        next = jest.fn();
        CommonResponse.success.mockClear();
        CommonResponse.created.mockClear();
        UsuarioSchema.parse.mockClear();
        UsuarioUpdateSchema.parse.mockClear();
        UsuarioQuerySchema.parse.mockClear();
        UsuarioIdSchema.parse.mockClear();
        controller.service = {
            listar: jest.fn(),
            criar: jest.fn(),
            atualizar: jest.fn(),
            deletar: jest.fn()
        };
    });

    describe('criar', () => {
        it('deve criar usuário e nunca retornar senha', async () => {
            const user = { toObject: () => ({ _id: '1', nome: 'Fulano', email: 'f@f.com', senha: 'hash' }) };
            req.body = { nome: 'Fulano', email: 'f@f.com', senha: '123' };
            UsuarioSchema.parse.mockReturnValue(req.body);
            controller.service.criar.mockResolvedValue(user);
            await controller.criar(req, res, next);
            expect(CommonResponse.created).toHaveBeenCalledWith(res, expect.not.objectContaining({ senha: expect.anything() }));
        });
        it('deve lançar erro se schema inválido', async () => {
            UsuarioSchema.parse.mockImplementation(() => { throw new Error('erro schema'); });
            await expect(controller.criar(req, res, next)).rejects.toThrow('erro schema');
        });
        it('deve lançar erro se service.criar lançar', async () => {
            UsuarioSchema.parse.mockReturnValue(req.body);
            controller.service.criar.mockImplementation(() => { throw new Error('erro service'); });
            await expect(controller.criar(req, res, next)).rejects.toThrow('erro service');
        });
    });

    describe('listar', () => {
        it('deve validar id se informado', async () => {
            req.params = { id: 'abc' };
            UsuarioIdSchema.parse.mockReturnValue('abc');
            controller.service.listar.mockResolvedValue({});
            await controller.listar(req, res, next);
            expect(UsuarioIdSchema.parse).toHaveBeenCalledWith('abc');
        });
        it('deve validar query se informada', async () => {
            req.query = { search: 'foo' };
            UsuarioQuerySchema.parseAsync.mockResolvedValue(req.query);
            controller.service.listar.mockResolvedValue([]);
            await controller.listar(req, res, next);
            expect(UsuarioQuerySchema.parseAsync).toHaveBeenCalledWith(req.query);
        });
        it('deve lançar erro se service.listar lançar', async () => {
            controller.service.listar.mockImplementation(() => { throw new Error('erro listar'); });
            await expect(controller.listar(req, res, next)).rejects.toThrow('erro listar');
        });
    });

    describe('atualizar', () => {
        it('deve atualizar usuário e nunca retornar senha', async () => {
            req.params = { id: '1' };
            req.body = { nome: 'Novo' };
            UsuarioIdSchema.parse.mockReturnValue('1');
            UsuarioUpdateSchema.parse.mockReturnValue(req.body);
            controller.service.atualizar.mockResolvedValue({ _id: '1', nome: 'Novo', senha: 'hash' });
            await controller.atualizar(req, res, next);
            expect(CommonResponse.success).toHaveBeenCalledWith(res, expect.not.objectContaining({ senha: expect.anything() }), 200, expect.any(String));
        });
        it('deve lançar erro se schema inválido', async () => {
            req.params = { id: '1' };
            UsuarioIdSchema.parse.mockReturnValue('1');
            UsuarioUpdateSchema.parse.mockImplementation(() => { throw new Error('erro update schema'); });
            await expect(controller.atualizar(req, res, next)).rejects.toThrow('erro update schema');
        });
        it('deve lançar erro se service.atualizar lançar', async () => {
            req.params = { id: '1' };
            UsuarioIdSchema.parse.mockReturnValue('1');
            UsuarioUpdateSchema.parse.mockReturnValue(req.body);
            controller.service.atualizar.mockImplementation(() => { throw new Error('erro atualizar'); });
            await expect(controller.atualizar(req, res, next)).rejects.toThrow('erro atualizar');
        });
    });

    describe('deletar', () => {
        it('deve deletar usuário', async () => {
            req.params = { id: '1' };
            UsuarioIdSchema.parse.mockReturnValue('1');
            controller.service.deletar.mockResolvedValue({ deleted: true });
            await controller.deletar(req, res, next);
            expect(CommonResponse.success).toHaveBeenCalledWith(res, { deleted: true }, 200, expect.any(String));
        });
        it('deve lançar erro se service.deletar lançar', async () => {
            req.params = { id: '1' };
            UsuarioIdSchema.parse.mockReturnValue('1');
            controller.service.deletar.mockImplementation(() => { throw new Error('erro deletar'); });
            await expect(controller.deletar(req, res, next)).rejects.toThrow('erro deletar');
        });
    });
});
