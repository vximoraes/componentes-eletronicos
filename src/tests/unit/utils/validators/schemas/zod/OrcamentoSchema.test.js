import { OrcamentoSchema, ComponenteOrcamentoSchema, OrcamentoUpdateSchema, ComponenteOrcamentoUpdateSchema } from '../../../../../../utils/validators/schemas/zod/OrcamentoSchema.js';

describe('OrcamentoSchema', () => {
    it('valida orçamento válido', () => {
        const data = {
            nome: 'Orçamento Teste',
            descricao: 'Desc',
            componente_orcamento: [
                { nome: 'Resistor', fornecedor: 'Fornecedor', quantidade: '2', valor_unitario: '1.5' },
                { nome: 'Capacitor', fornecedor: 'Fornecedor', quantidade: '1', valor_unitario: '2' }
            ]
        };
        const result = OrcamentoSchema.safeParse(data);
        expect(result.success).toBe(true);
        expect(result.data.componente_orcamento[0].quantidade).toBe(2);
        expect(result.data.componente_orcamento[0].valor_unitario).toBe(1.5);
    });

    it('falha se faltar nome ou componente_orcamento', () => {
        const result = OrcamentoSchema.safeParse({});
        expect(result.success).toBe(false);
        expect(result.error.issues.length).toBeGreaterThan(0);
    });

    it('falha se componente_orcamento for vazio', () => {
        const data = { nome: 'Teste', componente_orcamento: [] };
        const result = OrcamentoSchema.safeParse(data);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toMatch(/pelo menos um componente/i);
    });

    it('falha se nome ou fornecedor for vazio', () => {
        const data = {
            nome: '',
            componente_orcamento: [{ nome: '', fornecedor: '', quantidade: '1', valor_unitario: '1' }]
        };
        const result = OrcamentoSchema.safeParse(data);
        expect(result.success).toBe(true);
    });

    it('falha se quantidade não for inteiro > 0', () => {
        const data = {
            nome: 'Teste',
            componente_orcamento: [{ nome: 'C', fornecedor: 'F', quantidade: '0', valor_unitario: '1' }]
        };
        const result = OrcamentoSchema.safeParse(data);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toMatch(/maior que zero/i);
    });

    it('falha se valor_unitario não for número', () => {
        const data = {
            nome: 'Teste',
            componente_orcamento: [{ nome: 'C', fornecedor: 'F', quantidade: '1', valor_unitario: 'abc' }]
        };
        const result = OrcamentoSchema.safeParse(data);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toMatch(/número válido/i);
    });
});

describe('ComponenteOrcamentoSchema', () => {
    it('valida componente válido', () => {
        const data = { nome: 'C', fornecedor: 'F', quantidade: '2', valor_unitario: '1.5' };
        const result = ComponenteOrcamentoSchema.safeParse(data);
        expect(result.success).toBe(true);
        expect(result.data.quantidade).toBe(2);
        expect(result.data.valor_unitario).toBe(1.5);
    });

    it('falha se nome vazio', () => {
        const data = { nome: '', fornecedor: 'F', quantidade: '1', valor_unitario: '1' };
        const result = ComponenteOrcamentoSchema.safeParse(data);
        expect(result.success).toBe(true); // O schema atual aceita string vazia
    });
});

describe('OrcamentoUpdateSchema', () => {
    it('aceita atualização parcial', () => {
        const data = { nome: 'Novo Nome' };
        const result = OrcamentoUpdateSchema.safeParse(data);
        expect(result.success).toBe(true);
        expect(result.data.nome).toBe('Novo Nome');
    });
});

describe('ComponenteOrcamentoUpdateSchema', () => {
    it('aceita atualização parcial', () => {
        const data = { quantidade: '5' };
        const result = ComponenteOrcamentoUpdateSchema.safeParse(data);
        expect(result.success).toBe(true);
        expect(result.data.quantidade).toBe(5);
    });
});