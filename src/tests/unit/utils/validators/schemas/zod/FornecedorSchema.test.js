import { FornecedorSchema, FornecedorUpdateSchema } from '../../../../../../utils/validators/schemas/zod/FornecedorSchema.js';

describe('FornecedorSchema', () => {
    it('valida um fornecedor válido', () => {
        const data = { nome: 'Fornecedor X', ativo: true };
        expect(() => FornecedorSchema.parse(data)).not.toThrow();
    });

    it('define ativo como true por padrão', () => {
        const data = { nome: 'Fornecedor Y' };
        const parsed = FornecedorSchema.parse(data);
        expect(parsed.ativo).toBe(true);
    });

    it('retorna erro se nome for vazio', () => {
        const data = { nome: '' };
        expect(() => FornecedorSchema.parse(data)).toThrow('Campo nome é obrigatório.');
    });

    it('retorna erro se nome não for string', () => {
        const data = { nome: 123 };
        expect(() => FornecedorSchema.parse(data)).toThrow();
    });

    it('retorna erro se nome estiver ausente', () => {
        const data = {};
        expect(() => FornecedorSchema.parse(data)).toThrow('Required');
    });

    it('retorna erro se ativo não for boolean', () => {
        const data = { nome: 'Fornecedor Z', ativo: 'sim' };
        expect(() => FornecedorSchema.parse(data)).toThrow();
    });
});

describe('FornecedorUpdateSchema', () => {
    it('aceita objeto vazio', () => {
        expect(() => FornecedorUpdateSchema.parse({})).not.toThrow();
    });

    it('aceita atualização parcial do nome', () => {
        expect(() => FornecedorUpdateSchema.parse({ nome: 'Novo Nome' })).not.toThrow();
    });

    it('aceita atualização parcial do ativo', () => {
        expect(() => FornecedorUpdateSchema.parse({ ativo: false })).not.toThrow();
    });

    it('retorna erro se nome for string vazia', () => {
        expect(() => FornecedorUpdateSchema.parse({ nome: '' })).toThrow('Campo nome é obrigatório.');
    });

    it('retorna erro se ativo não for boolean', () => {
        expect(() => FornecedorUpdateSchema.parse({ ativo: 'sim' })).toThrow();
    });
});