import CategoriaController from '../../../controllers/CategoriaController.js';
import CategoriaService from '../../../services/CategoriaService.js';
import { CategoriaSchema, CategoriaUpdateSchema } from '../../../utils/validators/schemas/zod/CategoriaSchema.js';
import { CategoriaQuerySchema, CategoriaIdSchema } from '../../../utils/validators/schemas/zod/querys/CategoriaQuerySchema.js';
import { CommonResponse } from '../../../utils/helpers/index.js';

jest.mock('../../../services/CategoriaService.js');
jest.mock('../../../utils/validators/schemas/zod/CategoriaSchema.js');
jest.mock('../../../utils/validators/schemas/zod/querys/CategoriaQuerySchema.js');
jest.mock('../../../utils/helpers/index.js', () => ({
    CommonResponse: {
        created: jest.fn(),
        success: jest.fn(),
    }
}));

describe('CategoriaController', () => {
    let controller, req, res, serviceMock;

    beforeEach(() => {
        controller = new CategoriaController();
        req = { body: {}, params: {}, query: {} };
        res = {};
        serviceMock = CategoriaService.mock.instances[0];
        jest.clearAllMocks();
    });

    describe('criar', () => {
        it('deve criar categoria com dados válidos', async () => {
            const categoria = { nome: 'Nova Categoria', toObject: () => ({ nome: 'Nova Categoria', _id: '1' }) };
            CategoriaSchema.parse.mockReturnValue({ nome: 'Nova Categoria' });
            serviceMock.criar.mockResolvedValue(categoria);

            await controller.criar(req, res);

            expect(CategoriaSchema.parse).toHaveBeenCalledWith(req.body);
            expect(serviceMock.criar).toHaveBeenCalledWith({ nome: 'Nova Categoria' });
            expect(CommonResponse.created).toHaveBeenCalledWith(res, { nome: 'Nova Categoria', _id: '1' });
        });

        it('deve retornar erro 400 para dados inválidos', async () => {
            CategoriaSchema.parse.mockImplementation(() => { throw { name: 'ZodError' }; });
            await expect(controller.criar(req, res)).rejects.toEqual(expect.objectContaining({ name: 'ZodError' }));
        });
    });

    describe('listar', () => {
        it('deve listar categorias sem filtros', async () => {
            serviceMock.listar.mockResolvedValue([{ nome: 'Categoria 1' }]);
            await controller.listar(req, res);
            expect(serviceMock.listar).toHaveBeenCalledWith(req);
            expect(CommonResponse.success).toHaveBeenCalledWith(res, [{ nome: 'Categoria 1' }]);
        });

        it('deve validar id se presente', async () => {
            req.params = { id: '123' };
            CategoriaIdSchema.parse.mockReturnValue('123');
            serviceMock.listar.mockResolvedValue([{ nome: 'Categoria 1' }]);
            await controller.listar(req, res);
            expect(CategoriaIdSchema.parse).toHaveBeenCalledWith('123');
        });

        it('deve validar query se presente', async () => {
            req.query = { nome: 'Teste' };
            CategoriaQuerySchema.parseAsync.mockResolvedValue(req.query);
            serviceMock.listar.mockResolvedValue([{ nome: 'Categoria 1' }]);
            await controller.listar(req, res);
            expect(CategoriaQuerySchema.parseAsync).toHaveBeenCalledWith(req.query);
        });

        it('deve retornar erro 400 para filtro inválido', async () => {
            req.query = { nome: 123 };
            CategoriaQuerySchema.parseAsync.mockRejectedValue({ name: 'ZodError' });
            await expect(controller.listar(req, res)).rejects.toEqual(expect.objectContaining({ name: 'ZodError' }));
        });
    });

    describe('atualizar', () => {
        it('deve atualizar categoria com dados válidos', async () => {
            req.params = { id: '1' };
            req.body = { nome: 'Atualizada' };
            CategoriaIdSchema.parse.mockReturnValue('1');
            CategoriaUpdateSchema.parse.mockReturnValue({ nome: 'Atualizada' });
            serviceMock.atualizar.mockResolvedValue({ nome: 'Atualizada' });

            await controller.atualizar(req, res);

            expect(CategoriaIdSchema.parse).toHaveBeenCalledWith('1');
            expect(CategoriaUpdateSchema.parse).toHaveBeenCalledWith(req.body);
            expect(serviceMock.atualizar).toHaveBeenCalledWith('1', { nome: 'Atualizada' });
            expect(CommonResponse.success).toHaveBeenCalledWith(res, { nome: 'Atualizada' }, 200, 'Categoria atualizada com sucesso.');
        });

        it('deve retornar erro 400 para dados inválidos', async () => {
            req.params = { id: '1' };
            CategoriaIdSchema.parse.mockReturnValue('1');
            CategoriaUpdateSchema.parse.mockImplementation(() => { throw { name: 'ZodError' }; });
            await expect(controller.atualizar(req, res)).rejects.toEqual(expect.objectContaining({ name: 'ZodError' }));
        });

        it('deve retornar erro 404 para categoria inexistente', async () => {
            req.params = { id: '1' };
            CategoriaIdSchema.parse.mockReturnValue('1');
            CategoriaUpdateSchema.parse.mockReturnValue({ nome: 'Atualizada' });
            serviceMock.atualizar.mockRejectedValue({ status: 404 });
            await expect(controller.atualizar(req, res)).rejects.toEqual(expect.objectContaining({ status: 404 }));
        });
    });

    describe('deletar', () => {
        it('deve deletar categoria existente', async () => {
            req.params = { id: '1' };
            CategoriaIdSchema.parse.mockReturnValue('1');
            serviceMock.deletar.mockResolvedValue({ nome: 'Removida' });

            await controller.deletar(req, res);

            expect(CategoriaIdSchema.parse).toHaveBeenCalledWith('1');
            expect(serviceMock.deletar).toHaveBeenCalledWith('1');
            expect(CommonResponse.success).toHaveBeenCalledWith(res, { nome: 'Removida' }, 200, 'Categoria excluída com sucesso.');
        });

        it('deve retornar erro 404 ao tentar deletar categoria inexistente', async () => {
            req.params = { id: '1' };
            CategoriaIdSchema.parse.mockReturnValue('1');
            serviceMock.deletar.mockRejectedValue({ status: 404 });
            await expect(controller.deletar(req, res)).rejects.toEqual(expect.objectContaining({ status: 404 }));
        });
    });

    describe('erros inesperados', () => {
        it('deve retornar erro 500 para falha inesperada em criar', async () => {
            CategoriaSchema.parse.mockReturnValue({ nome: 'Erro' });
            serviceMock.criar.mockRejectedValue({ status: 500 });
            await expect(controller.criar(req, res)).rejects.toEqual(expect.objectContaining({ status: 500 }));
        });

        it('deve retornar erro 500 para falha inesperada em listar', async () => {
            serviceMock.listar.mockRejectedValue({ status: 500 });
            await expect(controller.listar(req, res)).rejects.toEqual(expect.objectContaining({ status: 500 }));
        });

        it('deve retornar erro 500 para falha inesperada em atualizar', async () => {
            req.params = { id: '1' };
            CategoriaIdSchema.parse.mockReturnValue('1');
            CategoriaUpdateSchema.parse.mockReturnValue({ nome: 'Erro' });
            serviceMock.atualizar.mockRejectedValue({ status: 500 });
            await expect(controller.atualizar(req, res)).rejects.toEqual(expect.objectContaining({ status: 500 }));
        });

        it('deve retornar erro 500 para falha inesperada em deletar', async () => {
            req.params = { id: '1' };
            CategoriaIdSchema.parse.mockReturnValue('1');
            serviceMock.deletar.mockRejectedValue({ status: 500 });
            await expect(controller.deletar(req, res)).rejects.toEqual(expect.objectContaining({ status: 500 }));
        });
    });
});