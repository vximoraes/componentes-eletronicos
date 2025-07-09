import { z } from 'zod';

export const EmailSchema = z.object({
    email: z.string().email()
});