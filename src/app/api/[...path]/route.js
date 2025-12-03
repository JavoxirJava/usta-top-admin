const API_BASE_URL = (process.env.API_BASE_URL || 'http://localhost:5001/api').replace(/\/$/, '');

export const dynamic = 'force-dynamic';

async function proxyRequest(request, context) {
    const params = await context.params;
    const path = Array.isArray(params?.path) ? params.path.join('/') : '';
    const { search } = new URL(request.url);
    const targetUrl = `${API_BASE_URL}/${path}${search}`;

    const headers = new Headers(request.headers);
    headers.delete('host');
    headers.delete('content-length');

    const method = request.method;
    let body;
    if (!['GET', 'HEAD'].includes(method)) {
        const buffer = await request.arrayBuffer();
        body = buffer.byteLength ? buffer : undefined;
    }

    try {
        const response = await fetch(targetUrl, {
            method,
            headers,
            body,
        });

        const responseHeaders = new Headers(response.headers);
        return new Response(response.body, {
            status: response.status,
            headers: responseHeaders,
        });
    } catch (error) {
        console.error('API proxy error:', error);
        return new Response(
            JSON.stringify({ message: 'Failed to contact API server.' }),
            {
                status: 502,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}

export async function GET(request, context) {
    return proxyRequest(request, context);
}

export async function POST(request, context) {
    return proxyRequest(request, context);
}

export async function PUT(request, context) {
    return proxyRequest(request, context);
}

export async function PATCH(request, context) {
    return proxyRequest(request, context);
}

export async function DELETE(request, context) {
    return proxyRequest(request, context);
}
