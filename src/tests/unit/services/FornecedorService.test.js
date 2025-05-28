import FornecedorService from '../../../services/FornecedorService.js';
import FornecedorRepository from '../../../repositories/FornecedorRepository.js';
import { CustomError } from '../../../utils/helpers/index.js';

jest.mock('../../../repositories/FornecedorRepository.js');

const makeFornecedor = (props = {}) => ({ _id: 'forn1', nome: 'Fornecedor X', ...props });

describe('FornecedorService', () => {
    let service, repositoryMock;
    beforeEach(() => {
        FornecedorRepository.mockClear();
        repositoryMock = {
            criar: jest.fn(),
            listar: jest.fn(),
            atualizar: jest.fn(),
            deletar: jest.fn(),
            buscarPorNome: jest.fn(),
            buscarPorId: jest.fn()
        };
        FornecedorRepository.mockImplementation(() => repositoryMock);
        service = new FornecedorService();
        jest.clearAllMocks();
    });

    describe('criar', () => {
        it('deve cadastrar fornecedor com nome único', async () => {
            repositoryMock.buscarPorNome.mockResolvedValue(null);
            repositoryMock.criar.mockResolvedValue(makeFornecedor());
            const result = await service.criar({ nome: 'Fornecedor X' });
            expect(result).toHaveProperty('_id');
            expect(repositoryMock.criar).toHaveBeenCalledWith({ nome: 'Fornecedor X' });
        });
        it('deve lançar erro se nome já existir', async () => {
            repositoryMock.buscarPorNome.mockResolvedValue(makeFornecedor());
            await expect(service.criar({ nome: 'Fornecedor X' }))
                .rejects.toThrow(CustomError);
        });
    });

    describe('listar', () => {
        it('deve retornar todos os fornecedores', async () => {
            const fornecs = [makeFornecedor(), makeFornecedor({ _id: 'forn2', nome: 'Fornecedor Y' })];
            repositoryMock.listar.mockResolvedValue(fornecs);
            const result = await service.listar({});
            expect(result).toEqual(fornecs);
        });
        it('deve lançar erro inesperado do repository', async () => {
            repositoryMock.listar.mockRejectedValue(new Error('DB error'));
            await expect(service.listar({})).rejects.toThrow('DB error');
        });
    });

    describe('atualizar', () => {
        it('deve atualizar nome de fornecedor existente', async () => {
            repositoryMock.buscarPorId.mockResolvedValue(makeFornecedor());
            repositoryMock.buscarPorNome.mockResolvedValue(null);
            repositoryMock.atualizar.mockResolvedValue(makeFornecedor({ nome: 'Novo Nome' }));
            const result = await service.atualizar('forn1', { nome: 'Novo Nome' });
            expect(result.nome).toBe('Novo Nome');
        });
        it('deve lançar erro se fornecedor não existir', async () => {
            repositoryMock.buscarPorId.mockResolvedValue(null);
            await expect(service.atualizar('fornX', { nome: 'Qualquer' }))
                .rejects.toThrow(CustomError);
        });
        it('deve lançar erro se tentar atualizar para nome já existente', async () => {
            repositoryMock.buscarPorId.mockResolvedValue(makeFornecedor());
            repositoryMock.buscarPorNome.mockResolvedValue(makeFornecedor({ _id: 'forn2', nome: 'Duplicado' }));
            await expect(service.atualizar('forn1', { nome: 'Duplicado' }))
                .rejects.toThrow(CustomError);
        });
        it('deve lançar erro inesperado do repository', async () => {
            repositoryMock.buscarPorId.mockResolvedValue(makeFornecedor());
            repositoryMock.buscarPorNome.mockResolvedValue(null);
            repositoryMock.atualizar.mockRejectedValue(new Error('DB error'));
            await expect(service.atualizar('forn1', { nome: 'Novo' })).rejects.toThrow('DB error');
        });
    });

    describe('deletar', () => {
        it('deve remover fornecedor existente', async () => {
            repositoryMock.buscarPorId.mockResolvedValue(makeFornecedor());
            repositoryMock.deletar.mockResolvedValue({ acknowledged: true, deletedCount: 1 });
            const result = await service.deletar('forn1');
            expect(result).toHaveProperty('acknowledged', true);
        });
        it('deve lançar erro se fornecedor não existir', async () => {
            repositoryMock.buscarPorId.mockResolvedValue(null);
            await expect(service.deletar('fornX')).rejects.toThrow(CustomError);
        });
        it('deve lançar erro se fornecedor estiver vinculado a componentes/orçamentos', async () => {
            repositoryMock.buscarPorId.mockResolvedValue(makeFornecedor());
            repositoryMock.deletar.mockRejectedValue(new CustomError({
                statusCode: 400,
                errorType: 'resourceInUse',
                field: 'Fornecedor',
                details: [],
                customMessage: 'Fornecedor vinculado a componentes/orçamentos.'
            }));
            await expect(service.deletar('forn1')).rejects.toThrow('Fornecedor vinculado a componentes/orçamentos');
        });
        it('deve lançar erro inesperado do repository', async () => {
            repositoryMock.buscarPorId.mockResolvedValue(makeFornecedor());
            repositoryMock.deletar.mockRejectedValue(new Error('DB error'));
            await expect(service.deletar('forn1')).rejects.toThrow('DB error');
        });
    });

    describe('Métodos auxiliares', () => {
        it('validateNome lança erro se nome já existir', async () => {
            repositoryMock.buscarPorNome.mockResolvedValue(makeFornecedor());
            await expect(service.validateNome('Fornecedor X')).rejects.toThrow(CustomError);
        });
        it('validateNome não lança erro se nome for único', async () => {
            repositoryMock.buscarPorNome.mockResolvedValue(null);
            await expect(service.validateNome('Unico')).resolves.toBeUndefined();
        });
        it('ensureSupplierExists lança erro se não existir', async () => {
            repositoryMock.buscarPorId.mockResolvedValue(null);
            await expect(service.ensureSupplierExists('fornX')).rejects.toThrow(CustomError);
        });
        it('ensureSupplierExists retorna fornecedor se existir', async () => {
            repositoryMock.buscarPorId.mockResolvedValue(makeFornecedor());
            await expect(service.ensureSupplierExists('forn1')).resolves.toHaveProperty('_id', 'forn1');
        });
    });
});