jest.mock('../../../models/Movimentacao.js');

import MovimentacaoRepository from '../../../repositories/MovimentacaoRepository.js';
import { CustomError } from '../../../utils/helpers/index.js';
import MovimentacaoModel from '../../../models/Movimentacao.js';

class FakeFilterBuilder {
    constructor() {
        this.comTipo = jest.fn(() => this);
        this.comData = jest.fn(() => this);
        this.comQuantidade = jest.fn(() => this);
        this.comComponente = jest.fn(() => this);
        this.comFornecedor = jest.fn(() => this);
        this.build = jest.fn(() => ({ filtro: true }));
    }
}

describe('MovimentacaoRepository', () => {
    let repository;
    beforeEach(() => {
        jest.clearAllMocks();
        repository = new MovimentacaoRepository({ movimentacaoModel: MovimentacaoModel });
    });

    describe('criar', () => {
        it('deve criar movimentação e retornar populada', async () => {
            const mockSave = jest.fn().mockResolvedValue({ _id: '1' });
            MovimentacaoModel.mockImplementation(() => ({ save: mockSave }));
            const populatedResult = {
                _id: '1',
                componente: { _id: 'c1', nome: 'Componente 1' },
                fornecedor: { _id: 'f1', nome: 'Fornecedor 1' }
            };
            const mockPopulateFornecedor = jest.fn().mockResolvedValue(populatedResult);
            const mockPopulateComponente = jest.fn().mockReturnValue({ populate: mockPopulateFornecedor });
            MovimentacaoModel.findById = jest.fn().mockReturnValue({ populate: mockPopulateComponente });
            const result = await repository.criar({ componente: 'c1', fornecedor: 'f1' });
            expect(mockSave).toHaveBeenCalled();
            expect(MovimentacaoModel.findById).toHaveBeenCalledWith('1');
            expect(result).toEqual(populatedResult);
        });
    });

    describe('listar', () => {
        it('deve retornar movimentação por id', async () => {
            const fakeData = {
                _id: '1',
                componente: { _id: 'c1', nome: 'Componente 1' },
                fornecedor: { _id: 'f1', nome: 'Fornecedor 1' },
                toObject: () => ({
                    _id: '1',
                    componente: { _id: 'c1', nome: 'Componente 1' },
                    fornecedor: { _id: 'f1', nome: 'Fornecedor 1' }
                })
            };
            const mockPopulateFornecedor = jest.fn().mockResolvedValue(fakeData);
            const mockPopulateComponente = jest.fn().mockReturnValue({ populate: mockPopulateFornecedor });
            MovimentacaoModel.findById = jest.fn().mockReturnValue({ populate: mockPopulateComponente });
            const req = { params: { id: '1' } };
            const result = await repository.listar(req);
            expect(MovimentacaoModel.findById).toHaveBeenCalledWith('1');
            expect(result).toHaveProperty('_id', '1');
        });
        it('deve lançar erro 404 se movimentação não encontrada por id', async () => {
            const mockPopulateFornecedor = jest.fn().mockResolvedValue(null);
            const mockPopulateComponente = jest.fn().mockReturnValue({ populate: mockPopulateFornecedor });
            MovimentacaoModel.findById = jest.fn().mockReturnValue({ populate: mockPopulateComponente });
            const req = { params: { id: 'notfound' } };
            await expect(repository.listar(req)).rejects.toThrow(CustomError);
        });
        it('deve aplicar filtros de busca e retornar resultado paginado', async () => {
            jest.resetModules();
            jest.doMock('../../../repositories/filters/MovimentacaoFilterBuilder.js', () => {
                return {
                    __esModule: true,
                    default: jest.fn(() => new FakeFilterBuilder())
                }
            });
            const { default: MovimentacaoRepositoryWithMocks } = await import('../../../repositories/MovimentacaoRepository.js');
            const paginateResult = {
                docs: [
                    {
                        _id: '1',
                        tipo: 'entrada',
                        quantidade: 10,
                        componente: { _id: 'c1', nome: 'Componente 1' },
                        fornecedor: { _id: 'f1', nome: 'Fornecedor 1' },
                        toObject: () => ({
                            _id: '1',
                            tipo: 'entrada',
                            quantidade: 10,
                            componente: { _id: 'c1', nome: 'Componente 1' },
                            fornecedor: { _id: 'f1', nome: 'Fornecedor 1' }
                        })
                    }
                ],
                total: 1,
                limit: 10,
                page: 1,
                pages: 1
            };
            const MovimentacaoModelMocked = (await import('../../../models/Movimentacao.js')).default;
            MovimentacaoModelMocked.paginate = jest.fn().mockResolvedValue(paginateResult);
            const repo = new MovimentacaoRepositoryWithMocks({ movimentacaoModel: MovimentacaoModelMocked });
            const req = {
                query: { tipo: 'entrada', page: 1, limite: 10 },
                params: {}
            };
            const result = await repo.listar(req);
            expect(result.docs.length).toBe(1);
            expect(MovimentacaoModelMocked.paginate).toHaveBeenCalled();
        });
        it('deve lançar erro 500 se filterBuilder.build não for função', async () => {
            jest.resetModules();
            jest.doMock('../../../repositories/filters/MovimentacaoFilterBuilder.js', () => {
                return {
                    __esModule: true,
                    default: jest.fn(() => ({
                        comTipo: jest.fn().mockReturnThis(),
                        comData: jest.fn().mockReturnThis(),
                        comQuantidade: jest.fn().mockReturnThis(),
                        comComponente: jest.fn().mockResolvedValue(undefined),
                        comFornecedor: jest.fn().mockResolvedValue(undefined),
                        build: undefined
                    }))
                }
            });
            const { default: MovimentacaoRepositoryWithMocks } = await import('../../../repositories/MovimentacaoRepository.js');
            const repo = new MovimentacaoRepositoryWithMocks({ movimentacaoModel: MovimentacaoModel });
            const req = { query: {}, params: {} };
            try {
                await repo.listar(req);
                fail('Should have thrown an error');
            } catch (error) {
                expect(error.statusCode).toBe(500);
                expect(error.errorType).toBe('internalServerError');
            }
        });
    });

    describe('buscarPorId', () => {
        it('deve retornar movimentação por id', async () => {
            const fakeMovimentacao = {
                _id: '1',
                tipo: 'entrada',
                quantidade: 10
            };
            MovimentacaoModel.findById = jest.fn().mockResolvedValue(fakeMovimentacao);
            const result = await repository.buscarPorId('1');
            expect(MovimentacaoModel.findById).toHaveBeenCalledWith('1');
            expect(result).toEqual(fakeMovimentacao);
        });
        it('deve lançar erro 404 se movimentação não encontrada', async () => {
            MovimentacaoModel.findById = jest.fn().mockResolvedValue(null);
            await expect(repository.buscarPorId('notfound')).rejects.toThrow(CustomError);
        });
        it('deve lançar erro se o banco lançar exceção em criar', async () => {
            const dbError = new Error('DB error');
            MovimentacaoModel.mockImplementation(() => { throw dbError; });
            await expect(repository.criar({})).rejects.toThrow('DB error');
        });
        it('deve lançar erro se o banco lançar exceção em listar', async () => {
            const dbError = new Error('DB error');
            MovimentacaoModel.findById = jest.fn(() => { throw dbError; });
            const req = { params: { id: '1' } };
            await expect(repository.listar(req)).rejects.toThrow('DB error');
        });
        it('deve lançar erro se o banco lançar exceção em buscarPorId', async () => {
            const dbError = new Error('DB error');
            MovimentacaoModel.findById = jest.fn(() => { throw dbError; });
            await expect(repository.buscarPorId('1')).rejects.toThrow('DB error');
        });
    });
});