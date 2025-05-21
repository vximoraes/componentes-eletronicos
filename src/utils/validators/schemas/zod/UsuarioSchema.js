import { z } from 'zod';

const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const UsuarioSchema = z.object({
  nome: z
    .string()
    .min(1, 'Campo nome é obrigatório.'),
  email: z
    .string()
    .email('Formato de email inválido.')
    .min(1, 'Campo email é obrigatório.'),
  senha: z
    .string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres.')
    .refine(
      (senha) => {
        // Senha é opcional.
        if (!senha) return true;
        return senhaRegex.test(senha);
      },
      {
        message:
          'A senha deve conter pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial.',
      }
    ),
  ativo: z
    .boolean()
    .default(true),
});

const UsuarioUpdateSchema = UsuarioSchema
  .omit({ email: true })
  .partial();

export { UsuarioSchema, UsuarioUpdateSchema };