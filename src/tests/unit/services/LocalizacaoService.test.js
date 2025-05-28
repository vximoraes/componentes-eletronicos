import LocalizacaoService from '../../../services/LocalizacaoService.js';
import LocalizacaoRepository from '../../../repositories/LocalizacaoRepository.js';
import { CustomError } from '../../../utils/helpers/index.js';

jest.mock('../../../repositories/LocalizacaoRepository.js');

const makeLocalizacao = (props = {}) => ({ _id: 'loc1', nome: 'Estoque', ...props });

describe('LocalizacaoService', () => {
    let service, repositoryMock;
    beforeEach(() => {
        LocalizacaoRepository.mockClear();
        repositoryMock = {
            criar: jest.fn(),
            listar: jest.fn(),
            atualizar: jest.fn(),
            deletar: jest.fn(),
            buscarPorNome: jest.fn(),
            buscarPorId: jest.fn()
        };
        LocalizacaoRepository.mockImplementation(() => repositoryMock);
        service = new LocalizacaoService();
        jest.clearAllMocks();
    });

    describe('criar', () => {
        it('deve cadastrar localização com nome único', async () => {
            repositoryMock.buscarPorNome.mockResolvedValue(null);
            repositoryMock.criar.mockResolvedValue(makeLocalizacao());
            const result = await service.criar({ nome: 'Estoque' });
            expect(result).toHaveProperty('_id');
            expect(repositoryMock.criar).toHaveBeenCalledWith({ nome: 'Estoque' });
        });

        it('deve lançar erro se nome já existir', async () => {
            repositoryMock.buscarPorNome.mockResolvedValue(makeLocalizacao());
            await expect(service.criar({ nome: 'Estoque' }))
                .rejects.toThrow(CustomError);
        });
    });

    describe('listar', () => {
        it('deve retornar todas as localizações', async () => {
            const locs = [makeLocalizacao(), makeLocalizacao({ _id: 'loc2', nome: 'Sala' })];
            repositoryMock.listar.mockResolvedValue(locs);
            const result = await service.listar({});
            expect(result).toEqual(locs);
        });
        it('deve lançar erro inesperado do repository', async () => {
            repositoryMock.listar.mockRejectedValue(new Error('DB error'));
            await expect(service.listar({})).rejects.toThrow('DB error');
        });
    });

    describe('atualizar', () => {
        it('deve atualizar nome de localização existente', async () => {
            repositoryMock.buscarPorId.mockResolvedValue(makeLocalizacao());
            repositoryMock.buscarPorNome.mockResolvedValue(null);
            repositoryMock.atualizar.mockResolvedValue(makeLocalizacao({ nome: 'Novo Nome' }));
            const result = await service.atualizar('loc1', { nome: 'Novo Nome' });
            expect(result.nome).toBe('Novo Nome');
        });
        it('deve lançar erro se localização não existir', async () => {
            repositoryMock.buscarPorId.mockResolvedValue(null);
            await expect(service.atualizar('locX', { nome: 'Qualquer' }))
                .rejects.toThrow(CustomError);
        });
        it('deve lançar erro se tentar atualizar para nome já existente', async () => {
            repositoryMock.buscarPorId.mockResolvedValue(makeLocalizacao());
            repositoryMock.buscarPorNome.mockResolvedValue(makeLocalizacao({ _id: 'loc2', nome: 'Duplicado' }));
            await expect(service.atualizar('loc1', { nome: 'Duplicado' }))
                .rejects.toThrow(CustomError);
        });
        it('deve lançar erro inesperado do repository', async () => {
            repositoryMock.buscarPorId.mockResolvedValue(makeLocalizacao());
            repositoryMock.buscarPorNome.mockResolvedValue(null);
            repositoryMock.atualizar.mockRejectedValue(new Error('DB error'));
            await expect(service.atualizar('loc1', { nome: 'Novo' })).rejects.toThrow('DB error');
        });
    });

    describe('deletar', () => {
        it('deve remover localização existente', async () => {
            repositoryMock.buscarPorId.mockResolvedValue(makeLocalizacao());
            repositoryMock.deletar.mockResolvedValue({ acknowledged: true, deletedCount: 1 });
            const result = await service.deletar('loc1');
            expect(result).toHaveProperty('acknowledged', true);
        });
        it('deve lançar erro se localização não existir', async () => {
            repositoryMock.buscarPorId.mockResolvedValue(null);
            await expect(service.deletar('locX')).rejects.toThrow(CustomError);
        });
        it('deve lançar erro se localização estiver vinculada a componentes', async () => {
            repositoryMock.buscarPorId.mockResolvedValue(makeLocalizacao());
            repositoryMock.deletar.mockRejectedValue(new CustomError({
                statusCode: 400,
                errorType: 'resourceInUse',
                field: 'Localizacao',
                details: [],
                customMessage: 'Localização vinculada a componentes.'
            }));
            await expect(service.deletar('loc1')).rejects.toThrow('Localização vinculada a componentes');
        });
        it('deve lançar erro inesperado do repository', async () => {
            repositoryMock.buscarPorId.mockResolvedValue(makeLocalizacao());
            repositoryMock.deletar.mockRejectedValue(new Error('DB error'));
            await expect(service.deletar('loc1')).rejects.toThrow('DB error');
        });
    });

    describe('Métodos auxiliares', () => {
        it('validateNome lança erro se nome já existir', async () => {
            repositoryMock.buscarPorNome.mockResolvedValue(makeLocalizacao());
            await expect(service.validateNome('Estoque')).rejects.toThrow(CustomError);
        });
        it('validateNome não lança erro se nome for único', async () => {
            repositoryMock.buscarPorNome.mockResolvedValue(null);
            await expect(service.validateNome('Unico')).resolves.toBeUndefined();
        });
        it('ensureLocationExists lança erro se não existir', async () => {
            repositoryMock.buscarPorId.mockResolvedValue(null);
            await expect(service.ensureLocationExists('locX')).rejects.toThrow(CustomError);
        });
        it('ensureLocationExists retorna localização se existir', async () => {
            repositoryMock.buscarPorId.mockResolvedValue(makeLocalizacao());
            await expect(service.ensureLocationExists('loc1')).resolves.toHaveProperty('_id', 'loc1');
        });
    });
});