import React, { useState } from 'react';
import { getAvatarUrl } from '../utils/avatar';

const COLORES = ['bg-red-600', 'bg-orange-600', 'bg-amber-600', 'bg-rose-600', 'bg-pink-600'];

function colorPara(nombre = '') {
    const codigo = nombre.charCodeAt(0) || 0;
    return COLORES[codigo % COLORES.length];
}

// tamaño: clases de Tailwind para width/height, p.ej. "w-10 h-10"
export default function Avatar({ nombre, avatarUrl, tamaño = 'w-10 h-10' }) {
    const url = getAvatarUrl(avatarUrl);
    const [imagenFallida, setImagenFallida] = useState(false);

    if (url && !imagenFallida) {
        return (
            <img
                src={url}
                alt={nombre}
                className={`${tamaño} rounded-full object-cover border border-white/10 shrink-0`}
                onError={() => setImagenFallida(true)}
            />
        );
    }

    return (
        <div className={`${tamaño} ${colorPara(nombre)} rounded-full flex items-center justify-center font-black text-white shrink-0`}>
            {(nombre || '?').charAt(0).toUpperCase()}
        </div>
    );
}
