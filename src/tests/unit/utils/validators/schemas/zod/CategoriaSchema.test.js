import { CategoriaSchema, CategoriaUpdateSchema } from '../../../../../../utils/validators/schemas/zod/CategoriaSchema.js';

describe('CategoriaSchema', () => {
    it('deve validar dados válidos corretamente', () => {
        const dadosValidos = {
            nome: 'Componentes',
            ativo: false,
        };
        const resultado = CategoriaSchema.parse(dadosValidos);
        expect(resultado).toEqual(dadosValidos);
    });

    it('deve aplicar valor padrão para "ativo" quando não fornecido', () => {
        const dadosValidos = {
            nome: 'Sensores',
        };
        const resultado = CategoriaSchema.parse(dadosValidos);
        expect(resultado.ativo).toBe(true);
    });

    it('deve lançar erro quando "nome" está ausente', () => {
        const dadosInvalidos = {
            ativo: true,
        };
        expect(() => CategoriaSchema.parse(dadosInvalidos)).toThrow(/Required/);
    });

    it('deve lançar erro quando "nome" está vazio', () => {
        const dadosInvalidos = {
            nome: '',
            ativo: true,
        };
        expect(() => CategoriaSchema.parse(dadosInvalidos)).toThrow(/obrigat/);
    });

    it('deve lançar erro quando "ativo" não é booleano', () => {
        const dadosInvalidos = {
            nome: 'Placas',
            ativo: 'sim',
        };
        expect(() => CategoriaSchema.parse(dadosInvalidos)).toThrow();
    });
});

describe('CategoriaUpdateSchema', () => {
    it('deve validar dados parciais corretamente', () => {
        const dadosParciais = { nome: 'Novo Nome' };
        const resultado = CategoriaUpdateSchema.parse(dadosParciais);
        expect(resultado.nome).toBe('Novo Nome');
        expect(resultado.ativo).toBeUndefined();
    });

    it('deve aceitar objeto vazio e manter campos indefinidos', () => {
        const resultado = CategoriaUpdateSchema.parse({});
        expect(resultado.nome).toBeUndefined();
        expect(resultado.ativo).toBeUndefined();
    });

    it('deve lançar erro quando "nome" está vazio', () => {
        const dadosInvalidos = { nome: '' };
        expect(() => CategoriaUpdateSchema.parse(dadosInvalidos)).toThrow(/obrigat/);
    });

    it('deve lançar erro quando "ativo" não é booleano', () => {
        const dadosInvalidos = { ativo: 'sim' };
        expect(() => CategoriaUpdateSchema.parse(dadosInvalidos)).toThrow();
    });
});