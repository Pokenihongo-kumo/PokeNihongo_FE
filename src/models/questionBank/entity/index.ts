import { at, byUser } from "@models/common/response";
import z from "zod";
import { QUESTION_TYPE } from "@constants/questionBank";

export const QuestionEntitySchema = z.object({
    id: z.number(),
    questionJp: z.string(),
    questionType: z.enum(Object.values(QUESTION_TYPE) as [string, ...string[]]),
    audioUrl: z.string().nullable(),
    pronunciation: z.string().optional(),
    levelN: z.number(),
    meaning: z.string().optional(), // Keep for backward compatibility
    meanings: z
        .array(
            z.union([
                // New API format
                z.object({
                    language: z.string(),
                    value: z.string(),
                }),
                // Old format for backward compatibility
                z.object({
                    translations: z.object({
                        vi: z.string(),
                        en: z.string(),
                    }),
                }),
            ]),
        )
        .optional(),
    answers: z
        .array(
            z.object({
                id: z.number(),
                answerJp: z.string(),
                isCorrect: z.boolean(),
                translations: z.object({
                    meaning: z.array(
                        z.object({
                            language_code: z.string(),
                            value: z.string(),
                        }),
                    ),
                }),
            }),
        )
        .optional(),
    ...byUser,
    ...at,
});

export type QuestionEntityType = z.infer<typeof QuestionEntitySchema>;
