import { at, byUser } from "@models/common/response";
import { RarityPokemon } from "@constants/pokemon";
import z from "zod";

/**
 * Pokemon Entity Schema
 */
export const PokemonEntitySchema = z.object({
    id: z.number(),
    pokedex_number: z.number(),
    nameJp: z.string(),
    nameTranslations: z.array(z.object({ en: z.string(), ja: z.string(), vi: z.string() })),
    description: z.string(),
    conditionLevel: z.number(),
    isStarted: z.boolean(),
    imageUrl: z.string().url(),
    rarity: z.string(),
    ...byUser,
    ...at,
});

export type PokemonEntityType = z.infer<typeof PokemonEntitySchema>;
//------------------------End------------------------//

/**
 * Pokemon omit
 */
export const PokemonOmitEntitySchema = PokemonEntitySchema.omit({
    pokedex_number: true,
    description: true,
    conditionLevel: true,
    isStarted: true,
});

export type IPokemonOmitEntity = z.infer<typeof PokemonOmitEntitySchema>;
//------------------------End------------------------//

/**
 * Pokemon Lite Entity Schema
 */
export const PokemonLiteEntitySchema = z.object({
    id: z.number(),
    imageUrl: z.string(),
    nameTranslations: z.object({ en: z.string() }),
    pokedex_number: z.number(),
    rarity: z.enum(RarityPokemon),
});
export type IPokemonLiteEntity = z.infer<typeof PokemonLiteEntitySchema>;
//------------------------End------------------------//
