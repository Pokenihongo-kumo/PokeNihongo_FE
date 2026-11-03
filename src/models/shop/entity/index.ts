import { byUser, TranslationInputSchema } from "@models/common/response";
import { at } from "@models/common/response";
import { z } from "zod";
import { ShopItemRandomSchema } from "../response";
/**
 * Shop Banner Schema
 */
export const ShopBannerSchema = z.object({
    id: z.number(),
    nameKey: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    status: z.enum(["PREVIEW", "EXPIRED", "INACTIVE", "ACTIVE"]),
    enablePrecreate: z.boolean(),
    precreateBeforeEndDays: z.number(),
    isRandomItemAgain: z.boolean(),
    min: z.number(),
    max: z.number(),
    ...byUser,
    ...at,
    nameTranslation: z.string(),
    nameTranslations: TranslationInputSchema,
    shopItems: z.array(ShopItemRandomSchema),
});
export type IShopBannerSchema = z.infer<typeof ShopBannerSchema>;
//------------------------End------------------------//
