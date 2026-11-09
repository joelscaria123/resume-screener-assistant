
import { z } from "zod";

export const historyQuerySchema = z.object({
  search: z.string().trim().max(200).default(""),
  minScore: z.coerce.number().int().min(0).max(100).optional(),
  maxScore: z.coerce.number().int().min(0).max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type HistoryQuery = z.infer<typeof historyQuerySchema>;
