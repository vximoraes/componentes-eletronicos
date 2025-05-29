import ComponenteRepository from '../../../repositories/ComponenteRepository.js';
import ComponenteModel from '../../../models/Componente.js';
import MovimentacaoModel from '../../../models/Movimentacao.js';
import ComponenteFilterBuilder from '../../../repositories/filters/ComponenteFilterBuilder.js';
import { CustomError, messages } from '../../../utils/helpers/index.js';

jest.mock('../../../models/Componente.js');
jest.mock('../../../models/Movimentacao.js');
jest.mock('../../../repositories/filters/ComponenteFilterBuilder.js');

const mockPopulate = jest.fn().mockReturnThis();
const mockLean = jest.fn().mockReturnThis();
const mockToObject = jest.fn();

const mockFindById = jest.fn();
const mockFindByIdAndUpdate = jest.fn();
const mockFindByIdAndDelete = jest.fn();
const mockFindOne = jest.fn();
const mockPaginate = jest.fn();
const mockSave = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();
    ComponenteModel.mockImplementation(() => ({
        save: mockSave,
    }));
    ComponenteModel.findById = mockFindById;
    ComponenteModel.findByIdAndUpdate = mockFindByIdAndUpdate;
    ComponenteModel.findByIdAndDelete = mockFindByIdAndDelete;
    ComponenteModel.findOne = mockFindOne;
    ComponenteModel.paginate = mockPaginate;
});

describe('ComponenteRepository', () => {
    let repository;
    beforeEach(() => {
        repository = new ComponenteRepository({ componenteModel: ComponenteModel });
    });

    describe('criar', () => {
        it('deve criar e retornar componente populado', async () => {
            const dados = { nome: 'C1' };
            const componenteSalvo = { _id: 'id1', save: mockSave };
            mockSave.mockResolvedValueOnce(componenteSalvo);
            mockFindById.mockReturnValueOnce({
                populate: () => ({ populate: () => ({ nome: 'C1', _id: 'id1' }) })
            });
            const result = await repository.criar(dados);
            expect(result).toEqual({ nome: 'C1', _id: 'id1' });
        });
    });

    describe('listar', () => {
        it('deve retornar componente por id', async () => {
            const req = { params: { id: 'id1' }, query: {} };
            mockFindById.mockReturnValueOnce({
                populate: () => ({ populate: () => ({ toObject: () => ({ nome: 'C1', _id: 'id1' }) }) })
            });
            const result = await repository.listar(req);
            expect(result).toEqual({ nome: 'C1', _id: 'id1' });
        });

        it('deve lançar erro 404 se componente não encontrado por id', async () => {
            const req = { params: { id: 'id1' }, query: {} };
            mockFindById.mockReturnValueOnce({ populate: () => ({ populate: () => null }) });
            await expect(repository.listar(req)).rejects.toThrow(CustomError);
        });

        it('deve listar componentes com filtros', async () => {
            const req = { params: {}, query: { nome: 'C1', page: 1, limite: 10 } };
            const mockBuild = jest.fn(() => ({}));
            ComponenteFilterBuilder.mockImplementation(() => ({
                comNome: () => ({ comQuantidade: () => ({ comEstoqueMinimo: () => ({ comAtivo: () => ({ build: mockBuild, comLocalizacao: async () => ({}), comCategoria: async () => ({}) }) }) }) }),
                build: mockBuild,
                comLocalizacao: async () => ({}),
                comCategoria: async () => ({})
            }));
            mockPaginate.mockResolvedValueOnce({ docs: [{ toObject: () => ({ nome: 'C1' }) }], total: 1 });
            const result = await repository.listar(req);
            expect(result.docs[0]).toEqual({ nome: 'C1' });
        });
    });

    describe('atualizar', () => {
        it('deve atualizar e retornar componente', async () => {
            mockFindByIdAndUpdate.mockReturnValueOnce({ populate: () => ({ populate: () => ({ lean: () => ({ nome: 'C1', _id: 'id1' }) }) }) });
            const result = await repository.atualizar('id1', { nome: 'Novo' });
            expect(result).toEqual({ nome: 'C1', _id: 'id1' });
        });
        it('deve lançar erro 404 se componente não encontrado', async () => {
            mockFindByIdAndUpdate.mockReturnValueOnce({ populate: () => ({ populate: () => ({ lean: () => null }) }) });
            await expect(repository.atualizar('id1', { nome: 'Novo' })).rejects.toThrow(CustomError);
        });
    });

    describe('deletar', () => {
        it('deve deletar componente se não houver movimentação', async () => {
            MovimentacaoModel.exists.mockResolvedValueOnce(false);
            mockFindById.mockReturnValueOnce({ populate: () => ({ populate: () => ({ nome: 'C1', _id: 'id1' }) }) });
            mockFindByIdAndDelete.mockResolvedValueOnce(true);
            const result = await repository.deletar('id1');
            expect(result).toEqual({ nome: 'C1', _id: 'id1' });
        });
        it('deve lançar erro se houver movimentação vinculada', async () => {
            MovimentacaoModel.exists.mockResolvedValueOnce(true);
            await expect(repository.deletar('id1')).rejects.toThrow(CustomError);
        });
        it('deve lançar erro 404 se componente não encontrado ao deletar', async () => {
            MovimentacaoModel.exists.mockResolvedValueOnce(false);
            mockFindById.mockReturnValueOnce({ populate: () => ({ populate: () => null }) });
            await expect(repository.deletar('id1')).rejects.toThrow(CustomError);
        });
    });

    describe('buscarPorId', () => {
        it('deve retornar componente por id', async () => {
            mockFindById.mockReturnValueOnce({ nome: 'C1', _id: 'id1' });
            const result = await repository.buscarPorId('id1');
            expect(result).toEqual({ nome: 'C1', _id: 'id1' });
        });
        it('deve lançar erro 404 se não encontrar componente', async () => {
            mockFindById.mockReturnValueOnce(null);
            await expect(repository.buscarPorId('id1')).rejects.toThrow(CustomError);
        });
    });

    describe('buscarPorNome', () => {
        it('deve retornar componente por nome', async () => {
            mockFindOne.mockReturnValueOnce({ populate: () => ({ populate: () => ({ nome: 'C1', _id: 'id1' }) }) });
            const result = await repository.buscarPorNome('C1');
            expect(result).toEqual({ nome: 'C1', _id: 'id1' });
        });
        it('deve retornar null se não encontrar componente', async () => {
            mockFindOne.mockReturnValueOnce({ populate: () => ({ populate: () => null }) });
            const result = await repository.buscarPorNome('C1');
            expect(result).toBeNull();
        });
    });

    describe('erros inesperados', () => {
        it('deve lançar erro 500 se build não for função', async () => {
            const req = { params: {}, query: {} };
            ComponenteFilterBuilder.mockImplementation(() => ({
                comNome: () => ({ 
                    comQuantidade: () => ({ 
                        comEstoqueMinimo: () => ({ 
                            comAtivo: () => ({
                                build: undefined,
                                comLocalizacao: async () => ({}),
                                comCategoria: async () => ({})
                            }) 
                        }) 
                    })
                }),
            }));
            await expect(repository.listar(req)).rejects.toThrow(CustomError);
        });
    });
});