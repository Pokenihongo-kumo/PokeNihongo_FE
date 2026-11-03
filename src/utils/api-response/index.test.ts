import { AxiosHeaders, type AxiosResponse } from "axios";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { pageSchema, toApiResult } from "./index";

// Builds an AxiosResponse the way axios does for a success response
const httpResponse = (status: number, data: unknown): AxiosResponse<unknown> => ({
    status,
    statusText: "",
    headers: {},
    config: { headers: new AxiosHeaders() },
    data,
});

const ItemSchema = z.object({ id: z.number(), name: z.string() });

describe("toApiResult", () => {
    it("unwraps the envelope and keeps statusCode and message", () => {
        const result = toApiResult(
            httpResponse(201, { statusCode: 201, message: "Tạo thành công", data: { id: 1, name: "A" } }),
            ItemSchema,
        );

        expect(result).toEqual({ statusCode: 201, message: "Tạo thành công", data: { id: 1, name: "A" } });
    });

    it("reads a list payload with results and pagination", () => {
        const pagination = { current: 1, pageSize: 10, totalPage: 1, totalItem: 1 };
        const result = toApiResult(
            httpResponse(200, {
                statusCode: 200,
                message: "OK",
                data: { results: [{ id: 1, name: "A" }], pagination },
            }),
            pageSchema(ItemSchema),
        );

        expect(result.data.results).toEqual([{ id: 1, name: "A" }]);
        expect(result.data.pagination).toEqual(pagination);
    });

    it("throws when the payload does not match the schema", () => {
        expect(() => toApiResult(httpResponse(200, { message: "OK", data: { id: "1" } }), ItemSchema)).toThrow();
        expect(() => toApiResult(httpResponse(200, "<html></html>"), ItemSchema)).toThrow();
    });
});
