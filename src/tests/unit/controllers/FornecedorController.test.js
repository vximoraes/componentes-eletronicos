import FornecedorController from '../../../controllers/FornecedorController.js';
import FornecedorService from '../../../services/FornecedorService.js';
import { FornecedorSchema, FornecedorUpdateSchema } from '../../../utils/validators/schemas/zod/FornecedorSchema.js';
import { FornecedorQuerySchema, FornecedorIdSchema } from '../../../utils/validators/schemas/zod/querys/FornecedorQuerySchema.js';
import { CommonResponse } from '../../../utils/helpers/index.js';

jest.mock('../../../services/FornecedorService.js');
jest.mock('../../../utils/validators/schemas/zod/FornecedorSchema.js');
jest.mock('../../../utils/validators/schemas/zod/querys/FornecedorQuerySchema.js');
jest.mock('../../../utils/helpers/index.js', () => ({
    CommonResponse: {
        created: jest.fn(),
        success: jest.fn(),
    }
}));

describe('FornecedorController', () => {
    let controller, req, res, serviceMock;

    beforeEach(() => {
        controller = new FornecedorController();
        req = { body: {}, params: {}, query: {} };
        res = {};
        serviceMock = FornecedorService.mock.instances[0];
        jest.clearAllMocks();
    });

    describe('criar', () => {
        it('deve criar fornecedor com dados válidos', async () => {
            const fornecedor = { nome: 'Fornecedor A', toObject: () => ({ nome: 'Fornecedor A', _id: '1' }) };
            FornecedorSchema.parse.mockReturnValue({ nome: 'Fornecedor A' });
            serviceMock.criar.mockResolvedValue(fornecedor);

            await controller.criar(req, res);

            expect(FornecedorSchema.parse).toHaveBeenCalledWith(req.body);
            expect(serviceMock.criar).toHaveBeenCalledWith({ nome: 'Fornecedor A' });
            expect(CommonResponse.created).toHaveBeenCalledWith(res, { nome: 'Fornecedor A', _id: '1' });
        });

        it('deve retornar erro 400 para dados inválidos', async () => {
            FornecedorSchema.parse.mockImplementation(() => { throw { name: 'ZodError' }; });
            await expect(controller.criar(req, res)).rejects.toEqual(expect.objectContaining({ name: 'ZodError' }));
        });

        it('deve retornar erro 409 para nome já existente', async () => {
            FornecedorSchema.parse.mockReturnValue({ nome: 'Fornecedor A' });
            serviceMock.criar.mockRejectedValue({ status: 409 });
            await expect(controller.criar(req, res)).rejects.toEqual(expect.objectContaining({ status: 409 }));
        });

        it('deve retornar erro 500 para falha inesperada', async () => {
            FornecedorSchema.parse.mockReturnValue({ nome: 'Fornecedor A' });
            serviceMock.criar.mockRejectedValue({ status: 500 });
            await expect(controller.criar(req, res)).rejects.toEqual(expect.objectContaining({ status: 500 }));
        });
    });

    describe('listar', () => {
        it('deve listar fornecedores sem filtros', async () => {
            serviceMock.listar.mockResolvedValue([{ nome: 'Fornecedor A' }]);
            await controller.listar(req, res);
            expect(serviceMock.listar).toHaveBeenCalledWith(req);
            expect(CommonResponse.success).toHaveBeenCalledWith(res, [{ nome: 'Fornecedor A' }]);
        });

        it('deve validar id se presente', async () => {
            req.params = { id: '123' };
            FornecedorIdSchema.parse.mockReturnValue('123');
            serviceMock.listar.mockResolvedValue([{ nome: 'Fornecedor A' }]);
            await controller.listar(req, res);
            expect(FornecedorIdSchema.parse).toHaveBeenCalledWith('123');
        });

        it('deve validar query se presente', async () => {
            req.query = { nome: 'Teste' };
            FornecedorQuerySchema.parseAsync.mockResolvedValue(req.query);
            serviceMock.listar.mockResolvedValue([{ nome: 'Fornecedor A' }]);
            await controller.listar(req, res);
            expect(FornecedorQuerySchema.parseAsync).toHaveBeenCalledWith(req.query);
        });

        it('deve retornar erro 400 para filtro inválido', async () => {
            req.query = { nome: 123 };
            FornecedorQuerySchema.parseAsync.mockRejectedValue({ name: 'ZodError' });
            await expect(controller.listar(req, res)).rejects.toEqual(expect.objectContaining({ name: 'ZodError' }));
        });

        it('deve retornar erro 500 para falha inesperada', async () => {
            serviceMock.listar.mockRejectedValue({ status: 500 });
            await expect(controller.listar(req, res)).rejects.toEqual(expect.objectContaining({ status: 500 }));
        });
    });

    describe('atualizar', () => {
        it('deve atualizar fornecedor com dados válidos', async () => {
            req.params = { id: '1' };
            req.body = { nome: 'Atualizado' };
            FornecedorIdSchema.parse.mockReturnValue('1');
            FornecedorUpdateSchema.parse.mockReturnValue({ nome: 'Atualizado' });
            serviceMock.atualizar.mockResolvedValue({ nome: 'Atualizado' });

            await controller.atualizar(req, res);

            expect(FornecedorIdSchema.parse).toHaveBeenCalledWith('1');
            expect(FornecedorUpdateSchema.parse).toHaveBeenCalledWith(req.body);
            expect(serviceMock.atualizar).toHaveBeenCalledWith('1', { nome: 'Atualizado' });
            expect(CommonResponse.success).toHaveBeenCalledWith(res, { nome: 'Atualizado' }, 200, 'Fornecedor atualizado com sucesso.');
        });

        it('deve retornar erro 400 para dados inválidos', async () => {
            req.params = { id: '1' };
            FornecedorIdSchema.parse.mockReturnValue('1');
            FornecedorUpdateSchema.parse.mockImplementation(() => { throw { name: 'ZodError' }; });
            await expect(controller.atualizar(req, res)).rejects.toEqual(expect.objectContaining({ name: 'ZodError' }));
        });

        it('deve retornar erro 404 para fornecedor inexistente', async () => {
            req.params = { id: '1' };
            FornecedorIdSchema.parse.mockReturnValue('1');
            FornecedorUpdateSchema.parse.mockReturnValue({ nome: 'Atualizado' });
            serviceMock.atualizar.mockRejectedValue({ status: 404 });
            await expect(controller.atualizar(req, res)).rejects.toEqual(expect.objectContaining({ status: 404 }));
        });

        it('deve retornar erro 409 para nome já existente', async () => {
            req.params = { id: '1' };
            FornecedorIdSchema.parse.mockReturnValue('1');
            FornecedorUpdateSchema.parse.mockReturnValue({ nome: 'Duplicado' });
            serviceMock.atualizar.mockRejectedValue({ status: 409 });
            await expect(controller.atualizar(req, res)).rejects.toEqual(expect.objectContaining({ status: 409 }));
        });

        it('deve retornar erro 500 para falha inesperada', async () => {
            req.params = { id: '1' };
            FornecedorIdSchema.parse.mockReturnValue('1');
            FornecedorUpdateSchema.parse.mockReturnValue({ nome: 'Erro' });
            serviceMock.atualizar.mockRejectedValue({ status: 500 });
            await expect(controller.atualizar(req, res)).rejects.toEqual(expect.objectContaining({ status: 500 }));
        });
    });

    describe('deletar', () => {
        it('deve deletar fornecedor existente', async () => {
            req.params = { id: '1' };
            FornecedorIdSchema.parse.mockReturnValue('1');
            serviceMock.deletar.mockResolvedValue({ nome: 'Removido' });

            await controller.deletar(req, res);

            expect(FornecedorIdSchema.parse).toHaveBeenCalledWith('1');
            expect(serviceMock.deletar).toHaveBeenCalledWith('1');
            expect(CommonResponse.success).toHaveBeenCalledWith(res, { nome: 'Removido' }, 200, 'Fornecedor excluído com sucesso.');
        });

        it('deve retornar erro 404 ao tentar deletar fornecedor inexistente', async () => {
            req.params = { id: '1' };
            FornecedorIdSchema.parse.mockReturnValue('1');
            serviceMock.deletar.mockRejectedValue({ status: 404 });
            await expect(controller.deletar(req, res)).rejects.toEqual(expect.objectContaining({ status: 404 }));
        });

        it('deve retornar erro 409 ao tentar deletar fornecedor com vínculo', async () => {
            req.params = { id: '1' };
            FornecedorIdSchema.parse.mockReturnValue('1');
            serviceMock.deletar.mockRejectedValue({ status: 409 });
            await expect(controller.deletar(req, res)).rejects.toEqual(expect.objectContaining({ status: 409 }));
        });

        it('deve retornar erro 500 para falha inesperada', async () => {
            req.params = { id: '1' };
            FornecedorIdSchema.parse.mockReturnValue('1');
            serviceMock.deletar.mockRejectedValue({ status: 500 });
            await expect(controller.deletar(req, res)).rejects.toEqual(expect.objectContaining({ status: 500 }));
        });
    });
});
