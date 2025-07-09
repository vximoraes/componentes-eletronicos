import OrcamentoController from '../../../controllers/OrcamentoController.js';
import { CommonResponse } from '../../../utils/helpers/index.js';
import { v4 as uuid } from 'uuid';

jest.mock('../../../services/OrcamentoService.js', () => {
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

describe('OrcamentoController', () => {
    let controller, service, res;

    beforeEach(() => {
        controller = new OrcamentoController();
        service = controller.service;
        res = mockRes();
        jest.clearAllMocks();
    });

    describe('criar', () => {
        it('deve criar orçamento válido e retornar 201', async () => {
            const req = {
                body: {
                    nome: 'Orçamento Teste',
                    componente_orcamento: [
                        { nome: 'Resistor', fornecedor: 'Fornecedor Teste', quantidade: '2', valor_unitario: '1.5' },
                        { nome: 'Capacitor', fornecedor: 'Fornecedor Teste', quantidade: '1', valor_unitario: '2' }
                    ]
                }
            };
            const fakeOrcamento = {
                toObject: () => ({ _id: '507f1f77bcf86cd799439011', protocolo: uuid(), valor: 5, ...req.body })
            };
            service.criar.mockResolvedValue(fakeOrcamento);
            await controller.criar(req, res);
            expect(service.criar).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ nome: 'Orçamento Teste' }) }));
        });

        it('deve retornar erro 400 para dados inválidos', async () => {
            const req = { body: { nome: '', componente_orcamento: [] } };
            await expect(controller.criar(req, res)).rejects.toThrow();
        });

        it('deve retornar erro 400 para protocolo duplicado', async () => {
            const req = {
                body: {
                    nome: 'Orçamento Teste',
                    componente_orcamento: [{ nome: 'Resistor', quantidade: '1', valor_unitario: '1' }]
                }
            };
            service.criar.mockRejectedValue({ code: 11000 });
            await expect(controller.criar(req, res)).rejects.toBeDefined();
        });
    });

    describe('listar', () => {
        it('deve retornar todos os orçamentos', async () => {
            const req = { params: {}, query: {} };
            service.listar.mockResolvedValue([{ nome: 'Orçamento 1' }]);
            await controller.listar(req, res);
            expect(service.listar).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: expect.any(Array) }));
        });
    });

    describe('atualizar', () => {
        it('deve atualizar orçamento existente', async () => {
            const req = { params: { id: '507f1f77bcf86cd799439011' }, body: { nome: 'Novo Nome' } };
            service.atualizar.mockResolvedValue({ _id: '507f1f77bcf86cd799439011', nome: 'Novo Nome' });
            await controller.atualizar(req, res);
            expect(service.atualizar).toHaveBeenCalledWith('507f1f77bcf86cd799439011', { nome: 'Novo Nome' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('sucesso') }));
        });
        it('deve retornar erro 404 para orçamento inexistente', async () => {
            const req = { params: { id: '507f1f77bcf86cd799439011' }, body: { nome: 'Novo Nome' } };
            service.atualizar.mockRejectedValue({ status: 404 });
            await expect(controller.atualizar(req, res)).rejects.toBeDefined();
        });
    });

    describe('deletar', () => {
        it('deve deletar orçamento existente', async () => {
            const req = { params: { id: '507f1f77bcf86cd799439011' } };
            service.deletar.mockResolvedValue({ _id: '507f1f77bcf86cd799439011' });
            await controller.deletar(req, res);
            expect(service.deletar).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('excluído') }));
        });
        it('deve retornar erro 404 para orçamento inexistente', async () => {
            const req = { params: { id: '507f1f77bcf86cd799439011' } };
            service.deletar.mockRejectedValue({ status: 404 });
            await expect(controller.deletar(req, res)).rejects.toBeDefined();
        });
    });

    describe('adicionarComponente', () => {
        it('deve adicionar componente válido', async () => {
            const req = { params: { orcamentoId: '507f1f77bcf86cd799439011' }, body: { nome: 'Resistor', fornecedor: 'Fornecedor Teste', quantidade: '2', valor_unitario: '1.5' } };
            service.adicionarComponente.mockResolvedValue({ _id: '507f1f77bcf86cd799439011', componente_orcamento: [{ nome: 'Resistor' }] });
            await controller.adicionarComponente(req, res);
            expect(service.adicionarComponente).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('adicionado') }));
        });
        it('deve retornar erro 400 para dados inválidos', async () => {
            const req = { params: { orcamentoId: '507f1f77bcf86cd799439011' }, body: { nome: '', quantidade: '0', fornecedor: '' } };
            await expect(controller.adicionarComponente(req, res)).rejects.toThrow();
        });
    });

    describe('atualizarComponente', () => {
        it('deve atualizar componente existente', async () => {
            const req = { params: { orcamentoId: '507f1f77bcf86cd799439011', id: '507f1f77bcf86cd799439012' }, body: { quantidade: '5' } };
            service.getComponenteById.mockResolvedValue({ _id: '507f1f77bcf86cd799439012', nome: 'Resistor', quantidade: '2', valor_unitario: '1.5' });
            service.atualizarComponente.mockResolvedValue({ _id: '507f1f77bcf86cd799439011', componente_orcamento: [{ _id: '507f1f77bcf86cd799439012', quantidade: '5' }] });
            await controller.atualizarComponente(req, res);
            expect(service.atualizarComponente).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('atualizado') }));
        });
        it('deve retornar erro 404 para componente inexistente', async () => {
            const req = { params: { orcamentoId: '507f1f77bcf86cd799439011', id: '507f1f77bcf86cd799439012' }, body: { quantidade: '5' } };
            service.getComponenteById.mockResolvedValue(null);
            await controller.atualizarComponente(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: 404, error: true, message: expect.any(String) }));
            expect(res.json.mock.calls[0][0].errors[0].message).toMatch(/componente/i);
        });
        it('deve retornar erro 400 se nenhum campo enviado', async () => {
            const req = { params: { orcamentoId: '507f1f77bcf86cd799439011', id: '507f1f77bcf86cd799439012' }, body: {} };
            await controller.atualizarComponente(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: 400, error: true, message: expect.any(String) }));
            expect(res.json.mock.calls[0][0].errors[0].message).toMatch(/nenhum campo/i);
        });
    });

    describe('removerComponente', () => {
        it('deve remover componente existente', async () => {
            const req = { params: { orcamentoId: '507f1f77bcf86cd799439011', id: 'cid' } };
            service.removerComponente.mockResolvedValue({ _id: '507f1f77bcf86cd799439011', componente_orcamento: [] });
            await controller.removerComponente(req, res);
            expect(service.removerComponente).toHaveBeenCalledWith('507f1f77bcf86cd799439011', 'cid');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('removido') }));
        });
        it('deve retornar erro 404 para componente inexistente', async () => {
            const req = { params: { orcamentoId: '507f1f77bcf86cd799439011', id: 'cid' } };
            service.removerComponente.mockRejectedValue({ status: 404 });
            await expect(controller.removerComponente(req, res)).rejects.toBeDefined();
        });
    });

    describe('falha inesperada', () => {
        it('deve retornar erro 500 para falha inesperada', async () => {
            const req = { params: {}, body: {} };
            service.listar.mockRejectedValue(new Error('Erro inesperado'));
            await expect(controller.listar(req, res)).rejects.toThrow('Erro inesperado');
        });
    });
});
