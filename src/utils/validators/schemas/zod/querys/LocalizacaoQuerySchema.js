import { z } from "zod";
import mongoose from 'mongoose';

export const LocalizacaoIdSchema = z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "ID inválido",
});

export const LocalizacaoQuerySchema = z.object({    nome: z
        .string()
        .optional()
        .transform((val) => {
            return val === undefined ? undefined : (val.trim() || null);
        })
        .refine((val) => val === undefined || val !== null, {
            message: "Nome não pode ser vazio",
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
