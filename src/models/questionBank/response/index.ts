import { PaginationMetaSchema, PaginationResponseSchema } from "@models/common/response";
import { QuestionEntitySchema } from "../entity";
import z from "zod";

export const QuestionResponseSchema = PaginationResponseSchema.extend({
    data: z.object({
        data: z.object({
            results: z.array(QuestionEntitySchema),
            pagination: PaginationMetaSchema,
        }),
    }),
});

export type QuestionResponseType = z.infer<typeof QuestionResponseSchema>;
