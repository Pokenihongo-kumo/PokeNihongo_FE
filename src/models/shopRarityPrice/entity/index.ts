import { at, byUser } from "@models/common/response";
import z from "zod";

/**
 * Shop Rarity Price Entity Schema
 */
const ShopRarityPriceEntitySchema = z.object({
    id: z.number(),
    rarity: z.string(),
    price: z.number(),
    ...at,
    ...byUser,
});

export type IShopRarityPriceEntityType = z.infer<typeof ShopRarityPriceEntitySchema>;
//----------------------End----------------------//
