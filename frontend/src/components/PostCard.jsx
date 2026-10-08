import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, CarFront } from 'lucide-react';
import Avatar from './Avatar';
import { fallbackImagen, imagenCocheDemo, resolverImagen } from '../utils/imagen';

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

export default function PostCard({ post, onLike }) {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden mb-6"
        >
            <div
                className="flex items-center gap-3 p-4 cursor-pointer"
                onClick={() => navigate(`/usuarios/${post.usuario_id}`)}
            >
                <Avatar nombre={post.nombre_autor} avatarUrl={post.avatar_autor} tamaño="w-10 h-10" />
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate">{post.nombre_autor}</p>
                    <p className="text-xs text-zinc-500">{tiempoRelativo(post.fecha_registro)}</p>
                </div>
                {post.coche_marca && (
                    <span className="flex items-center gap-1 bg-zinc-800 text-zinc-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase shrink-0">
                        <CarFront size={11} className="text-red-500" /> {post.coche_marca} {post.coche_modelo}
                    </span>
                )}
            </div>

            {post.texto && (
                <p onClick={() => navigate(`/publicaciones/${post.id}`)} className="px-4 pb-4 text-zinc-200 text-sm whitespace-pre-wrap cursor-pointer">
                    {post.texto}
                </p>
            )}

            {post.imagen_url && (
                <img
                    onClick={() => navigate(`/publicaciones/${post.id}`)}
                    src={resolverImagen(post.imagen_url)}
                    alt=""
                    className="w-full max-h-[520px] object-cover cursor-pointer"
                    onError={(event) => fallbackImagen(event, imagenCocheDemo(post.id))}
                />
            )}

            <div className="flex items-center gap-5 p-4 text-zinc-400">
                <button onClick={() => onLike(post.id)} className="flex items-center gap-1.5 hover:text-red-500 transition">
                    <Heart size={20} className={post.user_liked ? 'text-red-500 fill-red-500' : ''} />
                    <span className="text-sm">{post.total_likes ?? 0}</span>
                </button>
                <button onClick={() => navigate(`/publicaciones/${post.id}`)} className="flex items-center gap-1.5 hover:text-white transition">
                    <MessageCircle size={20} />
                    <span className="text-sm">{post.total_comentarios ?? 0}</span>
                </button>
            </div>
        </motion.div>
    );
}
