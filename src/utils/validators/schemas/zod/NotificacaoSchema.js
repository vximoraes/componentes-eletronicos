import { z } from 'zod';
import mongoose from 'mongoose';

const NotificacaoSchema = z.object({
  titulo: z
    .string()
    .min(1, 'Campo título é obrigatório.')
    .max(100, 'O título deve ter no máximo 100 caracteres.'),
  
  mensagem: z
    .string()
    .min(1, 'Campo mensagem é obrigatório.')
    .max(500, 'A mensagem deve ter no máximo 500 caracteres.'),
  
  usuario: z
    .string()
    .refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: "ID de usuário inválido",
    }),
  
  lida: z
    .boolean()
    .default(false),
  
  dataLeitura: z
    .date()
    .optional(),
  
  dataExpiracao: z
    .date()
    .optional(),
});

const NotificacaoUpdateSchema = NotificacaoSchema
  .partial()
  .extend({
    lida: z.boolean().optional(),
    dataLeitura: z.date().optional()
  });

export { NotificacaoSchema, NotificacaoUpdateSchema };