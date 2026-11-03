import { AxiosError } from 'axios';

export interface ApiFieldError {
    field: string;
    message: string;
}

export interface ApiError {
    /** http: the server answered with an error; network: no response; cancel: request aborted */
    kind: 'http' | 'network' | 'cancel' | 'unknown';
    status?: number;
    /** HTTP status name from the backend, e.g. "NOT_FOUND" */
    error?: string;
    /** Translated message from the backend (or the JS error message) */
    message?: string;
    /** Per-field validation errors (422) */
    fieldErrors: ApiFieldError[];
    cause: unknown;
}

// Backends before the unified contract sent 422 as message: [{ message, path }]
const toFieldErrors = (items: unknown[]): ApiFieldError[] =>
    items.map((item) => {
        if (typeof item === 'string') return { field: '', message: item };
        const value = (item ?? {}) as { field?: string; path?: string; message?: string };
        return { field: value.field ?? value.path ?? '', message: value.message ?? '' };
    });

/**
 * Normalizes any thrown value into one shape, following the backend response
 * contract: { statusCode, error, message: string, errors?: [{ field, message }] }.
 */
export const toApiError = (error: unknown): ApiError => {
    if (error instanceof AxiosError) {
        if (error.code === AxiosError.ERR_CANCELED) {
            return { kind: 'cancel', message: error.message, fieldErrors: [], cause: error };
        }
        if (!error.response) {
            return { kind: 'network', message: error.message, fieldErrors: [], cause: error };
        }
        const body = (error.response.data ?? {}) as {
            error?: string;
            message?: unknown;
            errors?: unknown;
        };
        const legacyList = Array.isArray(body.message) ? body.message : undefined;
        return {
            kind: 'http',
            status: error.response.status,
            error: body.error,
            message: typeof body.message === 'string' ? body.message : undefined,
            fieldErrors: Array.isArray(body.errors)
                ? toFieldErrors(body.errors)
                : legacyList
                  ? toFieldErrors(legacyList)
                  : [],
            cause: error,
        };
    }
    if (error instanceof Error) {
        return { kind: 'unknown', message: error.message, fieldErrors: [], cause: error };
    }
    return { kind: 'unknown', fieldErrors: [], cause: error };
};

/**
 * Message to show the user: the backend message, plus field details for
 * validation errors; `fallback` when the error carries no usable message.
 */
export const getApiErrorMessage = (error: unknown, fallback: string): string => {
    const apiError = toApiError(error);
    if (apiError.fieldErrors.length > 0) {
        const details = apiError.fieldErrors
            .map((e) => (e.field ? `${e.field}: ${e.message}` : e.message))
            .join(', ');
        return `${apiError.message || fallback}: ${details}`;
    }
    return apiError.message || fallback;
};
