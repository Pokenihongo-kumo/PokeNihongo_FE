import { at, byUser } from "@models/common/response";
import z from "zod";

/**
 * Daily Request Response Schema
 */
export const DailyRequestResponseSchema = z.object({
    id: z.number(),
    dailyRequestType: z.enum([
        "DAILY_LOGIN",
        "DAILY_LESSON",
        "DAILY_EXERCISE",
        "STREAK_LOGIN",
        "STREAK_LESSON",
        "STREAK_EXCERCISE",
    ]),
    conditionValue: z.number(),
    rewardId: z.number(),
    isStreak: z.boolean(),
    isActive: z.boolean(),
    ...byUser,
    ...at,
    nameTranslation: z.string(),
    descriptionTranslation: z.string(),
});
export type IDailyRequestResponse = z.infer<typeof DailyRequestResponseSchema>;
//----------------------End----------------------//
