import { describe, expect, it } from "vitest";
import { CreateVocabularyFullResultSchema, VocabularyListSchema, VocabularyStatisticsSchema } from "./index";

// Shapes as serialized by the backend (VocabularyListResSchema, POST /vocabulary/full)
const listPayload = {
    results: [
        {
            id: 7,
            wordJp: "猫",
            reading: "ねこ",
            imageUrl: null,
            audioUrl: "https://cdn.example/neko.mp3",
            levelN: 5,
            wordType: { id: 1, nameKey: "wordtype.noun", name: "Danh từ" },
            createdById: 1,
            createdAt: "2026-11-05T00:00:00.000Z",
            updatedAt: "2026-11-05T00:00:00.000Z",
        },
        { id: 8, wordJp: "走る", reading: "はしる", levelN: null, wordType: null },
    ],
    pagination: { current: 1, pageSize: 15, totalPage: 1, totalItem: 2 },
};

describe("vocabulary models", () => {
    it("parses the list, keeping nullable fields and dropping audit fields", () => {
        const page = VocabularyListSchema.parse(listPayload);

        expect(page.results[0]).toEqual({
            id: 7,
            wordJp: "猫",
            reading: "ねこ",
            imageUrl: null,
            audioUrl: "https://cdn.example/neko.mp3",
            levelN: 5,
            wordType: { id: 1, nameKey: "wordtype.noun", name: "Danh từ" },
        });
        expect(page.results[1].wordType).toBeNull();
        expect(page.pagination.totalItem).toBe(2);
    });

    it("rejects a list item without the fields the table renders", () => {
        expect(() => VocabularyListSchema.parse({ ...listPayload, results: [{ id: 1 }] })).toThrow();
    });

    it("reads statistics and whether create added a new word or only a meaning", () => {
        expect(
            VocabularyStatisticsSchema.parse({
                totalVocabulary: 2,
                totalKanji: 1,
                vocabularyN5: 1,
                vocabularyN4: 0,
                vocabularyN3: 0,
                vocabularyN2: 0,
                vocabularyN1: 0,
            }).totalVocabulary,
        ).toBe(2);
        expect(
            CreateVocabularyFullResultSchema.parse({
                vocabulary: { id: 7, wordJp: "猫", reading: "ねこ" },
                meaning: { id: 3, translations: [], examples: [] },
                translationsCreated: 2,
                isNew: false,
            }).isNew,
        ).toBe(false);
    });
});
