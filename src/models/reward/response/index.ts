import { PaginationResponseSchema } from "@models/common/response";
import z from "zod";
import { RewardEntitySchema } from "../entity";

export const RewardResponseSchema = PaginationResponseSchema.shape.data.extend({
    results: z.array(RewardEntitySchema),
});

export type RewardResponseType = z.infer<typeof RewardResponseSchema>;
