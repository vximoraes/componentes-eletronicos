import { z } from 'zod';

const FornecedorSchema = z.object({
    nome: z
        .string()
        .min(1, 'Campo nome é obrigatório.'),
    ativo: z
        .boolean()
        .default(true),
});

const FornecedorUpdateSchema = FornecedorSchema
    .partial();

export { FornecedorSchema, FornecedorUpdateSchema };