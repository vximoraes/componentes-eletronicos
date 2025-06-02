import { z } from 'zod';
import mongoose from 'mongoose';

const NotificacaoSchema = z.object({
  mensagem: z
    .string()
    .min(1, 'Campo mensagem é obrigatório.')
    .max(500, 'A mensagem deve ter no máximo 500 caracteres.'),
  
 usuario: z
  .string()
  .refine((id) => !id || mongoose.Types.ObjectId.isValid(id), {
    message: "ID de usuário inválido",
  }), 
  
  visualizada: z
    .boolean()
    .default(false),
  
  dataLeitura: z
    .date()
    .optional(),
  
  dataExpiracao: z
    .date()
    .optional(),
});

const NotificacaoUpdateSchema = NotificacaoSchema.partial();

export { NotificacaoSchema, NotificacaoUpdateSchema };