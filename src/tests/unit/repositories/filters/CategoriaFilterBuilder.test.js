import CategoriaFilterBuilder from '../../../../repositories/filters/CategoriaFilterBuilder.js';
import CategoriaRepository from '../../../../repositories/CategoriaRepository.js';
import CategoriaModel from '../../../../models/Categoria.js';

jest.mock('../../../../repositories/CategoriaRepository.js');
jest.mock('../../../../models/Categoria.js');

describe('CategoriaFilterBuilder', () => {
    let categoriaFilterBuilder;

    beforeEach(() => {
        jest.clearAllMocks();
        categoriaFilterBuilder = new CategoriaFilterBuilder();
    });

    describe('constructor', () => {
        test('deve inicializar com filtros vazios', () => {
            expect(categoriaFilterBuilder.filtros).toEqual({});
        });

        test('deve inicializar com instância de CategoriaRepository', () => {
            expect(categoriaFilterBuilder.categoriaRepository).toBeInstanceOf(CategoriaRepository);
        });

        test('deve inicializar com referência ao CategoriaModel', () => {
            expect(categoriaFilterBuilder.categoriaModel).toBe(CategoriaModel);
        });
    });

    describe('comNome', () => {
        test('deve adicionar filtro de nome quando nome é fornecido', () => {
            const nome = 'Eletrônicos';
            const resultado = categoriaFilterBuilder.comNome(nome);
            expect(categoriaFilterBuilder.filtros.nome).toEqual({ $regex: nome, $options: 'i' });
            expect(resultado).toBe(categoriaFilterBuilder);
        });

        test('não deve adicionar filtro quando nome é undefined', () => {
            const resultado = categoriaFilterBuilder.comNome(undefined);
            expect(categoriaFilterBuilder.filtros.nome).toBeUndefined();
            expect(resultado).toBe(categoriaFilterBuilder);
        });

        test('não deve adicionar filtro quando nome é null', () => {
            const resultado = categoriaFilterBuilder.comNome(null);
            expect(categoriaFilterBuilder.filtros.nome).toBeUndefined();
            expect(resultado).toBe(categoriaFilterBuilder);
        });

        test('não deve adicionar filtro quando nome é string vazia', () => {
            const resultado = categoriaFilterBuilder.comNome('');
            expect(categoriaFilterBuilder.filtros.nome).toBeUndefined();
            expect(resultado).toBe(categoriaFilterBuilder);
        });
    });

    describe('build', () => {
        test('deve retornar filtros vazios quando nenhum filtro foi adicionado', () => {
            const filtros = categoriaFilterBuilder.build();
            expect(filtros).toEqual({});
        });

        test('deve retornar filtro de nome quando foi adicionado', () => {
            categoriaFilterBuilder.comNome('Eletrônicos');
            const filtros = categoriaFilterBuilder.build();
            expect(filtros).toEqual({ nome: { $regex: 'Eletrônicos', $options: 'i' } });
        });

        test('deve retornar todos os filtros adicionados corretamente', () => {
            categoriaFilterBuilder.comNome('Categoria');
            categoriaFilterBuilder.filtros.ativo = true;
            const filtros = categoriaFilterBuilder.build();
            expect(filtros).toEqual({ nome: { $regex: 'Categoria', $options: 'i' }, ativo: true });
        });
    });

    describe('Encadeamento de métodos (fluent interface)', () => {
        test('deve permitir encadear múltiplos métodos e construir filtros corretamente', () => {
            const filtros = categoriaFilterBuilder.comNome('Teste').build();
            expect(filtros).toEqual({ nome: { $regex: 'Teste', $options: 'i' } });
        });
    });
});