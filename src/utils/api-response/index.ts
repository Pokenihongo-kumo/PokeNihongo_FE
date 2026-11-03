import type { AxiosResponse } from "axios";
import { z } from "zod";
import { PaginationMetaSchema } from "@models/common/response";

/**
 * Success result returned by API services, following the backend response
 * contract: { statusCode, message, data }. Hooks read `data` directly instead
 * of digging into `response.data.data`.
 */
export interface ApiResult<T> {
    /** HTTP status (the backend keeps body statusCode equal to it) */
    statusCode: number;
    message: string;
    data: T;
}

const EnvelopeSchema = z.object({
    message: z.string().optional(),
    data: z.unknown(),
});

/** Schema of a list payload: { results, pagination } */
export const pageSchema = <T extends z.ZodType>(itemSchema: T) =>
    z.object({
        results: z.array(itemSchema),
        pagination: PaginationMetaSchema,
    });

/**
 * Unwraps the envelope of a success response and validates `data`.
 * Throws a ZodError when the payload does not match, so drift from the
 * backend shows up as a query error instead of a crash deep in the UI.
 */
export const toApiResult = <T extends z.ZodType>(
    response: AxiosResponse<unknown>,
    dataSchema: T,
): ApiResult<z.infer<T>> => {
    const body = EnvelopeSchema.parse(response.data);
    return {
        statusCode: response.status,
        message: body.message ?? "",
        data: dataSchema.parse(body.data),
    };
};
