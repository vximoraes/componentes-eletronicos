import { LocalizacaoIdSchema, LocalizacaoQuerySchema } from '../../../../../../../utils/validators/schemas/zod/querys/LocalizacaoQuerySchema.js';

describe('LocalizacaoIdSchema', () => {
    it('valida um ObjectId válido', () => {
        const validId = '507f1f77bcf86cd799439011';
        expect(() => LocalizacaoIdSchema.parse(validId)).not.toThrow();
    });

    it('retorna erro para ObjectId inválido', () => {
        const invalidId = '123';
        expect(() => LocalizacaoIdSchema.parse(invalidId)).toThrow('ID inválido');
    });
});

describe('LocalizacaoQuerySchema', () => {
    it('valida query vazia (usa defaults)', () => {
        const parsed = LocalizacaoQuerySchema.parse({});
        expect(parsed.page).toBe(1);
        expect(parsed.limite).toBe(10);
        expect(parsed.nome).toBeUndefined();
    });

    it('valida nome não vazio', () => {
        const parsed = LocalizacaoQuerySchema.parse({ nome: '  Prateleira A  ' });
        expect(parsed.nome).toBe('Prateleira A');
    });    it('retorna erro se nome for string vazia', async () => {
        await expect(LocalizacaoQuerySchema.parseAsync({ nome: '' })).rejects.toThrow('Nome não pode ser vazio');
    });

    it('valida page e limite como string numérica', () => {
        const parsed = LocalizacaoQuerySchema.parse({ page: '2', limite: '5' });
        expect(parsed.page).toBe(2);
        expect(parsed.limite).toBe(5);
    });

    it('retorna erro se page for zero ou negativo', () => {
        expect(() => LocalizacaoQuerySchema.parse({ page: '0' })).toThrow('Page deve ser um número inteiro maior que 0');
        expect(() => LocalizacaoQuerySchema.parse({ page: '-1' })).toThrow('Page deve ser um número inteiro maior que 0');
    });

    it('retorna erro se limite for zero, negativo ou maior que 100', () => {
        expect(() => LocalizacaoQuerySchema.parse({ limite: '0' })).toThrow('Limite deve ser um número inteiro entre 1 e 100');
        expect(() => LocalizacaoQuerySchema.parse({ limite: '-1' })).toThrow('Limite deve ser um número inteiro entre 1 e 100');
        expect(() => LocalizacaoQuerySchema.parse({ limite: '101' })).toThrow('Limite deve ser um número inteiro entre 1 e 100');
    });

    it('retorna erro se page não for número', () => {
        expect(() => LocalizacaoQuerySchema.parse({ page: 'abc' })).toThrow('Page deve ser um número inteiro maior que 0');
    });

    it('retorna erro se limite não for número', () => {
        expect(() => LocalizacaoQuerySchema.parse({ limite: 'abc' })).toThrow('Limite deve ser um número inteiro entre 1 e 100');
    });

    it('valida quando nome é undefined', () => {
        const parsed = LocalizacaoQuerySchema.parse({ nome: undefined });
        expect(parsed.nome).toBeUndefined();
    });

    it('valida valores undefined para page e limite', () => {
        const parsed = LocalizacaoQuerySchema.parse({ page: undefined, limite: undefined });
        expect(parsed.page).toBe(1);
        expect(parsed.limite).toBe(10);
    });

    it('valida valores string vazia para page e limite', () => {
        const parsed = LocalizacaoQuerySchema.parse({ page: '', limite: '' });
        expect(parsed.page).toBe(1);
        expect(parsed.limite).toBe(10);
    });
});