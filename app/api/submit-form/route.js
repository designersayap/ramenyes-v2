export const runtime = 'edge';

import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { provider, data } = await request.json();

        // Get active provider from environment variable, defaulting to webhook
        const activeProvider = process.env.FORM_SUBMISSION_PROVIDER || 'webhook';

        console.log(`[Submit Form Proxy] Submitting for provider: ${activeProvider}`);

        if (activeProvider === 'messagebird') {
            const workspaceId = process.env.MESSAGEBIRD_WORKSPACE_ID;
            const listId = process.env.MESSAGEBIRD_LIST_ID;
            const accessKey = process.env.MESSAGEBIRD_ACCESS_KEY;

            if (!workspaceId || !listId || !accessKey) {
                console.error('[Submit Form Proxy] Error: MessageBird workspace credentials are missing.');
                return NextResponse.json(
                    {
                        error: 'Environment Configuration Error',
                        message: 'MessageBird credentials (MESSAGEBIRD_WORKSPACE_ID, MESSAGEBIRD_LIST_ID, MESSAGEBIRD_ACCESS_KEY) are missing in environment variables.'
                    },
                    { status: 500 }
                );
            }

            const messagebirdUrl = `https://api.bird.com/workspaces/${workspaceId}/contacts`;
            
            // Format phone number to start with + if not already
            let phone = data.phonenumber || '';
            if (phone && !phone.startsWith('+')) {
                phone = `+${phone}`;
            }

            // Determine key name for privacy/collection consent dynamically
            const isProd = (process.env.APP_ENV || process.env.NODE_ENV) === 'production';
            const privacyKey = process.env.MESSAGEBIRD_PRIVACY_KEY || (isProd ? 'privacypolicy' : 'ppolicy');

            const messagebirdPayload = {
                displayName: data.displayName || '',
                listIds: [listId],
                identifiers: [
                    {
                        key: 'phonenumber',
                        value: phone
                    }
                ],
                attributes: {
                    displayName: data.displayName || '',
                    firstName: data.displayName || '',
                    interestPromo: data.interestPromo || '',
                    marketingConsent: data.marketingConsent || 'false',
                    [privacyKey]: data.collectionConsent || 'false'
                }
            };
            const isDev = (process.env.APP_ENV || process.env.NODE_ENV) === 'development';
            if (isDev) {
                console.log(`[Submit Form Proxy] Posting contact to MessageBird: ${messagebirdUrl}`);
                console.log(`[Submit Form Proxy] MessageBird Payload:`, JSON.stringify(messagebirdPayload, null, 2));
            }

            const response = await fetch(messagebirdUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `AccessKey ${accessKey}`,
                    'User-Agent': 'Lunar-Page-Builder-Proxy'
                },
                body: JSON.stringify(messagebirdPayload)
            });

            const status = response.status;
            const responseText = await response.text();

            console.log(`[Submit Form Proxy] MessageBird Upstream Response Status: ${status}`);

            if (!response.ok) {
                if (status === 409 || responseText.includes('ResourceAlreadyExists')) {
                    return NextResponse.json(
                        {
                            error: 'ResourceAlreadyExists',
                            message: 'No. Telp sudah digunakan, Silakan periksa kembali nomor Anda atau gunakan nomor lain'
                        },
                        { status: 409 }
                    );
                }
                return NextResponse.json(
                    {
                        error: 'MessageBird API Error',
                        status,
                        message: responseText
                    },
                    { status: 500 }
                );
            }

            // Retrieve current contact list count from MessageBird
            let listCount = 0;
            try {
                // 1. Fetch direct contacts list (real-time for lists < 100)
                const contactsRes = await fetch(`https://api.bird.com/workspaces/${workspaceId}/lists/${listId}/contacts?limit=100`, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `AccessKey ${accessKey}`
                    }
                });
                if (contactsRes.ok) {
                    const contactsData = await contactsRes.json();
                    if (contactsData.results && Array.isArray(contactsData.results)) {
                        listCount = contactsData.results.length;
                    }
                }
                
                // 2. If it hits the limit (e.g. 100), fallback to list details counter if that is larger
                if (listCount >= 100) {
                    const listRes = await fetch(`https://api.bird.com/workspaces/${workspaceId}/lists/${listId}`, {
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': `AccessKey ${accessKey}`
                        }
                    });
                    if (listRes.ok) {
                        const listDetails = await listRes.json();
                        const detailsCount = (listDetails.counter && typeof listDetails.counter.count === 'number')
                            ? listDetails.counter.count
                            : (listDetails.contactCount || listDetails.contactsCount || 0);
                        if (detailsCount > listCount) {
                            listCount = detailsCount;
                        }
                    }
                }
            } catch (e) {
                console.error('[Submit Form Proxy] Error fetching MessageBird list details/contacts:', e);
            }

            return NextResponse.json({ success: true, provider: 'messagebird', status, count: listCount + 1 });

        } else {
            // General Webhook fallback
            let webhookUrl = process.env.CUSTOM_WEBHOOK_URL;
            let apiKey = process.env.CUSTOM_WEBHOOK_API_KEY;
            let apiKeyHeader = process.env.CUSTOM_WEBHOOK_API_KEY_HEADER || 'x-api-key';

            if (webhookUrl) webhookUrl = webhookUrl.replace(/^['"]|['"]$/g, '');
            if (apiKey) apiKey = apiKey.replace(/^['"]|['"]$/g, '');

            if (!webhookUrl) {
                console.error('[Submit Form Proxy] Error: CUSTOM_WEBHOOK_URL is not defined.');
                return NextResponse.json(
                    {
                        error: 'Environment Configuration Error',
                        message: 'CUSTOM_WEBHOOK_URL is not defined in environment variables.'
                    },
                    { status: 500 }
                );
            }

            console.log(`[Submit Form Proxy] Sending dynamic data to General Webhook: ${webhookUrl}`);

            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'Lunar-Page-Builder-Proxy'
            };

            if (apiKey) {
                headers[apiKeyHeader] = apiKey;
            }

            const isDevOrStaging = (process.env.APP_ENV || process.env.NODE_ENV) === 'development' || process.env.APP_ENV === 'staging';
            if (webhookUrl.includes('wingscorp.com') || isDevOrStaging) {
                process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
            }

            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers,
                body: JSON.stringify(data)
            });

            const status = response.status;
            const responseText = await response.text();

            console.log(`[Submit Form Proxy] Webhook Upstream Response Status: ${status}`);

            if (!response.ok) {
                return NextResponse.json(
                    {
                        error: 'Webhook Endpoint Error',
                        status,
                        message: responseText
                    },
                    { status: 500 }
                );
            }

            return NextResponse.json({ success: true, provider: 'webhook', status });
        }
    } catch (error) {
        console.error('[Submit Form Proxy] Error:', error.message);
        return NextResponse.json(
            { error: 'Proxy Internal Error', message: error.message },
            { status: 500 }
        );
    }
}
