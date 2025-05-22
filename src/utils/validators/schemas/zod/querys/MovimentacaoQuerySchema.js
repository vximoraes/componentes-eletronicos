import { z } from "zod";
import mongoose from 'mongoose';

export const MovimentacaoIdSchema = z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "ID inválido",
});

export const MovimentacaoQuerySchema = z.object({
    tipo: z
        .string()
        .optional()
        .refine((val) => !val || val === "entrada" || val === "saida", {
            message: "Tipo deve ser 'entrada' ou 'saida'",
        }),
    data: z
        .string()
        .optional()
        .refine((val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val), {
            message: "Data deve estar no formato YYYY-MM-DD",
        })
        .transform((val) => (val ? new Date(val + "T00:00:00Z") : undefined))
        .refine((val) => val === undefined || (val instanceof Date && !isNaN(val)), {
            message: "Data deve ser uma data válida",
        }),
    quantidade: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val) : undefined))
        .refine((val) => val === undefined || Number.isInteger(val), {
            message: "Quantidade deve ser um número inteiro",
        }),
    componente: z
        .string()
        .optional()
        .transform((val) => val?.trim()),
    fornecedor: z
        .string()
        .optional()
        .transform((val) => val?.trim()),
});
