import { PokemonEntitySchema } from "@models/pokemon/entity";
import z from "zod";

/**
 * Shop Item Entity Schema
 */
export const ShopItemRandomSchema = z.object({
    shopBannerId: z.number(),
    pokemonId: z.number(),
    price: z.number(),
    purchaseLimit: z.number(),
    isActive: z.boolean(),
    isHas: z.boolean(),
    pokemon: PokemonEntitySchema,
});
export type IShopItemRandomSchema = z.infer<typeof ShopItemRandomSchema>;
//------------------------End------------------------//

/**
 * Shop Banner All Pokemon Response Schema
 */
export const ShopBannerAllPokemonResponseSchema = z.object({
    id: z.number(),
    pokedex_number: z.number(),
    nameJp: z.string(),
    nameTranslations: z.object({ en: z.string(), ja: z.string(), vi: z.string() }),
    rarity: z.string(),
    imageUrl: z.string().url(),
    isExist: z.boolean(),
});
export type IShopBannerAllPokemonResponseSchema = z.infer<typeof ShopBannerAllPokemonResponseSchema>;
//------------------------End------------------------//
