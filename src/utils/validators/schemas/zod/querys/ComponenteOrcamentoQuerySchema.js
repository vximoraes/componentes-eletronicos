import { z } from "zod";
import mongoose from 'mongoose';

export const ComponenteOrcamentoIdSchema = z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "ID inválido",
});

export const ComponenteOrcamentoQuerySchema = z.object({
    nome: z
        .string()
        .optional()
        .refine((val) => !val || val.trim().length > 0, {
            message: "Nome não pode ser vazio",
        })
        .transform((val) => val?.trim()),

    fornecedor: z
        .string()
        .optional()
        .refine((val) => !val || val.trim().length > 0, {
            message: "Fornecedor não pode ser vazio",
        })
        .transform((val) => val?.trim()),

    quantidade: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val) : undefined))
        .refine((val) => val === undefined || Number.isInteger(val), {
            message: "Quantidade deve ser um número inteiro",
        }),

    valor_unitario: z
        .string()
        .optional()
        .transform((val) => (val ? parseFloat(val) : undefined))
        .refine((val) => val === undefined || !isNaN(val), {
            message: "Valor unitário deve ser um número",
        }),

    subtotal: z
        .string()
        .optional()
        .transform((val) => (val ? parseFloat(val) : undefined))
        .refine((val) => val === undefined || !isNaN(val), {
            message: "Subtotal deve ser um número",
        }),

    page: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 1))
        .refine((val) => Number.isInteger(val) && val > 0, {
            message: "Page deve ser um número inteiro maior que 0",
        }),

    limite: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 10))
        .refine((val) => Number.isInteger(val) && val > 0 && val <= 100, {
            message: "Limite deve ser um número inteiro entre 1 e 100",
        }),
});
