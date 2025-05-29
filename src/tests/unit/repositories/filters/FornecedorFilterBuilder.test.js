import FornecedorFilterBuilder from '../../../../repositories/filters/FornecedorFilterBuilder.js';
import FornecedorRepository from '../../../../repositories/FornecedorRepository.js';
import FornecedorModel from '../../../../models/Fornecedor.js';

jest.mock('../../../../repositories/FornecedorRepository.js');
jest.mock('../../../../models/Fornecedor.js');

describe('FornecedorFilterBuilder', () => {
    let fornecedorFilterBuilder;

    beforeEach(() => {
        jest.clearAllMocks();

        fornecedorFilterBuilder = new FornecedorFilterBuilder();
    });

    describe('constructor', () => {
        test('deve inicializar com filtros vazios', () => {
            expect(fornecedorFilterBuilder.filtros).toEqual({});
        });

        test('deve inicializar com instância de FornecedorRepository', () => {
            expect(fornecedorFilterBuilder.fornecedorRepository).toBeInstanceOf(FornecedorRepository);
        });

        test('deve inicializar com referência ao FornecedorModel', () => {
            expect(fornecedorFilterBuilder.fornecedorModel).toBe(FornecedorModel);
        });
    });

    describe('comNome', () => {
        test('deve adicionar filtro de nome quando nome é fornecido', () => {
            const nome = 'Teste';
            const resultado = fornecedorFilterBuilder.comNome(nome);

            expect(fornecedorFilterBuilder.filtros.nome).toEqual({ $regex: nome, $options: 'i' });

            expect(resultado).toBe(fornecedorFilterBuilder);
        });

        test('não deve adicionar filtro quando nome é undefined', () => {
            const resultado = fornecedorFilterBuilder.comNome(undefined);

            expect(fornecedorFilterBuilder.filtros.nome).toBeUndefined();

            expect(resultado).toBe(fornecedorFilterBuilder);
        });

        test('não deve adicionar filtro quando nome é null', () => {
            const resultado = fornecedorFilterBuilder.comNome(null);

            expect(fornecedorFilterBuilder.filtros.nome).toBeUndefined();

            expect(resultado).toBe(fornecedorFilterBuilder);
        });

        test('não deve adicionar filtro quando nome é string vazia', () => {
            const resultado = fornecedorFilterBuilder.comNome('');

            expect(fornecedorFilterBuilder.filtros.nome).toEqual({ $regex: '', $options: 'i' });

            expect(resultado).toBe(fornecedorFilterBuilder);
        });
    });

    describe('build', () => {
        test('deve retornar filtros vazios quando nenhum filtro foi adicionado', () => {
            const filtros = fornecedorFilterBuilder.build();
            expect(filtros).toEqual({});
        });

        test('deve retornar filtro de nome quando foi adicionado', () => {
            fornecedorFilterBuilder.comNome('Teste');
            const filtros = fornecedorFilterBuilder.build();

            expect(filtros).toEqual({
                nome: { $regex: 'Teste', $options: 'i' }
            });
        });

        test('deve retornar todos os filtros adicionados corretamente', () => {
            fornecedorFilterBuilder.comNome('Fornecedor');

            fornecedorFilterBuilder.filtros.ativo = true;

            const filtros = fornecedorFilterBuilder.build();

            expect(filtros).toEqual({
                nome: { $regex: 'Fornecedor', $options: 'i' },
                ativo: true
            });
        });
    });

    describe('Encadeamento de métodos (fluent interface)', () => {
        test('deve permitir encadear múltiplos métodos e construir filtros corretamente', () => {
            const filtros = fornecedorFilterBuilder
                .comNome('Teste')
                .build();

            expect(filtros).toEqual({
                nome: { $regex: 'Teste', $options: 'i' }
            });
        });
    });
});