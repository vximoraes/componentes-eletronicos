import { z } from "zod";

export const notificacaoSchema = z.object({
  mensagem: z.string().min(1, "Mensagem é obrigatória"),
  data_hora: z.coerce.date().optional(),
  visualizacao: z.coerce.date().nullable().optional(),
  usuario: z.string().min(1, "ID do usuário é obrigatório")
});
