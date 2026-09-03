function getBrowser() {
    const uaData = navigator.userAgentData;
    if (uaData) {
        const brands = uaData.brands.map((b) => b.brand);
        if (brands.includes('Microsoft Edge')) return 'edge';
        if (brands.includes('Opera')) return 'opera';
        if (brands.includes('Google Chrome')) return 'chrome';
    }

    return getLegacyBrowser();
}

function getLegacyBrowser() {
    const ua = navigator.userAgent;

    if (/Edg\//.test(ua)) return 'edge';
    if (/OPR\//.test(ua)) return 'opera';
    if (/Firefox\//.test(ua)) return 'firefox';
    if (/Chrome\//.test(ua)) return 'chrome';
    if (/Safari\//.test(ua)) return 'safari';
    return 'unknown';
}

const INTERACTION_EVENTS = ['pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll'];

export function initDownloadHint(el) {
    if (!el) return null;

    document.documentElement.dataset.browser = getBrowser();

    const hide = () => {
        el.hidden = true;
        for (const type of INTERACTION_EVENTS) window.removeEventListener(type, hide);
    };

    const show = () => {
        el.hidden = false;
        for (const type of INTERACTION_EVENTS) {
            window.addEventListener(type, hide, { once: true, passive: true });
        }
    };

    return { show, hide };
}
