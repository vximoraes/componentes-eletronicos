import { z } from "zod";

export const NotificacaoSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  mensagem: z.string().min(1, "Mensagem é obrigatória"),
  usuario: z.string().optional(),
  visualizada: z.boolean().optional(),
  data: z.date().optional()
});

