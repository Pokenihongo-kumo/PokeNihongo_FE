import { PaginationMetaSchema } from "@models/common/response";
import z from "zod";

export const AnswerResponseSchema = z.object({
    id: z.number(),
    answerJp: z.string(),
    isCorrect: z.boolean(),
    questionBankId: z.number(),
    translations: z.object({
        meaning: z.array(
            z.object({
                language_code: z.string(),
                value: z.string(),
            }),
        ),
    }),
    createdBy: z.number(),
    updatedBy: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type AnswerResponseType = z.infer<typeof AnswerResponseSchema>;

export const AnswerListResponseSchema = z.object({
    data: z.object({
        data: z.object({
            results: z.array(AnswerResponseSchema),
            pagination: PaginationMetaSchema,
        }),
    }),
});

export type AnswerListResponseType = z.infer<typeof AnswerListResponseSchema>;
