import { z } from 'zod';

export const produtoSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres' }),
  quantidade: z.number().int({ message: 'A quantidade deve ser um número inteiro' }).min(0, { message: 'A quantidade não pode ser negativa' }).optional().default(0),
  quantidadeMinima: z.number().int({ message: 'A quantidade mínima deve ser um número inteiro' }).min(0, { message: 'A quantidade mínima não pode ser negativa' }).optional().default(0),
  preco: z.number().min(0.01, { message: 'O preço deve ser maior que zero' }),
  categoriaId: z.string().min(1, { message: 'Selecione uma categoria' }),
  observacao: z.string().optional(),
  foto: z.string().optional(),
});

export type ProdutoFormData = z.infer<typeof produtoSchema>;
