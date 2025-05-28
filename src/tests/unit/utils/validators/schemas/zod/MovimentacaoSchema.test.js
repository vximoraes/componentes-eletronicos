import { MovimentacaoSchema, MovimentacaoUpdateSchema } from '../../../../../../utils/validators/schemas/zod/MovimentacaoSchema.js';
import { ZodError } from 'zod';

describe('MovimentacaoSchema', () => {
    describe('Validação de tipo', () => {
        it('deve aceitar quando tipo é entrada', () => {
            const data = {
                tipo: 'entrada',
                componente: '64f234a0c781a7b30c2fe445',
                quantidade: '10',
                fornecedor: '64f234a0c781a7b30c2fe446'
            };
            const result = MovimentacaoSchema.parse(data);
            expect(result).toEqual(expect.objectContaining({
                tipo: 'entrada',
                componente: '64f234a0c781a7b30c2fe445',
                quantidade: 10,
                fornecedor: '64f234a0c781a7b30c2fe446'
            }));
        });

        it('deve aceitar quando tipo é saida', () => {
            const data = {
                tipo: 'saida',
                componente: '64f234a0c781a7b30c2fe445',
                quantidade: '5'
            };
            const result = MovimentacaoSchema.parse(data);
            expect(result).toEqual(expect.objectContaining({
                tipo: 'saida',
                componente: '64f234a0c781a7b30c2fe445',
                quantidade: 5
            }));
        });

        it('deve rejeitar quando tipo é inválido', () => {
            const data = {
                tipo: 'invalido',
                componente: '64f234a0c781a7b30c2fe445',
                quantidade: '10'
            };
            expect(() => MovimentacaoSchema.parse(data)).toThrow(ZodError);
        });

        it('deve aceitar quando tipo não é fornecido (opcional)', () => {
            const data = {
                componente: '64f234a0c781a7b30c2fe445',
                quantidade: '10'
            };
            const result = MovimentacaoSchema.parse(data);
            expect(result).toEqual(expect.objectContaining({
                componente: '64f234a0c781a7b30c2fe445',
                quantidade: 10
            }));
            expect(result.tipo).toBeUndefined();
        });
    });

    describe('Validação de data_hora', () => {
        it('deve rejeitar quando data_hora é fornecida', () => {
            const data = {
                tipo: 'entrada',
                componente: '64f234a0c781a7b30c2fe445',
                quantidade: '10',
                data_hora: '2025-05-28T10:00:00Z'
            };
            expect(() => MovimentacaoSchema.parse(data)).toThrow(ZodError);
        });

        it('deve aceitar quando data_hora não é fornecida', () => {
            const data = {
                tipo: 'entrada',
                componente: '64f234a0c781a7b30c2fe445',
                quantidade: '10'
            };
            const result = MovimentacaoSchema.parse(data);
            expect(result.data_hora).toBeUndefined();
        });
    });

    describe('Validação de quantidade', () => {
        it('deve transformar quantidade de string para número', () => {
            const data = {
                tipo: 'entrada',
                componente: '64f234a0c781a7b30c2fe445',
                quantidade: '10'
            };
            const result = MovimentacaoSchema.parse(data);
            expect(result.quantidade).toBe(10);
            expect(typeof result.quantidade).toBe('number');
        });

        it('deve aceitar quando quantidade não é fornecida (opcional)', () => {
            const data = {
                tipo: 'entrada',
                componente: '64f234a0c781a7b30c2fe445'
            };
            const result = MovimentacaoSchema.parse(data);
            expect(result.quantidade).toBeUndefined();
        });

        it('deve rejeitar quando quantidade não é um número inteiro válido', () => {
            const data = {
                tipo: 'entrada',
                componente: '64f234a0c781a7b30c2fe445',
                quantidade: 'abc'
            };
            expect(() => MovimentacaoSchema.parse(data)).toThrow(ZodError);
        });
    });

    describe('Validação de componente', () => {
        it('deve aceitar quando componente é um ObjectId válido', () => {
            const data = {
                tipo: 'entrada',
                componente: '64f234a0c781a7b30c2fe445',
                quantidade: '10'
            };
            const result = MovimentacaoSchema.parse(data);
            expect(result.componente).toBe('64f234a0c781a7b30c2fe445');
        });

        it('deve rejeitar quando componente não é fornecido', () => {
            const data = {
                tipo: 'entrada',
                quantidade: '10'
            };
            expect(() => MovimentacaoSchema.parse(data)).toThrow(ZodError);
        });

        it('deve rejeitar quando componente não é um ObjectId válido', () => {
            const data = {
                tipo: 'entrada',
                componente: 'invalid-id',
                quantidade: '10'
            };
            expect(() => MovimentacaoSchema.parse(data)).toThrow(ZodError);
        });
    });

    describe('Validação de fornecedor', () => {
        it('deve aceitar quando fornecedor é um ObjectId válido', () => {
            const data = {
                tipo: 'entrada',
                componente: '64f234a0c781a7b30c2fe445',
                quantidade: '10',
                fornecedor: '64f234a0c781a7b30c2fe446'
            };
            const result = MovimentacaoSchema.parse(data);
            expect(result.fornecedor).toBe('64f234a0c781a7b30c2fe446');
        });

        it('deve aceitar quando fornecedor não é fornecido (opcional)', () => {
            const data = {
                tipo: 'saida',
                componente: '64f234a0c781a7b30c2fe445',
                quantidade: '5'
            };
            const result = MovimentacaoSchema.parse(data);
            expect(result.fornecedor).toBeUndefined();
        });

        it('deve rejeitar quando fornecedor não é um ObjectId válido', () => {
            const data = {
                tipo: 'entrada',
                componente: '64f234a0c781a7b30c2fe445',
                quantidade: '10',
                fornecedor: 'invalid-id'
            };
            expect(() => MovimentacaoSchema.parse(data)).toThrow(ZodError);
        });
    });

    describe('Cenários completos', () => {
        it('deve validar uma movimentação de entrada completa', () => {
            const data = {
                tipo: 'entrada',
                componente: '64f234a0c781a7b30c2fe445',
                quantidade: '10',
                fornecedor: '64f234a0c781a7b30c2fe446'
            };
            const result = MovimentacaoSchema.parse(data);
            expect(result).toEqual({
                tipo: 'entrada',
                componente: '64f234a0c781a7b30c2fe445',
                quantidade: 10,
                fornecedor: '64f234a0c781a7b30c2fe446'
            });
        });

        it('deve validar uma movimentação de saída sem fornecedor', () => {
            const data = {
                tipo: 'saida',
                componente: '64f234a0c781a7b30c2fe445',
                quantidade: '5'
            };
            const result = MovimentacaoSchema.parse(data);
            expect(result).toEqual({
                tipo: 'saida',
                componente: '64f234a0c781a7b30c2fe445',
                quantidade: 5
            });
        });

        it('deve rejeitar uma movimentação com múltiplos campos inválidos', () => {
            const data = {
                tipo: 'invalido',
                componente: 'invalid-id',
                quantidade: 'abc',
                data_hora: '2025-05-28T10:00:00Z'
            };
            expect(() => MovimentacaoSchema.parse(data)).toThrow(ZodError);
        });
    });
});

describe('MovimentacaoUpdateSchema', () => {
    it('deve permitir atualização parcial - apenas quantidade', () => {
        const updateData = {
            quantidade: '20'
        };
        const result = MovimentacaoUpdateSchema.parse(updateData);
        expect(result).toEqual({
            quantidade: 20
        });
    });

    it('deve permitir atualização parcial - apenas fornecedor', () => {
        const updateData = {
            fornecedor: '64f234a0c781a7b30c2fe447'
        };
        const result = MovimentacaoUpdateSchema.parse(updateData);
        expect(result).toEqual({
            fornecedor: '64f234a0c781a7b30c2fe447'
        });
    });

    it('deve rejeitar quando campo de atualização é inválido', () => {
        const updateData = {
            tipo: 'invalido'
        };
        expect(() => MovimentacaoUpdateSchema.parse(updateData)).toThrow(ZodError);
    });

    it('deve aceitar objeto vazio', () => {
        const updateData = {};
        const result = MovimentacaoUpdateSchema.parse(updateData);
        expect(result).toEqual({});
    });
});