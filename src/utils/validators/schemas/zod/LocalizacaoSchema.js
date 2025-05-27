import { z } from 'zod';

const LocalizacaoSchema = z.object({
    nome: z
        .string()
        .min(1, 'Campo nome é obrigatório.'),
    ativo: z
        .boolean()
        .default(true),
});

const LocalizacaoUpdateSchema = LocalizacaoSchema
    .partial();

export { LocalizacaoSchema, LocalizacaoUpdateSchema };