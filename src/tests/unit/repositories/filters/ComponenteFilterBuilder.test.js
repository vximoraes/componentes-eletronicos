import ComponenteFilterBuilder from '../../../../repositories/filters/ComponenteFilterBuilder.js';

jest.mock('../../../../models/Componente.js', () => {
    return 'mock-componente-model';
});

jest.mock('../../../../models/Localizacao.js', () => {
    return {
        findById: jest.fn(),
        findOne: jest.fn()
    };
});

jest.mock('../../../../models/Categoria.js', () => {
    return {
        findById: jest.fn(),
        findOne: jest.fn()
    };
});

jest.mock('../../../../models/Movimentacao.js', () => {
    return {
        exists: jest.fn()
    };
});

jest.mock('mongoose', () => {
    return {
        Types: {
            ObjectId: {
                isValid: jest.fn()
            }
        },
        Schema: {
            Types: {
                ObjectId: 'ObjectId'
            }
        }
    };
});

import mongoose from 'mongoose';
import Localizacao from '../../../../models/Localizacao.js';
import Categoria from '../../../../models/Categoria.js';
import ComponenteRepository from '../../../../repositories/ComponenteRepository.js';

jest.mock('../../../../repositories/ComponenteRepository.js', () => {
    return jest.fn().mockImplementation(() => ({
    }));
});

