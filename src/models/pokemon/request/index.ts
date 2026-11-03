import { z } from "zod";
import { RarityPokemon } from "@constants/pokemon";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const CreatePokemonFormSchema = z
    .object({
        pokedex_number: z.string().min(1, "Pokedex number is required."),
        nameTranslations: z.object({
            ja: z.string().min(1, "Japanese name is required."),
            en: z.string().min(1, "English name is required."),
            vi: z.string().min(1, "Vietnamese name is required."),
        }),
        nameJp: z.string().optional(), // Sẽ được tự động tạo từ nameTranslations.ja
        description: z.string().optional(),
        isStarted: z.boolean(),
        rarity: z.nativeEnum(RarityPokemon, {
            error: () => ({ message: "Please select a valid rarity." }),
        }),
        typeIds: z
            .array(z.number())
            .min(1, "Please select at least one type.")
            .max(2, "A Pokemon can have at most two types."),
        imageUrl: z.any().optional(),
    })
    .transform((data) => {
        // Tự động tạo nameJp từ nameTranslations.ja
        return {
            ...data,
            nameJp: data.nameTranslations.ja,
        };
    })
    .superRefine((data, ctx) => {
        if (data.imageUrl instanceof File) {
            if (data.imageUrl.size > MAX_FILE_SIZE) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Kích thước ảnh tối đa là 2MB.",
                    path: ["imageUrl"],
                });
            }
            if (!ACCEPTED_IMAGE_TYPES.includes(data.imageUrl.type)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Chỉ hỗ trợ các định dạng .jpg, .jpeg, .png và .webp.",
                    path: ["imageUrl"],
                });
            }
        } else if (typeof data.imageUrl === "string" && data.imageUrl.trim() !== "") {
            // Chỉ validate URL khi có giá trị và không phải chuỗi rỗng
            if (!z.string().url().safeParse(data.imageUrl).success) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "URL hình ảnh không hợp lệ.",
                    path: ["imageUrl"],
                });
            }
        }
        // Không validate khi imageUrl là chuỗi rỗng - sẽ xử lý trong component
    });

// Type cho form data (input)
export type ICreatePokemonFormData = {
    pokedex_number: string;
    nameTranslations: {
        ja: string;
        en: string;
        vi: string;
    };
    description?: string;
    isStarted: boolean;
    rarity: "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY";
    typeIds: number[];
    imageUrl?: any;
};

// Type cho output data (sau khi transform)
export type ICreatePokemonTransformedData = z.infer<typeof CreatePokemonFormSchema>;

export interface ICreatePokemonRequest {
    pokedex_number: number;
    nameTranslations: {
        jp: string;
        en: string;
        vi: string;
    };
    nameJp: string;
    description?: string;
    isStarted: boolean;
    imageUrl: string;
    rarity: typeof RarityPokemon;
    typeIds: number[];
}
