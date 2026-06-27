import { z } from "zod";

export const VALID_STATUSES = ["New", "In Review", "Needs Info", "Completed"] as const;

export const createQuoteSchema = z.object({
  customer: z.string({ required_error: "customer is required" }).min(1, "customer cannot be empty"),
  project: z.string({ required_error: "project is required" }).min(1, "project cannot be empty"),
  estimated_value: z
    .number({ required_error: "estimated_value is required" })
    .nonnegative("estimated_value cannot be negative"),
  status: z.enum(VALID_STATUSES).optional().default("New"),
});

export const updateStatusSchema = z.object({
  status: z.enum(VALID_STATUSES, {
    errorMap: () => ({
      message: `status must be one of: ${VALID_STATUSES.join(", ")}`,
    }),
  }),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  search: z.string().optional(),
});

export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
