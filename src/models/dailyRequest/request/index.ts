import { TranslationRequest } from "@models/common/request";
import z from "zod";

export const CreateDailyRequestSchema = z.object({
    conditionValue: z.number().min(1, "validation.conditionValueRequired"),
    dailyRequestType: z.enum([
        "DAILY_LOGIN",
        "DAILY_LESSON",
        "DAILY_EXERCISE",
        "STREAK_LOGIN",
        "STREAK_LESSON",
        "STREAK_EXCERCISE",
    ]),
    rewardId: z.number().min(1, "validation.rewardIdRequired"),
    isActive: z.boolean(),
    isStreak: z.boolean(),
    nameTranslations: z.array(TranslationRequest),
    descriptionTranslations: z.array(TranslationRequest),
});

export type ICreateDailyRequestRequest = z.infer<typeof CreateDailyRequestSchema>;
