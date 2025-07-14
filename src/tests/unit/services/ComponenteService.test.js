import ComponenteService from '../../../services/ComponenteService.js';
import ComponenteRepository from '../../../repositories/ComponenteRepository.js';
import LocalizacaoModel from '../../../models/Localizacao.js';
import CategoriaModel from '../../../models/Categoria.js';
import { CustomError } from '../../../utils/helpers/index.js';

jest.mock('../../../repositories/ComponenteRepository.js');
jest.mock('../../../models/Localizacao.js');
jest.mock('../../../models/Categoria.js');

const makeComponente = (props = {}) => ({
    _id: 'comp1',
    nome: 'Resistor',
    quantidade: 10,
    estoque_minimo: 2,
    valor_unitario: 0.5,
    categoria: 'cat1',
    localizacao: 'loc1',
    ativo: false,
    ...props
});
const makeCategoria = (props = {}) => ({ _id: 'cat1', nome: 'Passivo', ...props });
const makeLocalizacao = (props = {}) => ({ _id: 'loc1', nome: 'Estoque', ...props });

describe('ComponenteService', () => {
    let service, repositoryMock;
    beforeEach(() => {
        ComponenteRepository.mockClear();
        repositoryMock = {
            criar: jest.fn(),
            listar: jest.fn(),
            atualizar: jest.fn(),
            deletar: jest.fn(),
            buscarPorNome: jest.fn(),
            buscarPorId: jest.fn()
        };
        ComponenteRepository.mockImplementation(() => repositoryMock);
        service = new ComponenteService();
        jest.clearAllMocks();
    });

    describe('criar', () => {
        it('deve cadastrar componente com dados válidos', async () => {
            repositoryMock.buscarPorNome.mockResolvedValue(null);
            LocalizacaoModel.findById.mockResolvedValue(makeLocalizacao());
            CategoriaModel.findById.mockResolvedValue(makeCategoria());
            repositoryMock.criar.mockResolvedValue(makeComponente());
            const result = await service.criar({
                nome: 'Resistor',
                quantidade: 10,
                estoque_minimo: 2,
                valor_unitario: 0.5,
                categoria: 'cat1',
                localizacao: 'loc1'
            });
            expect(result).toHaveProperty('_id');
            expect(repositoryMock.criar).toHaveBeenCalled();
        });
        it('deve lançar erro se nome já existir', async () => {
            repositoryMock.buscarPorNome.mockResolvedValue(makeComponente());
            await expect(service.criar({ nome: 'Resistor', localizacao: 'loc1', categoria: 'cat1' }))
                .rejects.toThrow(CustomError);
        });
        it('deve lançar erro se localizacao não existir', async () => {
            repositoryMock.buscarPorNome.mockResolvedValue(null);
            LocalizacaoModel.findById.mockResolvedValue(null);
            await expect(service.criar({ nome: 'Resistor', localizacao: 'locX', categoria: 'cat1' }))
                .rejects.toThrow(CustomError);
        });
        it('deve lançar erro se categoria não existir', async () => {
            repositoryMock.buscarPorNome.mockResolvedValue(null);
            LocalizacaoModel.findById.mockResolvedValue(makeLocalizacao());
            CategoriaModel.findById.mockResolvedValue(null);
            await expect(service.criar({ nome: 'Resistor', localizacao: 'loc1', categoria: 'catX' }))
                .rejects.toThrow(CustomError);
        });
        it('deve lançar erro inesperado do repository', async () => {
            repositoryMock.buscarPorNome.mockResolvedValue(null);
            LocalizacaoModel.findById.mockResolvedValue(makeLocalizacao());
            CategoriaModel.findById.mockResolvedValue(makeCategoria());
            repositoryMock.criar.mockRejectedValue(new Error('DB error'));
            await expect(service.criar({ nome: 'Resistor', localizacao: 'loc1', categoria: 'cat1' }))
                .rejects.toThrow('DB error');
        });
    });

    describe('listar', () => {
        it('deve retornar todos os componentes', async () => {
            const comps = [makeComponente(), makeComponente({ _id: 'comp2', nome: 'Capacitor' })];
            repositoryMock.listar.mockResolvedValue(comps);
            const result = await service.listar({});
            expect(result).toEqual(comps);
        });
        it('deve lançar erro inesperado do repository', async () => {
            repositoryMock.listar.mockRejectedValue(new Error('DB error'));
            await expect(service.listar({})).rejects.toThrow('DB error');
        });
    });

    describe('atualizar', () => {
        it('deve atualizar dados do componente, exceto quantidade', async () => {
            // Simula que o componente existe no banco
            repositoryMock.buscarPorId.mockResolvedValue(makeComponente());
            // Simula que não existe outro componente com o mesmo nome
            repositoryMock.buscarPorNome.mockResolvedValue(null);
            // Simula atualização no banco, mas mantém quantidade original
            repositoryMock.atualizar.mockResolvedValue(makeComponente({ nome: 'Novo Nome', quantidade: 10 }));
            // Tenta atualizar o nome e a quantidade do componente
            const result = await service.atualizar('comp1', { nome: 'Novo Nome', quantidade: 999 });
            // Verifica se o nome foi atualizado corretamente
            expect(result.nome).toBe('Novo Nome');
            // Garante que o método atualizar foi chamado sem o campo quantidade
            expect(repositoryMock.atualizar).toHaveBeenCalledWith('comp1', { nome: 'Novo Nome' });
        });
        it('deve lançar erro se componente não existir', async () => {
            repositoryMock.buscarPorId.mockResolvedValue(null);
            await expect(service.atualizar('compX', { nome: 'Qualquer' }))
                .rejects.toThrow(CustomError);
        });
        it('deve lançar erro se tentar atualizar para nome já existente', async () => {
            repositoryMock.buscarPorId.mockResolvedValue(makeComponente());
            repositoryMock.buscarPorNome.mockResolvedValue(makeComponente({ _id: 'comp2', nome: 'Duplicado' }));
            await expect(service.atualizar('comp1', { nome: 'Duplicado' }))
                .rejects.toThrow(CustomError);
        });
        it('deve lançar erro inesperado do repository', async () => {
            repositoryMock.buscarPorId.mockResolvedValue(makeComponente());
            repositoryMock.buscarPorNome.mockResolvedValue(null);
            repositoryMock.atualizar.mockRejectedValue(new Error('DB error'));
            await expect(service.atualizar('comp1', { nome: 'Novo' })).rejects.toThrow('DB error');
        });
    });

    describe('deletar', () => {
        it('deve remover componente existente', async () => {
            repositoryMock.buscarPorId.mockResolvedValue(makeComponente());
            repositoryMock.deletar.mockResolvedValue({ acknowledged: true, deletedCount: 1 });
            const result = await service.deletar('comp1');
            expect(result).toHaveProperty('acknowledged', true);
        });
        it('deve lançar erro se componente não existir', async () => {
            repositoryMock.buscarPorId.mockResolvedValue(null);
            await expect(service.deletar('compX')).rejects.toThrow(CustomError);
        });
        it('deve lançar erro se componente estiver vinculado a movimentações', async () => {
            repositoryMock.buscarPorId.mockResolvedValue(makeComponente());
            repositoryMock.deletar.mockRejectedValue(new CustomError({
                statusCode: 400,
                errorType: 'resourceInUse',
                field: 'Componente',
                details: [],
                customMessage: 'Componente vinculado a movimentações.'
            }));
            await expect(service.deletar('comp1')).rejects.toThrow('Componente vinculado a movimentações');
        });
        it('deve lançar erro inesperado do repository', async () => {
            repositoryMock.buscarPorId.mockResolvedValue(makeComponente());
            repositoryMock.deletar.mockRejectedValue(new Error('DB error'));
            await expect(service.deletar('comp1')).rejects.toThrow('DB error');
        });
    });

    describe('Métodos auxiliares', () => {
        it('validateNome lança erro se nome já existir', async () => {
            repositoryMock.buscarPorNome.mockResolvedValue(makeComponente());
            await expect(service.validateNome('Resistor')).rejects.toThrow(CustomError);
        });
        it('validateNome não lança erro se nome for único', async () => {
            repositoryMock.buscarPorNome.mockResolvedValue(null);
            await expect(service.validateNome('Unico')).resolves.toBeUndefined();
        });
        it('ensureComponentExists lança erro se não existir', async () => {
            repositoryMock.buscarPorId.mockResolvedValue(null);
            await expect(service.ensureComponentExists('compX')).rejects.toThrow(CustomError);
        });
        it('ensureComponentExists retorna componente se existir', async () => {
            repositoryMock.buscarPorId.mockResolvedValue(makeComponente());
            await expect(service.ensureComponentExists('comp1')).resolves.toHaveProperty('_id', 'comp1');
        });
        it('validateLocalizacao lança erro se não existir', async () => {
            LocalizacaoModel.findById.mockResolvedValue(null);
            await expect(service.validateLocalizacao('locX')).rejects.toThrow(CustomError);
        });
        it('validateLocalizacao não lança erro se existir', async () => {
            LocalizacaoModel.findById.mockResolvedValue(makeLocalizacao());
            await expect(service.validateLocalizacao('loc1')).resolves.toBeUndefined();
        });
        it('validateCategoria lança erro se não existir', async () => {
            CategoriaModel.findById.mockResolvedValue(null);
            await expect(service.validateCategoria('catX')).rejects.toThrow(CustomError);
        });
        it('validateCategoria não lança erro se existir', async () => {
            CategoriaModel.findById.mockResolvedValue(makeCategoria());
            await expect(service.validateCategoria('cat1')).resolves.toBeUndefined();
        });
    });
});