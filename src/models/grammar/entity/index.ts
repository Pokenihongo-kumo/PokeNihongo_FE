import { at, byUser } from "@models/common/response";
import { z } from "zod";

export const GrammarSchema = z.object({
    id: z.number(),
    title: z.string(),
    description: z.string().optional(),
    levelN: z.number(),
    examples: z
        .array(
            z.object({
                japanese: z.string(),
                translation: z.string(),
            }),
        )
        .optional(),
    usage: z.string().optional(),
    audioUrl: z.string().optional(),
    imageUrl: z.string().optional(),
    translations: z
        .object({
            meaning: z.array(
                z.object({
                    language_code: z.string(),
                    value: z.string(),
                }),
            ),
        })
        .optional(),
    ...at,
    ...byUser,
});

export type Grammar = z.infer<typeof GrammarSchema>;
