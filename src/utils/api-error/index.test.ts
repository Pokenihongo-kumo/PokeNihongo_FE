import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';
import { getApiErrorMessage, toApiError } from './index';

// Builds an AxiosError the way axios does for an HTTP error response
const httpError = (status: number, data: unknown) =>
    new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, {
        status,
        statusText: '',
        headers: {},
        config: { headers: new AxiosHeaders() },
        data,
    });

describe('toApiError', () => {
    it('reads the unified 422 body: string message + errors[]', () => {
        const result = toApiError(
            httpError(422, {
                statusCode: 422,
                error: 'UNPROCESSABLE_ENTITY',
                message: 'Dữ liệu không hợp lệ',
                errors: [{ field: 'name', message: 'Trường này là bắt buộc' }],
            }),
        );

        expect(result).toMatchObject({
            kind: 'http',
            status: 422,
            error: 'UNPROCESSABLE_ENTITY',
            message: 'Dữ liệu không hợp lệ',
            fieldErrors: [{ field: 'name', message: 'Trường này là bắt buộc' }],
        });
    });

    it('still reads the old 422 body (message: [{ message, path }])', () => {
        const result = toApiError(httpError(422, { message: [{ message: 'Required', path: 'name' }] }));

        expect(result.message).toBeUndefined();
        expect(result.fieldErrors).toEqual([{ field: 'name', message: 'Required' }]);
    });

    it('tells network errors and cancellations apart from HTTP errors', () => {
        expect(toApiError(new AxiosError('Network Error', 'ERR_NETWORK')).kind).toBe('network');
        expect(toApiError(new AxiosError('canceled', AxiosError.ERR_CANCELED)).kind).toBe('cancel');
        expect(toApiError(new Error('boom'))).toMatchObject({ kind: 'unknown', message: 'boom' });
    });
});

describe('getApiErrorMessage', () => {
    it('shows the summary followed by each invalid field', () => {
        const error = httpError(422, {
            message: 'Dữ liệu không hợp lệ',
            errors: [
                { field: 'name', message: 'Trường này là bắt buộc' },
                { field: 'level', message: 'Định dạng không hợp lệ' },
            ],
        });

        expect(getApiErrorMessage(error, 'fallback')).toBe(
            'Dữ liệu không hợp lệ: name: Trường này là bắt buộc, level: Định dạng không hợp lệ',
        );
    });

    it('uses the backend message, or the fallback when there is none', () => {
        expect(getApiErrorMessage(httpError(404, { message: 'Không tìm thấy' }), 'fallback')).toBe(
            'Không tìm thấy',
        );
        expect(getApiErrorMessage(httpError(500, {}), 'fallback')).toBe('fallback');
        expect(getApiErrorMessage(undefined, 'fallback')).toBe('fallback');
    });
});
