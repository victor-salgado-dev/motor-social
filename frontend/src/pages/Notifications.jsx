import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Avatar from '../components/Avatar';
import { Heart, MessageCircle, UserPlus } from 'lucide-react';

function tiempoRelativo(fecha) {
    const segundos = Math.floor((new Date() - new Date(fecha)) / 1000);
    if (segundos < 60) return 'just now';
    const minutos = Math.floor(segundos / 60);
    if (minutos < 60) return `${minutos} min ago`;
    const horas = Math.floor(minutos / 60);
    if (horas < 24) return `${horas} hr ago`;
    const dias = Math.floor(horas / 24);
    return `${dias} days ago`;
}

const CONFIG_TIPO = {
    seguidor: { icono: UserPlus, texto: 'started following you', color: 'text-blue-500' },
    like_coche: { icono: Heart, texto: 'liked your car', color: 'text-red-500' },
    comentario_coche: { icono: MessageCircle, texto: 'commented on your car', color: 'text-red-500' },
    like_publicacion: { icono: Heart, texto: 'liked your post', color: 'text-red-500' },
    comentario_publicacion: { icono: MessageCircle, texto: 'commented on your post', color: 'text-red-500' },
};

function enlaceDeNotificacion(n) {
    if (n.tipo === 'seguidor') return `/usuarios/${n.actor_id}`;
    if (n.tipo === 'like_coche' || n.tipo === 'comentario_coche') return `/coches/${n.referencia_id}`;
    if (n.tipo === 'like_publicacion' || n.tipo === 'comentario_publicacion') return `/publicaciones/${n.referencia_id}`;
    return '#';
}

export default function Notifications() {
    const [notificaciones, setNotificaciones] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        api.get('/notificaciones')
            .then(res => setNotificaciones(res.data))
            .catch(err => console.error('Error loading notifications:', err))
            .finally(() => setCargando(false));

        // Al entrar en esta página se dan todas por leídas (enfoque simple,
        // sin marcar de una en una).
        api.post('/notificaciones/marcar-leidas').catch(() => {});
    }, []);

    if (cargando) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white pt-24">Loading...</div>;

    return (
        <div className="min-h-screen bg-zinc-950 pt-24 pb-12 px-4">
            <div className="max-w-lg mx-auto">
                <h1 className="text-3xl font-bold text-white tracking-tight mb-8">Notifications<span className="text-red-600">.</span></h1>

                {notificaciones.length === 0 ? (
                    <div className="text-center py-24 text-zinc-600">You don't have any notifications yet.</div>
                ) : (
                    <div className="space-y-2">
                        {notificaciones.map(n => {
                            const cfg = CONFIG_TIPO[n.tipo] || { icono: Heart, texto: n.tipo, color: 'text-zinc-500' };
                            const Icono = cfg.icono;
                            return (
                                <Link
                                    key={n.id}
                                    to={enlaceDeNotificacion(n)}
                                    className={`flex items-center gap-3 p-4 rounded-2xl border transition ${n.leida ? 'bg-zinc-900 border-white/5' : 'bg-zinc-900 border-red-600/30'}`}
                                >
                                    <Avatar nombre={n.nombre_actor} avatarUrl={n.avatar_actor} tamaño="w-10 h-10" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-zinc-200">
                                            <span className="font-bold text-white">{n.nombre_actor}</span> {cfg.texto}
                                        </p>
                                        <p className="text-xs text-zinc-600">{tiempoRelativo(n.fecha_registro)}</p>
                                    </div>
                                    <Icono size={18} className={cfg.color} />
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
