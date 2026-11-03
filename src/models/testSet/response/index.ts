import { PaginationMetaSchema } from "@models/common/response";
import { TestSetEntitySchema } from "@models/testSet/entity";
import z from "zod";

export const TestSetResponseSchema = TestSetEntitySchema;

export type TestSetResponseType = z.infer<typeof TestSetResponseSchema>;

export const TestSetListResponseSchema = z.object({
    statusCode: z.number(),
    data: z.object({
        results: z.array(TestSetResponseSchema),
        pagination: PaginationMetaSchema,
    }),
    message: z.string(),
});

export type TestSetListResponseType = z.infer<typeof TestSetListResponseSchema>;

export const TestSetCreateResponseSchema = z.object({
    statusCode: z.number(),
    data: TestSetEntitySchema,
    message: z.string(),
});

export type TestSetCreateResponseType = z.infer<typeof TestSetCreateResponseSchema>;
