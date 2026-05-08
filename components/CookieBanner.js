"use client";

import { useState, useEffect } from 'react';

export default function CookieBanner() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setShowBanner(true);
        }
    }, []);

    const handleConsent = async (type) => {
        const consentData = {
            analytics: type === 'all' || type === 'analytics',
            marketing: type === 'all',
            userId: crypto.randomUUID?.() || Math.random().toString(36).substring(2),
        };

        // 1. Save locally
        localStorage.setItem('cookie-consent', JSON.stringify(consentData));
        setShowBanner(false);

        // 2. Update Google Consent Mode
        if (window.gtag) {
            window.gtag('consent', 'update', {
                'analytics_storage': consentData.analytics ? 'granted' : 'denied',
                'ad_storage': consentData.marketing ? 'granted' : 'denied',
                'ad_user_data': consentData.marketing ? 'granted' : 'denied',
                'ad_personalization': consentData.marketing ? 'granted' : 'denied',
            });
        }

        // 3. Update Microsoft Clarity
        if (window.clarity) {
            window.clarity('consent');
        }

        // 4. Save to Backend (Direct to Google Sheets)
        try {
            const googleUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
            if (googleUrl) {
                // Using mode: 'no-cors' for direct browser-to-script logging
                await fetch(googleUrl, {
                    method: 'POST',
                    mode: 'no-cors', 
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: consentData.userId,
                        analytics: consentData.analytics ? 'granted' : 'denied',
                        marketing: consentData.marketing ? 'granted' : 'denied',
                        timestamp: new Date().toISOString(),
                        userAgent: navigator.userAgent,
                        domain: window.location.origin
                    }),
                });
            }
        } catch (e) {
            console.error('Failed to log consent', e);
        }
    };

    if (!showBanner) return null;

    return (
        <div className="cookie-banner">
            <div className="cookie-banner-card">
                <div className="cookie-banner-info">
                    <h3 className="h5" style={{ margin: 0 }}>Cookie Preferences</h3>
                    <p className="body-regular" style={{ margin: '8px 0 0 0' }}>
                        We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                    </p>
                </div>
                <div className="cookie-banner-actions">
                    <button 
                        onClick={() => handleConsent('all')}
                        className="btn btn-primary btn-md"
                        style={{ flex: 1 }}
                    >
                        Accept All
                    </button>
                    <button 
                        onClick={() => handleConsent('none')}
                        className="btn btn-ghost btn-md"
                        style={{ flex: 1 }}
                    >
                        Reject All
                    </button>
                </div>
            </div>
        </div>
    );
}
