import { z } from "zod";

export const loginSchema = z.object({
  cpf: z.string().optional(),
  email: z.string().optional(),
  usuario: z.string().optional(),
  senha: z.string(),
});