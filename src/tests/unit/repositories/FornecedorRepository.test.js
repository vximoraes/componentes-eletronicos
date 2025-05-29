import FornecedorRepository from '../../../repositories/FornecedorRepository.js';
import FornecedorModel from '../../../models/Fornecedor.js';
import MovimentacaoModel from '../../../models/Movimentacao.js';
import { messages, CustomError } from '../../../utils/helpers/index.js';

jest.mock('../../../models/Fornecedor.js');
jest.mock('../../../models/Movimentacao.js');

const mockFornecedor = { 
    save: jest.fn(),
    toObject: jest.fn(),
};

const mockFornecedorDoc = { 
    toObject: jest.fn(),
};

const mockPaginateResult = {
    docs: [mockFornecedorDoc],
};

FornecedorModel.mockImplementation(() => mockFornecedor);
FornecedorModel.paginate = jest.fn();
FornecedorModel.findById = jest.fn();
FornecedorModel.findByIdAndUpdate = jest.fn();
FornecedorModel.findByIdAndDelete = jest.fn();
FornecedorModel.findOne = jest.fn();

MovimentacaoModel.exists = jest.fn();

describe('FornecedorRepository', () => {
    let repository;
    beforeEach(() => {
        jest.clearAllMocks();
        repository = new FornecedorRepository({ fornecedorModel: FornecedorModel });
    });

    describe('criar', () => {
        it('deve criar e salvar um fornecedor', async () => {
            mockFornecedor.save.mockResolvedValue('saved');
            const result = await repository.criar({ nome: 'Fornecedor X' });
            expect(result).toBe('saved');
            expect(mockFornecedor.save).toHaveBeenCalled();
        });
    });

    describe('listar', () => {
        it('deve retornar fornecedor por id', async () => {
            const req = { params: { id: '123' } };
            const data = { toObject: () => ({ nome: 'Fornecedor Y' }) };
            FornecedorModel.findById.mockResolvedValue(data);
            const result = await repository.listar(req);
            expect(result).toEqual({ nome: 'Fornecedor Y' });
        });

        it('deve lançar erro se fornecedor não encontrado por id', async () => {
            const req = { params: { id: 'notfound' } };
            FornecedorModel.findById.mockResolvedValue(null);
            await expect(repository.listar(req)).rejects.toThrow(CustomError);
        });

        it('deve listar fornecedores paginados', async () => {
            const req = { params: {}, query: { page: 1, limite: 10, nome: 'abc' } };
            FornecedorModel.paginate.mockResolvedValue({ docs: [{ toObject: () => ({ nome: 'Fornecedor Z' }) }] });
            const result = await repository.listar(req);
            expect(result.docs[0].nome).toBe('Fornecedor Z');
        });

        it('deve lançar erro se o filterBuilder não tiver método build', async () => {
            jest.resetModules();
            jest.doMock('../../../repositories/filters/FornecedorFilterBuilder.js', () => {
                return jest.fn().mockImplementation(() => ({
                    comNome: jest.fn().mockReturnThis(),
                }));
            });
            const FornecedorRepositoryWithBrokenBuilder = (await import('../../../repositories/FornecedorRepository.js')).default;
            const repositoryWithBrokenBuilder = new FornecedorRepositoryWithBrokenBuilder({ fornecedorModel: FornecedorModel });
            const req = { params: {}, query: { page: 1, limite: 10, nome: 'abc' } };
            
            try {
                await repositoryWithBrokenBuilder.listar(req);
                fail('Deveria ter lançado um erro');
            } catch (error) {
                expect(error.constructor.name).toBe('CustomError');
                expect(error.message).toContain('Erro interno no servidor ao processar Fornecedor');
            }
            
            jest.dontMock('../../../repositories/filters/FornecedorFilterBuilder.js');
        });
    });

    describe('atualizar', () => {
        it('deve atualizar fornecedor existente', async () => {
            FornecedorModel.findByIdAndUpdate.mockReturnValue({
                lean: jest.fn().mockResolvedValue({ nome: 'Atualizado' })
            });
            const result = await repository.atualizar('id', { nome: 'Atualizado' });
            expect(result.nome).toBe('Atualizado');
        });
        it('deve lançar erro se fornecedor não encontrado', async () => {
            FornecedorModel.findByIdAndUpdate.mockReturnValue({
                lean: jest.fn().mockResolvedValue(null)
            });
            await expect(repository.atualizar('id', {})).rejects.toThrow(CustomError);
        });
    });

    describe('deletar', () => {
        it('deve deletar fornecedor se não houver movimentação', async () => {
            MovimentacaoModel.exists.mockResolvedValue(false);
            FornecedorModel.findByIdAndDelete.mockResolvedValue({ nome: 'Deletado' });
            const result = await repository.deletar('id');
            expect(result.nome).toBe('Deletado');
        });
        it('deve lançar erro se houver movimentação vinculada', async () => {
            MovimentacaoModel.exists.mockResolvedValue(true);
            await expect(repository.deletar('id')).rejects.toThrow(CustomError);
        });
    });

    describe('buscarPorNome', () => {
        it('deve buscar fornecedor por nome', async () => {
            FornecedorModel.findOne.mockResolvedValue({ nome: 'Fornecedor A' });
            const result = await repository.buscarPorNome('Fornecedor A');
            expect(result.nome).toBe('Fornecedor A');
        });
        it('deve buscar fornecedor por nome ignorando id', async () => {
            FornecedorModel.findOne.mockResolvedValue({ nome: 'Fornecedor B' });
            const result = await repository.buscarPorNome('Fornecedor B', 'idIgnorado');
            expect(result.nome).toBe('Fornecedor B');
        });
    });

    describe('buscarPorId', () => {
        it('deve retornar fornecedor por id', async () => {
            FornecedorModel.findById.mockResolvedValue({ nome: 'Fornecedor C' });
            const result = await repository.buscarPorId('id');
            expect(result.nome).toBe('Fornecedor C');
        });
        it('deve lançar erro se fornecedor não encontrado', async () => {
            FornecedorModel.findById.mockResolvedValue(null);
            await expect(repository.buscarPorId('id')).rejects.toThrow(CustomError);
        });
    });
});