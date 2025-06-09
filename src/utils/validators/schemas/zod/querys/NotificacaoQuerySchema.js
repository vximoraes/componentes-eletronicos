import { z } from "zod";
import mongoose from 'mongoose';

export const NotificacaoIdSchema = z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "ID inválido",
});

export const NotificacaoQuerySchema = z.object({
    usuario: z
        .string()
        .optional()
        .refine((val) => !val || mongoose.Types.ObjectId.isValid(val), {
            message: "ID de usuário inválido",
        }),
    visualizada: z
        .string()
        .optional()
        .refine((value) => !value || value === "true" || value === "false", {
            message: "Lida deve ser 'true' ou 'false'",
        }),
    dataInicial: z
        .date()
        .optional(),
    dataFinal: z
        .date()
        .optional(),
});