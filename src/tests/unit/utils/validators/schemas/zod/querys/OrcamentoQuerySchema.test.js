import { OrcamentoQuerySchema } from '../../../../../../../utils/validators/schemas/zod/querys/OrcamentoQuerySchema.js';

describe('OrcamentoQuerySchema', () => {
    it('valida query vazia (default)', () => {
        const result = OrcamentoQuerySchema.safeParse({});
        expect(result.success).toBe(true);
        expect(result.data).toEqual({ page: 1, limite: 10 });
    });

    it('valida query com nome, protocolo', () => {
        const query = { nome: 'Teste', protocolo: 'P123' };
        const result = OrcamentoQuerySchema.safeParse(query);
        expect(result.success).toBe(true);
        expect(result.data).toMatchObject({ nome: 'Teste', protocolo: 'P123' });
    });

    it('valida paginação e limites', () => {
        const query = { page: '2', limite: '10' };
        const result = OrcamentoQuerySchema.safeParse(query);
        expect(result.success).toBe(true);
        expect(result.data.page).toBe(2);
        expect(result.data.limite).toBe(10);
    });

    it('falha para tipos inválidos', () => {
        const query = { page: {}, limite: [] };
        const result = OrcamentoQuerySchema.safeParse(query);
        expect(result.success).toBe(false);
        expect(result.error.issues.length).toBeGreaterThan(0);
    });

    it('falha para campos não permitidos', () => {
        const query = { foo: 'bar' };
        const result = OrcamentoQuerySchema.safeParse(query);
        expect(result.success).toBe(true);
        expect(result.data.foo).toBeUndefined();
    });
});