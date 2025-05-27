import { z } from 'zod';

const CategoriaSchema = z.object({
    nome: z
        .string()
        .min(1, 'Campo nome é obrigatório.'),
    ativo: z
        .boolean()
        .default(true),
});

const CategoriaUpdateSchema = CategoriaSchema
    .partial();

export { CategoriaSchema, CategoriaUpdateSchema };