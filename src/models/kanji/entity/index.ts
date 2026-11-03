import { z } from "zod";

/**
 * Kanji schema
 */
export const KanjiSchema = z.object({
    id: z.number(),
    character: z.string().min(1, "Ký tự Kanji không được để trống").max(10, "Ký tự Kanji quá dài (tối đa 10 ký tự)"),
    meaningKey: z.string().min(1, "Key nghĩa không được để trống").max(200, "Key nghĩa quá dài (tối đa 200 ký tự)"),
    strokeCount: z
        .number()
        .min(1, "Số nét vẽ phải lớn hơn 0")
        .max(50, "Số nét vẽ quá lớn (tối đa 50 nét)")
        .nullable()
        .optional(),
    jlptLevel: z.number().min(1, "Cấp độ JLPT phải từ 1-5").max(5, "Cấp độ JLPT phải từ 1-5").nullable().optional(),
    img: z.string().max(500, "URL hình ảnh quá dài (tối đa 500 ký tự)").nullable().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
export type Kanji = z.infer<typeof KanjiSchema>;
//-------------------------------End-------------------------------//

/**
 * Kanji management schema
 */
export const KanjiManagementSchema = z.object({
    id: z.number(),
    kanji: z.string().min(1, "Ký tự Kanji không được để trống").max(10, "Ký tự Kanji quá dài (tối đa 10 ký tự)"),
    meaning: z.string().min(1, "Key nghĩa không được để trống").max(200, "Key nghĩa quá dài (tối đa 200 ký tự)"),
    strokeCount: z
        .number()
        .min(1, "Số nét vẽ phải lớn hơn 0")
        .max(50, "Số nét vẽ quá lớn (tối đa 50 nét)")
        .nullable()
        .optional(),
    jlptLevel: z.number().min(1, "Cấp độ JLPT phải từ 1-5").max(5, "Cấp độ JLPT phải từ 1-5").nullable().optional(),
    onyomi: z.string().max(500, "Onyomi quá dài (tối đa 500 ký tự)").nullable().optional(),
    kunyomi: z.string().max(500, "Kunyomi quá dài (tối đa 500 ký tự)").nullable().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
export type KanjiManagement = z.infer<typeof KanjiManagementSchema>;
//-------------------------------End-------------------------------//
