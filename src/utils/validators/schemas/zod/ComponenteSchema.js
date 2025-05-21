import { z } from 'zod';
import objectIdSchema from './ObjectIdSchema.js';

const ComponenteSchema = z.object({
    nome: z
        .string()
        .refine((val) => !val || val.trim().length > 0, {
            message: "Nome não pode ser vazio",
        })
        .transform((val) => val?.trim()),
    quantidade: z
        .string()
        .transform((val) => (val ? parseInt(val) : undefined))
        .refine((val) => val === undefined || Number.isInteger(val), {
            message: "Quantidade deve ser um número inteiro",
        }),
    estoque_minimo: z
        .string()
        .transform((val) => (val ? parseInt(val) : undefined))
        .refine((val) => val === undefined || Number.isInteger(val), {
            message: "Quantidade deve ser um número inteiro",
        }),
    valor_unitario: z
        .string()
        .transform((val) => (val ? parseFloat(val) : undefined))
        .refine((val) => val === undefined || (!isNaN(val) && typeof val === "number"), {
            message: "Valor unitário deve ser um número válido.",
        }),
    descricao: z
        .string()
        .optional(),
    imagem: z
        .string()
        .optional(),
    localizacao:
        objectIdSchema,
    categoria: 
        objectIdSchema,
    ativo: z
        .boolean()
        .default(true),
});

const ComponenteUpdateSchema = ComponenteSchema.partial();

export { ComponenteSchema, ComponenteUpdateSchema };