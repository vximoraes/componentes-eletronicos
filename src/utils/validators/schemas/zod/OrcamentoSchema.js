import { z } from 'zod';
import objectIdSchema from './ObjectIdSchema.js';

const ComponenteOrcamentoSchema = z.object({
    nome: z
        .string()
        .refine((val) => !val || val.trim().length > 0, {
            message: "Nome não pode ser vazio",
        })
        .transform((val) => val?.trim()),
    fornecedor: z
        .string()
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
        .transform((val) => (val ? parseFloat(val) : undefined))
        .refine((val) => val === undefined || (!isNaN(val) && typeof val === "number"), {
            message: "Valor unitário deve ser um número válido.",
        }),
    subtotal: z
        .string()
        .transform((val) => (val ? parseFloat(val) : undefined))
        .refine((val) => val === undefined || (!isNaN(val) && typeof val === "number"), {
            message: "Subtotal deve ser um número válido.",
        }),
});

const OrcamentoSchema = z.object({
    nome: z
        .string()
        .optional()
        .refine((val) => !val || val.trim().length > 0, {
            message: "Nome não pode ser vazio",
        })
        .transform((val) => val?.trim()),
    protocolo: z
        .string()
        .optional()
        .refine((val) => !val || val.trim().length > 0, {
            message: "Protocolo não pode ser vazio",
        })
        .transform((val) => val?.trim()),
    descricao: z
        .string()
        .optional(),
    valor: z
        .string()
        .transform((val) => (val ? parseFloat(val) : undefined))
        .refine((val) => val === undefined || (!isNaN(val) && typeof val === "number"), {
            message: "Valor deve ser um número válido.",
        }),
    componente_orcamento: z.array(ComponenteOrcamentoSchema),
});

const OrcamentoUpdateSchema = OrcamentoSchema.partial();

export { OrcamentoSchema, OrcamentoUpdateSchema };