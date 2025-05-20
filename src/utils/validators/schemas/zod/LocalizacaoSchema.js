import { z } from 'zod';
import objectIdSchema from './ObjectIdSchema.js';
// import { RotaSchema } from './RotaSchema.js';

// Validação de array de ObjectId sem duplicações.
const distinctObjectIdArray = z
    .array(objectIdSchema)
    .refine(
        (arr) => new Set(arr.map((id) => id.toString())).size === arr.length,
        { message: 'Não pode conter ids repetidos.' }
    );

const LocalizacaoSchema = z.object({
    nome: z.string().min(1, 'Campo nome é obrigatório.'),
    ativo: z.boolean().default(true),
});

const LocalizacaoUpdateSchema = LocalizacaoSchema
    .partial();

export { LocalizacaoSchema, LocalizacaoUpdateSchema };