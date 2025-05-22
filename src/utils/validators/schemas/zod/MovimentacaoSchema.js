import { z } from 'zod';
import objectIdSchema from './ObjectIdSchema.js';

const MovimentacaoSchema = z.object({
    tipo: z
        .string()
        .optional()
        .refine((val) => !val || val === "entrada" || val === "saida", {
            message: "Tipo deve ser 'entrada' ou 'saida'",
        }),
    data_hora: z
        .string()
        .optional()
        .refine((val) => !val || /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/.test(val), {
            message: "Data/hora deve estar no formato YYYY-MM-DD HH:mm ou YYYY-MM-DD HH:mm:ss",
        })
        .transform((val) => (val ? new Date(val.replace(' ', 'T')) : undefined))
        .refine((val) => val === undefined || (val instanceof Date && !isNaN(val)), {
            message: "Data/hora deve ser uma data válida",
        }),
    quantidade: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val) : undefined))
        .refine((val) => val === undefined || Number.isInteger(val), {
            message: "Quantidade deve ser um número inteiro",
        }),
    componente:
        objectIdSchema,
    fornecedor: 
        objectIdSchema,
});

const MovimentacaoUpdateSchema = MovimentacaoSchema.partial();

export { MovimentacaoSchema, MovimentacaoUpdateSchema };