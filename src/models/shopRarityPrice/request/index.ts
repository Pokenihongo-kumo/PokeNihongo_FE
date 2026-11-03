import z from "zod";

/**
 * Update Shop Rarity Price Request Schema (API)
 * - Pure schema, no i18n dependency
 */
export const UpdateShopRarityPriceRequestSchema = z.object({
    rarity: z.enum(["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY"]),
    price: z.number().min(0).max(10_000_000),
    isChangeAllShopPreview: z.boolean(),
});

export type IUpdateShopRarityPriceRequest = z.infer<typeof UpdateShopRarityPriceRequestSchema>;
