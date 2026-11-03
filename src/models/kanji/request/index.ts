import z from "zod";

/**
 * Kanji with meaning request
 */
export const KanjiWithMeaningRequest = z.object({
    character: z.string(),
    strokeCount: z.number(),
    jlptLevel: z.number().min(1).max(5),
    image: z.any(),
    readings: z.array(
        z.object({
            readingType: z.string(),
            reading: z.string(),
        }),
    ),
    meanings: z.array(
        z.object({
            translations: z.object({
                vi: z.string(),
                en: z.string(),
            }),
        }),
    ),
});
export type IKanjiWithMeaningRequest = z.infer<typeof KanjiWithMeaningRequest>;
//-----------------End-Login-Request-----------------//
