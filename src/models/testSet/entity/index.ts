import z from "zod";

export const TestSetEntitySchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    content: z.string(),
    audioUrl: z.string().nullable(),
    price: z.number().nullable(),
    levelN: z.number(),
    testType: z.enum(["VOCABULARY", "GRAMMAR", "KANJI", "LISTENING", "READING", "SPEAKING", "GENERAL"]),
    status: z.enum(["DRAFT", "ACTIVE", "INACTIVE"]),
    creatorId: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type TestSetEntity = z.infer<typeof TestSetEntitySchema>;
