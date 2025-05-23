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
        .refine((val) => val === undefined, {
            message: 'O campo data/hora não pode ser informado. Ele é preenchido automaticamente com a data/hora atual.',
        })
        .optional(),
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
        objectIdSchema
        .optional(),
});

const MovimentacaoUpdateSchema = MovimentacaoSchema.partial();

export { MovimentacaoSchema, MovimentacaoUpdateSchema };