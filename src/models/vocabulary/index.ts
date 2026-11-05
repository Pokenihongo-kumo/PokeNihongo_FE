import { z } from "zod";
import { pageSchema } from "@utils/api-response";

/**
 * Vocabulary as returned by GET /vocabulary, PUT /vocabulary/by-word/:wordJp
 * and DELETE /vocabulary/:id (wordType.name is translated by the backend)
 */
export const VocabularySchema = z.object({
    id: z.number(),
    wordJp: z.string(),
    reading: z.string(),
    imageUrl: z.string().nullish(),
    audioUrl: z.string().nullish(),
    levelN: z.number().nullish(),
    wordType: z
        .object({
            id: z.number(),
            nameKey: z.string(),
            name: z.string().optional(),
        })
        .nullish(),
});
export type IVocabulary = z.infer<typeof VocabularySchema>;

export const VocabularyListSchema = pageSchema(VocabularySchema);
export type IVocabularyList = z.infer<typeof VocabularyListSchema>;

/**
 * GET /vocabulary/statistics
 */
export const VocabularyStatisticsSchema = z.object({
    totalVocabulary: z.number(),
    totalKanji: z.number(),
    vocabularyN5: z.number(),
    vocabularyN4: z.number(),
    vocabularyN3: z.number(),
    vocabularyN2: z.number(),
    vocabularyN1: z.number(),
});
export type IVocabularyStatistics = z.infer<typeof VocabularyStatisticsSchema>;

/**
 * POST /vocabulary/full: isNew is false when the word existed and only a meaning was added
 */
export const CreateVocabularyFullResultSchema = z.object({
    vocabulary: z.object({ id: z.number(), wordJp: z.string() }),
    isNew: z.boolean(),
});
//----------------------End----------------------//
