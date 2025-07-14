import { z } from 'zod';

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
        .union([z.string(), z.number()])
        .transform((val) => (val ? parseInt(val) : undefined))
        .refine((val) => val === undefined || (Number.isInteger(val) && val > 0), {
            message: "Quantidade deve ser um número inteiro maior que zero",
        }),
    valor_unitario: z
        .union([z.string(), z.number()])
        .transform((val) => (val ? parseFloat(val) : undefined))
        .refine((val) => val === undefined || (!isNaN(val) && typeof val === "number"), {
            message: "Valor unitário deve ser um número válido.",
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
    descricao: z
        .string()
        .optional(),
    componente_orcamento: z
        .array(ComponenteOrcamentoSchema)
        .min(1, { message: "Deve haver pelo menos um componente no orçamento." }),
});

const OrcamentoUpdateSchema = OrcamentoSchema.omit({ componente_orcamento: true }).partial();
const ComponenteOrcamentoUpdateSchema = ComponenteOrcamentoSchema.partial();

export { OrcamentoSchema, OrcamentoUpdateSchema, ComponenteOrcamentoSchema, ComponenteOrcamentoUpdateSchema };
