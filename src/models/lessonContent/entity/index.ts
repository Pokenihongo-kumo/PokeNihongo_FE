import { z } from "zod";

export const LessonContentSchema = z.object({
    id: z.number(),
    lessonId: z.number(),
    contentId: z.number(),
    contentType: z.string(), // Vocabulary, Grammar, Kanji, etc.
    contentOrder: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    lesson: z.object({
        id: z.number(),
        slug: z.string(),
        titleKey: z.string(),
    }),
});

export type LessonContent = z.infer<typeof LessonContentSchema>;

export const LessonContentListResponseSchema = z.object({
    data: z.array(LessonContentSchema),
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    message: z.string(),
});

export type LessonContentListResponseType = z.infer<typeof LessonContentListResponseSchema>;

export const CreateLessonContentSchema = z.object({
    lessonId: z.number(),
    contentId: z.array(z.number()),
    contentType: z.string(),
});

export type ICreateLessonContentRequest = z.infer<typeof CreateLessonContentSchema>;
