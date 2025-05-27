import ComponenteController from '../../../controllers/ComponenteController.js';
import ComponenteService from '../../../services/ComponenteService.js';
import { ComponenteSchema, ComponenteUpdateSchema } from '../../../utils/validators/schemas/zod/ComponenteSchema.js';
import { ComponenteQuerySchema, ComponenteIdSchema } from '../../../utils/validators/schemas/zod/querys/ComponenteQuerySchema.js';
import { CommonResponse } from '../../../utils/helpers/index.js';

jest.mock('../../../services/ComponenteService.js');
jest.mock('../../../utils/validators/schemas/zod/ComponenteSchema.js');
jest.mock('../../../utils/validators/schemas/zod/querys/ComponenteQuerySchema.js');
jest.mock('../../../utils/helpers/index.js', () => ({
    CommonResponse: {
        created: jest.fn(),
        success: jest.fn(),
    }
}));

describe('ComponenteController', () => {
    let controller, req, res, serviceMock;

    beforeEach(() => {
        controller = new ComponenteController();
        req = { body: {}, params: {}, query: {} };
        res = {};
        serviceMock = ComponenteService.mock.instances[0];
        jest.clearAllMocks();
    });

    describe('criar', () => {
        it('deve criar componente com dados válidos', async () => {
            const componente = { nome: 'Resistor', toObject: () => ({ nome: 'Resistor', _id: '1', ativo: false }) };
            ComponenteSchema.parse.mockReturnValue({ nome: 'Resistor' });
            serviceMock.criar.mockResolvedValue(componente);

            await controller.criar(req, res);

            expect(ComponenteSchema.parse).toHaveBeenCalledWith(req.body);
            expect(serviceMock.criar).toHaveBeenCalledWith({ nome: 'Resistor' });
            expect(CommonResponse.created).toHaveBeenCalledWith(res, { nome: 'Resistor', _id: '1', ativo: false });
        });

        it('deve retornar erro 400 para dados inválidos', async () => {
            ComponenteSchema.parse.mockImplementation(() => { throw { name: 'ZodError' }; });
            await expect(controller.criar(req, res)).rejects.toEqual(expect.objectContaining({ name: 'ZodError' }));
        });
    });

    describe('listar', () => {
        it('deve listar componentes sem filtros', async () => {
            serviceMock.listar.mockResolvedValue([{ nome: 'Resistor' }]);
            await controller.listar(req, res);
            expect(serviceMock.listar).toHaveBeenCalledWith(req);
            expect(CommonResponse.success).toHaveBeenCalledWith(res, [{ nome: 'Resistor' }]);
        });

        it('deve validar id se presente', async () => {
            req.params = { id: '123' };
            ComponenteIdSchema.parse.mockReturnValue('123');
            serviceMock.listar.mockResolvedValue([{ nome: 'Resistor' }]);
            await controller.listar(req, res);
            expect(ComponenteIdSchema.parse).toHaveBeenCalledWith('123');
        });

        it('deve validar query se presente', async () => {
            req.query = { nome: 'Teste' };
            ComponenteQuerySchema.parseAsync.mockResolvedValue(req.query);
            serviceMock.listar.mockResolvedValue([{ nome: 'Resistor' }]);
            await controller.listar(req, res);
            expect(ComponenteQuerySchema.parseAsync).toHaveBeenCalledWith(req.query);
        });

        it('deve retornar erro 400 para filtro inválido', async () => {
            req.query = { nome: 123 };
            ComponenteQuerySchema.parseAsync.mockRejectedValue({ name: 'ZodError' });
            await expect(controller.listar(req, res)).rejects.toEqual(expect.objectContaining({ name: 'ZodError' }));
        });
    });

    describe('atualizar', () => {
        it('deve atualizar componente com dados válidos', async () => {
            req.params = { id: '1' };
            req.body = { nome: 'Atualizado' };
            ComponenteIdSchema.parse.mockReturnValue('1');
            ComponenteUpdateSchema.parse.mockReturnValue({ nome: 'Atualizado' });
            serviceMock.atualizar.mockResolvedValue({ nome: 'Atualizado' });

            await controller.atualizar(req, res);

            expect(ComponenteIdSchema.parse).toHaveBeenCalledWith('1');
            expect(ComponenteUpdateSchema.parse).toHaveBeenCalledWith(req.body);
            expect(serviceMock.atualizar).toHaveBeenCalledWith('1', { nome: 'Atualizado' });
            expect(CommonResponse.success).toHaveBeenCalledWith(
                res,
                { nome: 'Atualizado' },
                200,
                'Componente atualizado com sucesso. Porém, a quantidade só pode ser alterada por movimentação.'
            );
        });

        it('deve retornar erro 400 para dados inválidos', async () => {
            req.params = { id: '1' };
            ComponenteIdSchema.parse.mockReturnValue('1');
            ComponenteUpdateSchema.parse.mockImplementation(() => { throw { name: 'ZodError' }; });
            await expect(controller.atualizar(req, res)).rejects.toEqual(expect.objectContaining({ name: 'ZodError' }));
        });

        it('deve retornar erro 404 para componente inexistente', async () => {
            req.params = { id: '1' };
            ComponenteIdSchema.parse.mockReturnValue('1');
            ComponenteUpdateSchema.parse.mockReturnValue({ nome: 'Atualizado' });
            serviceMock.atualizar.mockRejectedValue({ status: 404 });
            await expect(controller.atualizar(req, res)).rejects.toEqual(expect.objectContaining({ status: 404 }));
        });
    });

    describe('deletar', () => {
        it('deve deletar componente existente', async () => {
            req.params = { id: '1' };
            ComponenteIdSchema.parse.mockReturnValue('1');
            serviceMock.deletar.mockResolvedValue({ nome: 'Removido' });

            await controller.deletar(req, res);

            expect(ComponenteIdSchema.parse).toHaveBeenCalledWith('1');
            expect(serviceMock.deletar).toHaveBeenCalledWith('1');
            expect(CommonResponse.success).toHaveBeenCalledWith(res, { nome: 'Removido' }, 200, 'Componente excluído com sucesso.');
        });

        it('deve retornar erro 404 ao tentar deletar componente inexistente', async () => {
            req.params = { id: '1' };
            ComponenteIdSchema.parse.mockReturnValue('1');
            serviceMock.deletar.mockRejectedValue({ status: 404 });
            await expect(controller.deletar(req, res)).rejects.toEqual(expect.objectContaining({ status: 404 }));
        });
    });

    describe('erros inesperados', () => {
        it('deve retornar erro 500 para falha inesperada em criar', async () => {
            ComponenteSchema.parse.mockReturnValue({ nome: 'Erro' });
            serviceMock.criar.mockRejectedValue({ status: 500 });
            await expect(controller.criar(req, res)).rejects.toEqual(expect.objectContaining({ status: 500 }));
        });

        it('deve retornar erro 500 para falha inesperada em listar', async () => {
            serviceMock.listar.mockRejectedValue({ status: 500 });
            await expect(controller.listar(req, res)).rejects.toEqual(expect.objectContaining({ status: 500 }));
        });

        it('deve retornar erro 500 para falha inesperada em atualizar', async () => {
            req.params = { id: '1' };
            ComponenteIdSchema.parse.mockReturnValue('1');
            ComponenteUpdateSchema.parse.mockReturnValue({ nome: 'Erro' });
            serviceMock.atualizar.mockRejectedValue({ status: 500 });
            await expect(controller.atualizar(req, res)).rejects.toEqual(expect.objectContaining({ status: 500 }));
        });

        it('deve retornar erro 500 para falha inesperada em deletar', async () => {
            req.params = { id: '1' };
            ComponenteIdSchema.parse.mockReturnValue('1');
            serviceMock.deletar.mockRejectedValue({ status: 500 });
            await expect(controller.deletar(req, res)).rejects.toEqual(expect.objectContaining({ status: 500 }));
        });
    });
});