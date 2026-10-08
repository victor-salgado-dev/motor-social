// Devuelve la URL del avatar si existe, o null si el usuario no tiene uno
// (en ese caso el componente que lo use debe mostrar un círculo con la
// inicial, ver <Avatar/> más abajo en UserProfile.jsx / Navbar.jsx).
import { resolverImagen } from './imagen';

export function getAvatarUrl(avatar_url) {
    return resolverImagen(avatar_url);
}
