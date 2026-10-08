import { imagenCocheDemo, resolverImagen } from './imagen';

// Usa fotos subidas o URLs absolutas guardadas; si no hay foto, elige una local.
export function getImagenCoche(url, id, marca = 'car') {
    return resolverImagen(url) || imagenCocheDemo(id);
}
