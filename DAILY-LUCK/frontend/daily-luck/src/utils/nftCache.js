const CACHE_KEY = "nft-cache";

export const getCache = (account) => {
    try {
        const raw = localStorage.getItem(`${CACHE_KEY}-${account}`);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

export const setCache = (account, data) => {
    try {
        localStorage.setItem(`${CACHE_KEY}-${account}`, JSON.stringify(data));
    } catch {}
};

export const prefetchImage = (url) => {
    if (!url) return;
    const img = new Image();
    img.src = url;
};

export const normalizeAddress = (addr) => {
    if (!addr) return null;
    return addr.toLowerCase();
};