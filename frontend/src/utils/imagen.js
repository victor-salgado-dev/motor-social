const API_URL = import.meta.env.VITE_API_URL || '';

export function resolverImagen(url) {
    if (!url) return null;
    if (/^(https?:|data:|blob:)/i.test(url)) return url;
    return `${API_URL}${url.startsWith('/') ? url : `/${url}`}`;
}

export function imagenCocheDemo(id = 0) {
    const index = Math.abs(Number(id) || 0) % 6 + 1;
    return `/demo/car-${String(index).padStart(2, '0')}.jpg`;
}

export function fallbackImagen(event, urlFallback) {
    const imagen = event.currentTarget;
    if (imagen.dataset.fallbackApplied) {
        imagen.style.visibility = 'hidden';
        return;
    }
    imagen.dataset.fallbackApplied = 'true';
    imagen.src = urlFallback;
}