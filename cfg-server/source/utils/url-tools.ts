import { Request } from 'express';

export type RequestParameters = {
    url: string;
    params: Record<string, string | undefined>;

    getParameter(key: string): string | null;
};

export function createRequestParameters(request: Request): RequestParameters {
    const fullUrl = `${request.protocol}://${request.get('host')}${request.originalUrl}`;
    const url = new URL(fullUrl);

    const queryParams = new URLSearchParams(url.search);

    const getParameter = (key: string): string | null => {
        const queryParam = queryParams.get(key);
        if (queryParam !== null) {
            return queryParam;
        }

        return request.params[key] || null;
    };

    return {
        url: fullUrl,
        params: request.params as Record<string, string | undefined>,
        getParameter: getParameter
    };
}