describe('ComponenteFilterBuilder', () => {
    let componenteFilterBuilder;

    beforeEach(() => {
        jest.clearAllMocks();
        componenteFilterBuilder = new ComponenteFilterBuilder();
    });

    describe('constructor', () => {
        test('deve inicializar com filtros vazios', () => {
            expect(componenteFilterBuilder.filtros).toEqual({});
        });

        test('deve inicializar com instância de ComponenteRepository', () => {
            expect(componenteFilterBuilder.componenteRepository).toBeTruthy();
        });

        test('deve inicializar com referência ao ComponenteModel', () => {
            expect(componenteFilterBuilder.componenteModel).toBe('mock-componente-model');
        });
    });

    describe('comNome', () => {
        test('deve adicionar filtro de nome quando nome é fornecido', () => {
            const nome = 'Resistor';
            const resultado = componenteFilterBuilder.comNome(nome);

            expect(componenteFilterBuilder.filtros.nome).toEqual({ $regex: nome, $options: 'i' });
            expect(resultado).toBe(componenteFilterBuilder);
        });

        test('não deve adicionar filtro quando nome é undefined', () => {
            const resultado = componenteFilterBuilder.comNome(undefined);

            expect(componenteFilterBuilder.filtros.nome).toBeUndefined();
            expect(resultado).toBe(componenteFilterBuilder);
        });

        test('não deve adicionar filtro quando nome é null', () => {
            const resultado = componenteFilterBuilder.comNome(null);

            expect(componenteFilterBuilder.filtros.nome).toBeUndefined();
            expect(resultado).toBe(componenteFilterBuilder);
        });

        test('não deve adicionar filtro quando nome é string vazia', () => {
            const resultado = componenteFilterBuilder.comNome('');

            expect(componenteFilterBuilder.filtros.nome).toBeUndefined();
            expect(resultado).toBe(componenteFilterBuilder);
        });
    });

    describe('comQuantidade', () => {
        test('deve adicionar filtro de quantidade quando quantidade é número válido como string', () => {
            const quantidade = '10';
            const resultado = componenteFilterBuilder.comQuantidade(quantidade);

            expect(componenteFilterBuilder.filtros.quantidade).toBe(10);
            expect(resultado).toBe(componenteFilterBuilder);
        });

        test('deve adicionar filtro de quantidade quando quantidade é número', () => {
            const quantidade = 15;
            const resultado = componenteFilterBuilder.comQuantidade(quantidade);

            expect(componenteFilterBuilder.filtros.quantidade).toBe(15);
            expect(resultado).toBe(componenteFilterBuilder);
        });

        test('não deve adicionar filtro quando quantidade é undefined', () => {
            const resultado = componenteFilterBuilder.comQuantidade(undefined);

            expect(componenteFilterBuilder.filtros.quantidade).toBeUndefined();
            expect(resultado).toBe(componenteFilterBuilder);
        });

        test('não deve adicionar filtro quando quantidade é null', () => {
            const resultado = componenteFilterBuilder.comQuantidade(null);

            expect(componenteFilterBuilder.filtros.quantidade).toBeUndefined();
            expect(resultado).toBe(componenteFilterBuilder);
        });

        test('não deve adicionar filtro quando quantidade é string vazia', () => {
            const resultado = componenteFilterBuilder.comQuantidade('');

            expect(componenteFilterBuilder.filtros.quantidade).toBeUndefined();
            expect(resultado).toBe(componenteFilterBuilder);
        });

        test('não deve adicionar filtro quando quantidade não é um número válido', () => {
            const resultado = componenteFilterBuilder.comQuantidade('abc');

            expect(componenteFilterBuilder.filtros.quantidade).toBeUndefined();
            expect(resultado).toBe(componenteFilterBuilder);
        });
    });

    describe('comEstoqueMinimo', () => {
        test('deve adicionar filtro de estoque mínimo quando valor é "true"', () => {
            const resultado = componenteFilterBuilder.comEstoqueMinimo('true');

            expect(componenteFilterBuilder.filtros.$expr).toEqual({ $lt: ["$quantidade", "$estoque_minimo"] });
            expect(resultado).toBe(componenteFilterBuilder);
        });

        test('não deve adicionar filtro quando estoque_minimo não é "true"', () => {
            const resultado = componenteFilterBuilder.comEstoqueMinimo('false');

            expect(componenteFilterBuilder.filtros.$expr).toBeUndefined();
            expect(resultado).toBe(componenteFilterBuilder);
        });

        test('não deve adicionar filtro quando estoque_minimo é undefined', () => {
            const resultado = componenteFilterBuilder.comEstoqueMinimo(undefined);

            expect(componenteFilterBuilder.filtros.$expr).toBeUndefined();
            expect(resultado).toBe(componenteFilterBuilder);
        });

        test('não deve adicionar filtro quando estoque_minimo é null', () => {
            const resultado = componenteFilterBuilder.comEstoqueMinimo(null);

            expect(componenteFilterBuilder.filtros.$expr).toBeUndefined();
            expect(resultado).toBe(componenteFilterBuilder);
        });

        test('não deve adicionar filtro quando estoque_minimo é string vazia', () => {
            const resultado = componenteFilterBuilder.comEstoqueMinimo('');

            expect(componenteFilterBuilder.filtros.$expr).toBeUndefined();
            expect(resultado).toBe(componenteFilterBuilder);
        });
    });

    describe('comLocalizacao', () => {
        test('deve adicionar filtro com localizacao quando é ObjectId válido e localizacao existe', async () => {
            const localizacaoId = 'validObjectId';
            mongoose.Types.ObjectId.isValid.mockReturnValue(true);

            const mockLocalizacao = { _id: localizacaoId, localizacao: 'Prateleira A' };
            Localizacao.findById.mockResolvedValue(mockLocalizacao);

            const resultado = await componenteFilterBuilder.comLocalizacao(localizacaoId);

            expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(localizacaoId);
            expect(Localizacao.findById).toHaveBeenCalledWith(localizacaoId);
            expect(componenteFilterBuilder.filtros.localizacao).toBe(localizacaoId);
            expect(resultado).toBe(componenteFilterBuilder);
        });

        test('deve definir filtro como vazio quando ObjectId é válido mas localizacao não existe', async () => {
            const localizacaoId = 'validObjectId';
            mongoose.Types.ObjectId.isValid.mockReturnValue(true);
            Localizacao.findById.mockResolvedValue(null);

            const resultado = await componenteFilterBuilder.comLocalizacao(localizacaoId);

            expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(localizacaoId);
            expect(Localizacao.findById).toHaveBeenCalledWith(localizacaoId);
            expect(componenteFilterBuilder.filtros.localizacao).toEqual({ $in: [] });
            expect(resultado).toBe(componenteFilterBuilder);
        });

        test('deve buscar localizacao por nome e adicionar filtro quando localizacao existe', async () => {
            const localizacaoNome = 'Prateleira A';
            mongoose.Types.ObjectId.isValid.mockReturnValue(false);

            const mockLocalizacao = { _id: 'someId', localizacao: localizacaoNome };
            Localizacao.findOne.mockResolvedValue(mockLocalizacao);

            const resultado = await componenteFilterBuilder.comLocalizacao(localizacaoNome);

            expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(localizacaoNome);
            expect(Localizacao.findOne).toHaveBeenCalledWith({
                localizacao: { $regex: localizacaoNome, $options: 'i' },
            });
            expect(componenteFilterBuilder.filtros.localizacao).toBe('someId');
            expect(resultado).toBe(componenteFilterBuilder);
        });

        test('deve definir filtro como vazio quando localizacao por nome não existe', async () => {
            const localizacaoNome = 'Prateleira Inexistente';
            mongoose.Types.ObjectId.isValid.mockReturnValue(false);
            Localizacao.findOne.mockResolvedValue(null);

            const resultado = await componenteFilterBuilder.comLocalizacao(localizacaoNome);

            expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(localizacaoNome);
            expect(Localizacao.findOne).toHaveBeenCalledWith({
                localizacao: { $regex: localizacaoNome, $options: 'i' },
            });
            expect(componenteFilterBuilder.filtros.localizacao).toEqual({ $in: [] });
            expect(resultado).toBe(componenteFilterBuilder);
        });

        test('não deve adicionar filtro quando localizacao é undefined', async () => {
            const resultado = await componenteFilterBuilder.comLocalizacao(undefined);

            expect(mongoose.Types.ObjectId.isValid).not.toHaveBeenCalled();
            expect(Localizacao.findById).not.toHaveBeenCalled();
            expect(Localizacao.findOne).not.toHaveBeenCalled();
            expect(componenteFilterBuilder.filtros.localizacao).toBeUndefined();
            expect(resultado).toBe(componenteFilterBuilder);
        });

        test('não deve adicionar filtro quando localizacao é null', async () => {
            const resultado = await componenteFilterBuilder.comLocalizacao(null);

            expect(mongoose.Types.ObjectId.isValid).not.toHaveBeenCalled();
            expect(Localizacao.findById).not.toHaveBeenCalled();
            expect(Localizacao.findOne).not.toHaveBeenCalled();
            expect(componenteFilterBuilder.filtros.localizacao).toBeUndefined();
            expect(resultado).toBe(componenteFilterBuilder);
        });

        test('não deve adicionar filtro quando localizacao é string vazia', async () => {
            const resultado = await componenteFilterBuilder.comLocalizacao('');

            expect(mongoose.Types.ObjectId.isValid).not.toHaveBeenCalled();
            expect(Localizacao.findById).not.toHaveBeenCalled();
            expect(Localizacao.findOne).not.toHaveBeenCalled();
            expect(componenteFilterBuilder.filtros.localizacao).toBeUndefined();
            expect(resultado).toBe(componenteFilterBuilder);
        });
    });

    describe('comCategoria', () => {
        test('deve adicionar filtro com categoria quando é ObjectId válido e categoria existe', async () => {
            const categoriaId = 'validObjectId';
            mongoose.Types.ObjectId.isValid.mockReturnValue(true);

            const mockCategoria = { _id: categoriaId, categoria: 'Resistores' };
            Categoria.findById.mockResolvedValue(mockCategoria);

            const resultado = await componenteFilterBuilder.comCategoria(categoriaId);

            expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(categoriaId);
            expect(Categoria.findById).toHaveBeenCalledWith(categoriaId);
            expect(componenteFilterBuilder.filtros.categoria).toBe(categoriaId);
            expect(resultado).toBe(componenteFilterBuilder);
        });

        test('deve definir filtro como vazio quando ObjectId é válido mas categoria não existe', async () => {
            const categoriaId = 'validObjectId';
            mongoose.Types.ObjectId.isValid.mockReturnValue(true);
            Categoria.findById.mockResolvedValue(null);

            const resultado = await componenteFilterBuilder.comCategoria(categoriaId);

            expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(categoriaId);
            expect(Categoria.findById).toHaveBeenCalledWith(categoriaId);
            expect(componenteFilterBuilder.filtros.categoria).toEqual({ $in: [] });
            expect(resultado).toBe(componenteFilterBuilder);
        });

        test('deve buscar categoria por nome e adicionar filtro quando categoria existe', async () => {
            const categoriaNome = 'Resistores';
            mongoose.Types.ObjectId.isValid.mockReturnValue(false);

            const mockCategoria = { _id: 'someId', categoria: categoriaNome };
            Categoria.findOne.mockResolvedValue(mockCategoria);

            const resultado = await componenteFilterBuilder.comCategoria(categoriaNome);

            expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(categoriaNome);
            expect(Categoria.findOne).toHaveBeenCalledWith({
                categoria: { $regex: categoriaNome, $options: 'i' },
            });
            expect(componenteFilterBuilder.filtros.categoria).toBe('someId');
            expect(resultado).toBe(componenteFilterBuilder);
        });

        test('deve definir filtro como vazio quando categoria por nome não existe', async () => {
            const categoriaNome = 'Categoria Inexistente';
            mongoose.Types.ObjectId.isValid.mockReturnValue(false);
            Categoria.findOne.mockResolvedValue(null);

            const resultado = await componenteFilterBuilder.comCategoria(categoriaNome);

            expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(categoriaNome);
            expect(Categoria.findOne).toHaveBeenCalledWith({
                categoria: { $regex: categoriaNome, $options: 'i' },
            });
            expect(componenteFilterBuilder.filtros.categoria).toEqual({ $in: [] });
            expect(resultado).toBe(componenteFilterBuilder);
        });

        test('não deve adicionar filtro quando categoria é undefined', async () => {
            const resultado = await componenteFilterBuilder.comCategoria(undefined);

            expect(mongoose.Types.ObjectId.isValid).not.toHaveBeenCalled();
            expect(Categoria.findById).not.toHaveBeenCalled();
            expect(Categoria.findOne).not.toHaveBeenCalled();
            expect(componenteFilterBuilder.filtros.categoria).toBeUndefined();
            expect(resultado).toBe(componenteFilterBuilder);
        });

        test('não deve adicionar filtro quando categoria é null', async () => {
            const resultado = await componenteFilterBuilder.comCategoria(null);

            expect(mongoose.Types.ObjectId.isValid).not.toHaveBeenCalled();
            expect(Categoria.findById).not.toHaveBeenCalled();
            expect(Categoria.findOne).not.toHaveBeenCalled();
            expect(componenteFilterBuilder.filtros.categoria).toBeUndefined();
            expect(resultado).toBe(componenteFilterBuilder);
        });

        test('não deve adicionar filtro quando categoria é string vazia', async () => {
            const resultado = await componenteFilterBuilder.comCategoria('');

            expect(mongoose.Types.ObjectId.isValid).not.toHaveBeenCalled();
            expect(Categoria.findById).not.toHaveBeenCalled();
            expect(Categoria.findOne).not.toHaveBeenCalled();
            expect(componenteFilterBuilder.filtros.categoria).toBeUndefined();
            expect(resultado).toBe(componenteFilterBuilder);
        });
    });

    describe('comAtivo', () => {
        test('deve definir filtro como true quando ativo é "true"', () => {
            const resultado = componenteFilterBuilder.comAtivo('true');

            expect(componenteFilterBuilder.filtros.ativo).toBe(true);
            expect(resultado).toBe(componenteFilterBuilder);
        });

        test('deve definir filtro como false quando ativo é "false"', () => {
            const resultado = componenteFilterBuilder.comAtivo('false');

            expect(componenteFilterBuilder.filtros.ativo).toBe(false);
            expect(resultado).toBe(componenteFilterBuilder);
        });

        test('deve definir filtro como true quando ativo é undefined (usando valor padrão)', () => {
            const resultado = componenteFilterBuilder.comAtivo();

            expect(componenteFilterBuilder.filtros.ativo).toBe(true);
            expect(resultado).toBe(componenteFilterBuilder);
        });

        test('não deve adicionar filtro quando ativo não é "true" nem "false"', () => {
            const resultado = componenteFilterBuilder.comAtivo('outro');

            expect(componenteFilterBuilder.filtros.ativo).toBeUndefined();
            expect(resultado).toBe(componenteFilterBuilder);
        });
    });

    describe('build', () => {
        test('deve retornar filtros vazios quando nenhum filtro foi adicionado', () => {
            const filtros = componenteFilterBuilder.build();

            expect(filtros).toEqual({});
        });

        test('deve retornar filtro de nome quando foi adicionado', () => {
            componenteFilterBuilder.comNome('Resistor');
            const filtros = componenteFilterBuilder.build();

            expect(filtros).toEqual({
                nome: { $regex: 'Resistor', $options: 'i' }
            });
        });

        test('deve retornar filtro de quantidade quando foi adicionado', () => {
            componenteFilterBuilder.comQuantidade('10');
            const filtros = componenteFilterBuilder.build();

            expect(filtros).toEqual({
                quantidade: 10
            });
        });

        test('deve retornar filtro de estoque mínimo quando foi adicionado', () => {
            componenteFilterBuilder.comEstoqueMinimo('true');
            const filtros = componenteFilterBuilder.build();

            expect(filtros).toEqual({
                $expr: { $lt: ["$quantidade", "$estoque_minimo"] }
            });
        });

        test('deve retornar filtro de ativo quando foi adicionado', () => {
            componenteFilterBuilder.comAtivo('false');
            const filtros = componenteFilterBuilder.build();

            expect(filtros).toEqual({
                ativo: false
            });
        });

        test('deve retornar todos os filtros adicionados corretamente', () => {
            componenteFilterBuilder.comNome('Resistor');
            componenteFilterBuilder.comQuantidade('10');
            componenteFilterBuilder.comEstoqueMinimo('true');
            componenteFilterBuilder.comAtivo('false');
            componenteFilterBuilder.filtros.localizacao = 'localizacaoId';
            componenteFilterBuilder.filtros.categoria = 'categoriaId';

            const filtros = componenteFilterBuilder.build();

            expect(filtros).toEqual({
                nome: { $regex: 'Resistor', $options: 'i' },
                quantidade: 10,
                $expr: { $lt: ["$quantidade", "$estoque_minimo"] },
                ativo: false,
                localizacao: 'localizacaoId',
                categoria: 'categoriaId'
            });
        });
    });

    describe('Encadeamento de métodos (fluent interface)', () => {
        test('deve permitir encadear múltiplos métodos síncronos e construir filtros corretamente', () => {
            const filtros = componenteFilterBuilder
                .comNome('Resistor')
                .comQuantidade('10')
                .comEstoqueMinimo('true')
                .comAtivo('false')
                .build();

            expect(filtros).toEqual({
                nome: { $regex: 'Resistor', $options: 'i' },
                quantidade: 10,
                $expr: { $lt: ["$quantidade", "$estoque_minimo"] },
                ativo: false
            });
        });

        test('deve permitir encadear métodos com testes assíncronos', async () => {
            mongoose.Types.ObjectId.isValid.mockReturnValue(true);

            Localizacao.findById.mockResolvedValue({ _id: 'localizacaoId', localizacao: 'Prateleira A' });
            Categoria.findById.mockResolvedValue({ _id: 'categoriaId', categoria: 'Resistores' });

            componenteFilterBuilder.comNome('Resistor');
            componenteFilterBuilder.comQuantidade('10');
            componenteFilterBuilder.comAtivo('true');
            await componenteFilterBuilder.comLocalizacao('localizacaoId');
            await componenteFilterBuilder.comCategoria('categoriaId');

            const filtros = componenteFilterBuilder.build();

            expect(filtros).toEqual({
                nome: { $regex: 'Resistor', $options: 'i' },
                quantidade: 10,
                ativo: true,
                localizacao: 'localizacaoId',
                categoria: 'categoriaId'
            });
        });
    });
});