import { MovimentacaoQuerySchema, MovimentacaoIdSchema } from '../../../../../../../utils/validators/schemas/zod/querys/MovimentacaoQuerySchema.js';
import { ZodError } from 'zod';
import mongoose from 'mongoose';

jest.mock('mongoose', () => ({
    Types: {
        ObjectId: {
            isValid: jest.fn()
        }
    }
}));

describe('MovimentacaoIdSchema', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve aceitar um ID válido', () => {
        const validId = '64f234a0c781a7b30c2fe445';
        mongoose.Types.ObjectId.isValid.mockReturnValue(true);
        const result = MovimentacaoIdSchema.parse(validId);
        expect(result).toBe(validId);
        expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(validId);
    });

    it('deve rejeitar um ID inválido', () => {
        const invalidId = 'invalid-id';
        mongoose.Types.ObjectId.isValid.mockReturnValue(false);
        expect(() => MovimentacaoIdSchema.parse(invalidId)).toThrow(ZodError);
        expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(invalidId);
    });
});

describe('MovimentacaoQuerySchema', () => {
    describe('Validação de tipo', () => {
        it('deve aceitar quando tipo é entrada', () => {
            const query = { tipo: 'entrada' };
            const result = MovimentacaoQuerySchema.parse(query);
            expect(result.tipo).toBe('entrada');
        });

        it('deve aceitar quando tipo é saida', () => {
            const query = { tipo: 'saida' };
            const result = MovimentacaoQuerySchema.parse(query);
            expect(result.tipo).toBe('saida');
        });

        it('deve rejeitar quando tipo é inválido', () => {
            const query = { tipo: 'invalido' };
            expect(() => MovimentacaoQuerySchema.parse(query)).toThrow(ZodError);
        });

        it('deve aceitar quando tipo não é fornecido', () => {
            const query = {};
            const result = MovimentacaoQuerySchema.parse(query);
            expect(result.tipo).toBeUndefined();
        });
    });

    describe('Validação de data', () => {
        it('deve aceitar e transformar uma data válida no formato YYYY-MM-DD', () => {
            const query = { data: '2025-05-28' };
            const result = MovimentacaoQuerySchema.parse(query);
            expect(result.data).toBeInstanceOf(Date);
            expect(result.data.toISOString()).toBe('2025-05-28T00:00:00.000Z');
        });

        it('deve rejeitar uma data em formato inválido', () => {
            const query = { data: '28/05/2025' };
            expect(() => MovimentacaoQuerySchema.parse(query)).toThrow(ZodError);
        });        it('deve normalizar uma data inexistente para a data válida mais próxima', () => {
            const query = { data: '2025-02-30' }; // 30 de fevereiro não existe
            const result = MovimentacaoQuerySchema.parse(query);
            expect(result.data).toBeInstanceOf(Date);
            expect(result.data.toISOString().startsWith('2025-03-02')).toBe(true);
        });

        it('deve aceitar quando data não é fornecida', () => {
            const query = {};
            const result = MovimentacaoQuerySchema.parse(query);
            expect(result.data).toBeUndefined();
        });
    });

    describe('Validação de quantidade', () => {
        it('deve transformar quantidade de string para número', () => {
            const query = { quantidade: '10' };
            const result = MovimentacaoQuerySchema.parse(query);
            expect(result.quantidade).toBe(10);
            expect(typeof result.quantidade).toBe('number');
        });

        it('deve rejeitar quando quantidade não é um número inteiro válido', () => {
            const query = { quantidade: 'abc' };
            expect(() => MovimentacaoQuerySchema.parse(query)).toThrow(ZodError);
        });

        it('deve aceitar quando quantidade não é fornecida', () => {
            const query = {};
            const result = MovimentacaoQuerySchema.parse(query);
            expect(result.quantidade).toBeUndefined();
        });
    });

    describe('Validação de componente', () => {
        it('deve aceitar e fazer trim em um componente válido', () => {
            const query = { componente: '  64f234a0c781a7b30c2fe445  ' };
            const result = MovimentacaoQuerySchema.parse(query);
            expect(result.componente).toBe('64f234a0c781a7b30c2fe445');
        });

        it('deve aceitar quando componente não é fornecido', () => {
            const query = {};
            const result = MovimentacaoQuerySchema.parse(query);
            expect(result.componente).toBeUndefined();
        });
    });

    describe('Validação de fornecedor', () => {
        it('deve aceitar e fazer trim em um fornecedor válido', () => {
            const query = { fornecedor: '  64f234a0c781a7b30c2fe446  ' };
            const result = MovimentacaoQuerySchema.parse(query);
            expect(result.fornecedor).toBe('64f234a0c781a7b30c2fe446');
        });

        it('deve aceitar quando fornecedor não é fornecido', () => {
            const query = {};
            const result = MovimentacaoQuerySchema.parse(query);
            expect(result.fornecedor).toBeUndefined();
        });
    });

    describe('Cenários completos', () => {
        it('deve validar um query completo com todos os campos', () => {
            const query = {
                tipo: 'entrada',
                data: '2025-05-28',
                quantidade: '10',
                componente: '64f234a0c781a7b30c2fe445',
                fornecedor: '64f234a0c781a7b30c2fe446'
            };
            const result = MovimentacaoQuerySchema.parse(query);
            expect(result).toEqual({
                tipo: 'entrada',
                data: new Date('2025-05-28T00:00:00Z'),
                quantidade: 10,
                componente: '64f234a0c781a7b30c2fe445',
                fornecedor: '64f234a0c781a7b30c2fe446'
            });
        });

        it('deve validar um query com campos parciais', () => {
            const query = {
                tipo: 'saida',
                componente: '64f234a0c781a7b30c2fe445'
            };
            const result = MovimentacaoQuerySchema.parse(query);
            expect(result).toEqual({
                tipo: 'saida',
                componente: '64f234a0c781a7b30c2fe445'
            });
        });

        it('deve validar um query vazio', () => {
            const query = {};
            const result = MovimentacaoQuerySchema.parse(query);
            expect(result).toEqual({});
        });

        it('deve rejeitar um query com múltiplos campos inválidos', () => {
            const query = {
                tipo: 'invalido',
                data: '28/05/2025',
                quantidade: 'abc'
            };
            expect(() => MovimentacaoQuerySchema.parse(query)).toThrow(ZodError);
        });
    });
});