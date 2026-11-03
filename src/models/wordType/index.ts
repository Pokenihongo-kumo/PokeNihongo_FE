import { z } from "zod";
import { pageSchema } from "@utils/api-response";

/**
 * Word type as listed by GET /wordtype (name is translated by the backend)
 */
export const WordTypeSchema = z.object({
    id: z.number(),
    name: z.string(),
});
export type IWordType = z.infer<typeof WordTypeSchema>;

export const WordTypeListSchema = pageSchema(WordTypeSchema);
export type IWordTypeList = z.infer<typeof WordTypeListSchema>;
//----------------------End----------------------//
