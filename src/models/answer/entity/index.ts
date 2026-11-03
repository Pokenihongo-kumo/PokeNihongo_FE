import { at, byUser } from "@models/common/response";
import z from "zod";

export const AnswerEntitySchema = z.object({
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
    ...byUser,
    ...at,
});

export type AnswerEntityType = z.infer<typeof AnswerEntitySchema>;
