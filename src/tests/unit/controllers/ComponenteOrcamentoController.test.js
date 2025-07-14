import ComponenteOrcamentoController from '../../../controllers/ComponenteOrcamentoController.js';
import { CommonResponse } from '../../../utils/helpers/index.js';

jest.mock('../../../services/ComponenteOrcamentoService.js', () => {
    return jest.fn().mockImplementation(() => ({
        criar: jest.fn(),
        listar: jest.fn(),
        atualizar: jest.fn(),
        deletar: jest.fn(),
        adicionarComponente: jest.fn(),
        atualizarComponente: jest.fn(),
        removerComponente: jest.fn(),
        getComponenteById: jest.fn(),
    }));
});

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('ComponenteOrcamentoController', () => {
    let controller, service, res;

    beforeEach(() => {
        controller = new ComponenteOrcamentoController();
        service = controller.service;
        res = mockRes();
        jest.clearAllMocks();
    });

    describe('criar', () => {
        it('deve criar componente do orçamento com sucesso', async () => {
            const req = { body: { nome: 'Resistor', quantidade: 2, valor_unitario: 1.5 } };
            const fakeResponse = { _id: '1', nome: 'Resistor', quantidade: 2, valor_unitario: 1.5 };
            service.criar.mockResolvedValue(fakeResponse);

            await controller.criar(req, res);

            expect(service.criar).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: fakeResponse }));
        });

        it('deve lançar erro ao falhar na criação', async () => {
            const req = { body: {} };
            service.criar.mockRejectedValue(new Error('Falha ao criar'));
            await expect(controller.criar(req, res)).rejects.toThrow('Falha ao criar');
        });
    });

    describe('listar', () => {
        it('deve listar componentes do orçamento', async () => {
            const req = { query: {} };
            const listaMock = [{ nome: 'Resistor' }];
            service.listar.mockResolvedValue(listaMock);

            await controller.listar(req, res);

            expect(service.listar).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: listaMock }));
        });

        it('deve retornar erro ao falhar na listagem', async () => {
            const req = {};
            service.listar.mockRejectedValue(new Error('Erro ao listar'));
            await expect(controller.listar(req, res)).rejects.toThrow('Erro ao listar');
        });
    });

    describe('atualizar', () => {
        it('deve atualizar componente do orçamento', async () => {
            const req = { params: { id: '1' }, body: { quantidade: 10 } };
            const atualizado = { _id: '1', nome: 'Resistor', quantidade: 10 };
            service.atualizar.mockResolvedValue(atualizado);

            await controller.atualizar(req, res);

            expect(service.atualizar).toHaveBeenCalledWith('1', req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: atualizado }));
        });

        it('deve retornar erro 404 se não encontrar componente', async () => {
            const req = { params: { id: '1' }, body: {} };
            service.atualizar.mockRejectedValue({ status: 404 });

            await expect(controller.atualizar(req, res)).rejects.toEqual(expect.objectContaining({ status: 404 }));
        });
    });

    describe('deletar', () => {
        it('deve deletar componente do orçamento', async () => {
            const req = { params: { id: '1' } };
            const result = { _id: '1' };
            service.deletar.mockResolvedValue(result);

            await controller.deletar(req, res);

            expect(service.deletar).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
        });

        it('deve retornar erro se componente não for encontrado', async () => {
            const req = { params: { id: '1' } };
            service.deletar.mockRejectedValue({ status: 404 });

            await expect(controller.deletar(req, res)).rejects.toEqual(expect.objectContaining({ status: 404 }));
        });
    });

    describe('falha inesperada', () => {
        it('deve retornar erro 500 inesperado', async () => {
            const req = { body: {} };
            service.criar.mockRejectedValue(new Error('Erro inesperado'));
            await expect(controller.criar(req, res)).rejects.toThrow('Erro inesperado');
        });
    });
});
