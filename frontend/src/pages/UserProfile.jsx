import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Avatar from '../components/Avatar';
import CocheGrid from '../components/CocheGrid';
import PostCard from '../components/PostCard';
import { Pencil, Car, Heart, MessageCircle, Calendar, UserPlus, UserCheck } from 'lucide-react';

export default function UserProfile() {
    const { id } = useParams();
    const { user } = useAuth();
    const { mostrarToast } = useToast();
    const [perfil, setPerfil] = useState(null);
    const [coches, setCoches] = useState([]);
    const [publicaciones, setPublicaciones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(false);
    const [siguiendo, setSiguiendo] = useState(false);
    const [cambiandoSeguir, setCambiandoSeguir] = useState(false);

    const cargarPerfil = () => {
        let activo = true;
        setCargando(true);
        setError(false);
        Promise.all([
            api.get(`/usuarios/${id}`),
            api.get('/coches-detallados'),
            api.get('/publicaciones')
        ]).then(([perfilRes, cochesRes, publicacionesRes]) => {
            if (!activo) return;
            setPerfil(perfilRes.data);
            setSiguiendo(!!perfilRes.data.le_sigues);
            setCoches(cochesRes.data.filter(c => String(c.propietario_id) === String(id)));
            setPublicaciones(publicacionesRes.data.filter(p => String(p.usuario_id) === String(id)));
        }).catch(() => {
            if (activo) setError(true);
        }).finally(() => {
            if (activo) setCargando(false);
        });
        return () => { activo = false; };
    };

    useEffect(cargarPerfil, [id]);

    const handleLike = async (idCoche) => {
        if (!user) return mostrarToast("Log in to like this", "error");
        try {
            const res = await api.post(`/coches/${idCoche}/like`);
            setCoches(prev => prev.map(c => c.id === idCoche
                ? { ...c, total_likes: res.data.liked ? (parseInt(c.total_likes || 0) + 1) : Math.max(0, parseInt(c.total_likes || 0) - 1), user_liked: res.data.liked }
                : c
            ));
        } catch (err) {
            console.error('Error liking car:', err);
        }
    };

    const handleLikePublicacion = async (idPost) => {
        if (!user) return mostrarToast("Log in to like this", "error");
        try {
            const res = await api.post(`/publicaciones/${idPost}/like`);
            setPublicaciones(prev => prev.map(p => p.id === idPost
                ? { ...p, total_likes: res.data.liked ? (parseInt(p.total_likes || 0) + 1) : Math.max(0, parseInt(p.total_likes || 0) - 1), user_liked: res.data.liked }
                : p
            ));
        } catch (err) {
            console.error('Error liking post:', err);
        }
    };

    const handleSeguir = async () => {
        if (!user) return mostrarToast("Log in to follow other users", "error");
        setCambiandoSeguir(true);
        try {
            const res = await api.post(`/usuarios/${id}/seguir`);
            setSiguiendo(res.data.siguiendo);
            setPerfil(prev => ({
                ...prev,
                total_seguidores: res.data.siguiendo ? parseInt(prev.total_seguidores || 0) + 1 : Math.max(0, parseInt(prev.total_seguidores || 0) - 1)
            }));
        } catch (err) {
            mostrarToast(err.response?.data?.error || "Error updating follow status", "error");
        } finally {
            setCambiandoSeguir(false);
        }
    };

    if (cargando) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white pt-24">Loading profile...</div>;

    if (error || !perfil) return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white pt-24 gap-4 px-4 text-center">
            <p className="text-zinc-400">This profile could not be found.</p>
            <Link to="/" className="text-red-500 hover:underline">Back to the global garage</Link>
        </div>
    );

    const esMiPerfil = user && String(user.id) === String(id);

    return (
        <div className="min-h-screen bg-zinc-950 pt-24 pb-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="bg-zinc-900 rounded-3xl border border-white/10 p-6 sm:p-10 mb-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                    <Avatar nombre={perfil.nombre} avatarUrl={perfil.avatar_url} tamaño="w-24 h-24 text-3xl" />

                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-center sm:justify-start">
                            <h1 className="text-2xl sm:text-3xl font-black italic uppercase text-white">{perfil.nombre}</h1>
                            {esMiPerfil ? (
                                <Link
                                    to="/perfil/editar"
                                    className="inline-flex items-center gap-1 text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-full transition self-center sm:self-auto"
                                >
                                    <Pencil size={12} /> Edit profile
                                </Link>
                            ) : (
                                <button
                                    onClick={handleSeguir}
                                    disabled={cambiandoSeguir}
                                    className={`inline-flex items-center gap-1 text-xs font-bold px-4 py-1.5 rounded-full transition disabled:opacity-50 self-center sm:self-auto ${siguiendo ? 'bg-zinc-800 hover:bg-red-950 hover:text-red-400 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
                                >
                                    {siguiendo ? <><UserCheck size={12} /> Following</> : <><UserPlus size={12} /> Follow</>}
                                </button>
                            )}
                        </div>

                        <p className="text-zinc-400 text-sm mt-2 max-w-xl">{perfil.bio || 'No bio yet.'}</p>

                        <div className="flex items-center justify-center sm:justify-start gap-1 text-zinc-600 text-xs mt-3">
                            <Calendar size={12} /> Member since {new Date(perfil.fecha_registro).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </div>

                        <div className="flex gap-6 mt-6 justify-center sm:justify-start">
                            <div className="text-center">
                                <div className="flex items-center gap-1 justify-center text-red-600"><Car size={16} /><span className="text-lg font-black text-white">{perfil.total_coches}</span></div>
                                <p className="text-[10px] uppercase text-zinc-500 tracking-widest">Cars</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center gap-1 justify-center text-red-600"><Heart size={16} /><span className="text-lg font-black text-white">{perfil.total_likes_recibidos}</span></div>
                                <p className="text-[10px] uppercase text-zinc-500 tracking-widest">Likes</p>
                            </div>
                            <Link to={`/usuarios/${id}/seguidores`} className="text-center hover:opacity-75">
                                <div className="text-lg font-black text-white">{perfil.total_seguidores}</div>
                                <p className="text-[10px] uppercase text-zinc-500 tracking-widest">Followers</p>
                            </Link>
                            <Link to={`/usuarios/${id}/seguidos`} className="text-center hover:opacity-75">
                                <div className="text-lg font-black text-white">{perfil.total_seguidos}</div>
                                <p className="text-[10px] uppercase text-zinc-500 tracking-widest">Following</p>
                            </Link>
                        </div>
                    </div>
                </div>

                <h2 className="text-xl font-bold text-white mb-6 uppercase italic">
                    <span className="text-red-600">{perfil.nombre}'s</span> Garage
                </h2>

                {coches.length === 0 ? (
                    <div className="text-center py-16 text-zinc-600">No cars have been added yet.</div>
                ) : (
                    <CocheGrid coches={coches} onLike={handleLike} ocultarPropietario />
                )}

                <h2 className="text-xl font-bold text-white mb-6 mt-12 uppercase italic">
                    Posts by <span className="text-red-600">{perfil.nombre}</span>
                </h2>
                {publicaciones.length === 0 ? (
                    <div className="text-center py-16 text-zinc-600">No posts yet.</div>
                ) : (
                    <div className="max-w-xl">
                        {publicaciones.map(post => <PostCard key={post.id} post={post} onLike={handleLikePublicacion} />)}
                    </div>
                )}
            </div>
        </div>
    );
}
