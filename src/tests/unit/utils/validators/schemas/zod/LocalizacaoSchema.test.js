import { LocalizacaoSchema, LocalizacaoUpdateSchema } from '../../../../../../utils/validators/schemas/zod/LocalizacaoSchema.js';

describe('LocalizacaoSchema', () => {
    it('valida uma localização válida', () => {
        const data = { nome: 'Prateleira A', ativo: true };
        expect(() => LocalizacaoSchema.parse(data)).not.toThrow();
    });

    it('define ativo como true por padrão', () => {
        const data = { nome: 'Prateleira B' };
        const parsed = LocalizacaoSchema.parse(data);
        expect(parsed.ativo).toBe(true);
    });

    it('retorna erro se nome for vazio', () => {
        const data = { nome: '' };
        expect(() => LocalizacaoSchema.parse(data)).toThrow('Campo nome é obrigatório.');
    });

    it('retorna erro se nome não for string', () => {
        const data = { nome: 123 };
        expect(() => LocalizacaoSchema.parse(data)).toThrow();
    });

    it('retorna erro se nome estiver ausente', () => {
        const data = {};
        expect(() => LocalizacaoSchema.parse(data)).toThrow('Required');
    });

    it('retorna erro se ativo não for boolean', () => {
        const data = { nome: 'Prateleira C', ativo: 'sim' };
        expect(() => LocalizacaoSchema.parse(data)).toThrow();
    });
});

describe('LocalizacaoUpdateSchema', () => {
    it('aceita objeto vazio', () => {
        expect(() => LocalizacaoUpdateSchema.parse({})).not.toThrow();
    });

    it('aceita atualização parcial do nome', () => {
        expect(() => LocalizacaoUpdateSchema.parse({ nome: 'Prateleira D' })).not.toThrow();
    });

    it('aceita atualização parcial do ativo', () => {
        expect(() => LocalizacaoUpdateSchema.parse({ ativo: false })).not.toThrow();
    });

    it('retorna erro se nome for string vazia', () => {
        expect(() => LocalizacaoUpdateSchema.parse({ nome: '' })).toThrow('Campo nome é obrigatório.');
    });

    it('retorna erro se ativo não for boolean', () => {
        expect(() => LocalizacaoUpdateSchema.parse({ ativo: 'não' })).toThrow();
    });
});