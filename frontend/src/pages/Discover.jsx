import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Avatar from '../components/Avatar';
import CocheGrid from '../components/CocheGrid';
import PostCard from '../components/PostCard';
import { Search, TrendingUp, Clock, CarFront } from 'lucide-react';

export default function Discover() {
    const [q, setQ] = useState('');
    const [resultados, setResultados] = useState(null);
    const [buscando, setBuscando] = useState(false);

    const [destacados, setDestacados] = useState({ perfiles_destacados: [], coches_destacados: [] });
    const [recientes, setRecientes] = useState([]);
    const [cargandoInicial, setCargandoInicial] = useState(true);

    const { user } = useAuth();
    const { mostrarToast } = useToast();

    useEffect(() => {
        Promise.all([
            api.get('/descubrir'),
            api.get('/coches-detallados')
        ]).then(([desRes, cochesRes]) => {
            setDestacados(desRes.data);
            setRecientes(cochesRes.data.slice(0, 3));
        }).catch(err => console.error('Error loading discovery:', err))
            .finally(() => setCargandoInicial(false));
    }, []);

    // Búsqueda en vivo, con un pequeño retraso para no lanzar una petición
    // por cada pulsación de tecla.
    useEffect(() => {
        if (!q.trim()) { setResultados(null); return; }
        setBuscando(true);
        const temporizador = setTimeout(() => {
            api.get(`/buscar?q=${encodeURIComponent(q.trim())}`)
                .then(res => setResultados(res.data))
                .catch(err => console.error('Error searching:', err))
                .finally(() => setBuscando(false));
        }, 350);
        return () => clearTimeout(temporizador);
    }, [q]);

    const handleLikeCoche = async (id) => {
        if (!user) return mostrarToast("Log in to like this", "error");
        try {
            const res = await api.post(`/coches/${id}/like`);
            const actualizar = (c) => c.id === id
                ? { ...c, total_likes: res.data.liked ? (parseInt(c.total_likes || 0) + 1) : Math.max(0, parseInt(c.total_likes || 0) - 1), user_liked: res.data.liked }
                : c;
            setResultados(prev => prev ? { ...prev, coches: prev.coches.map(actualizar) } : prev);
            setDestacados(prev => ({ ...prev, coches_destacados: prev.coches_destacados.map(actualizar) }));
            setRecientes(prev => prev.map(actualizar));
        } catch (err) {
            console.error(err);
        }
    };

    const handleLikePublicacion = async (id) => {
        if (!user) return mostrarToast("Log in to like this", "error");
        try {
            const res = await api.post(`/publicaciones/${id}/like`);
            setResultados(prev => prev ? {
                ...prev,
                publicaciones: prev.publicaciones.map(p => p.id === id
                    ? { ...p, total_likes: res.data.liked ? (parseInt(p.total_likes || 0) + 1) : Math.max(0, parseInt(p.total_likes || 0) - 1), user_liked: res.data.liked }
                    : p)
            } : prev);
        } catch (err) {
            console.error(err);
        }
    };

    const sinResultados = resultados && resultados.usuarios.length === 0 && resultados.coches.length === 0 && resultados.publicaciones.length === 0;

    return (
        <div className="min-h-screen bg-zinc-950 pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-6">Discover<span className="text-red-600">.</span></h1>

                <div className="relative mb-10">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                        value={q}
                        onChange={e => setQ(e.target.value)}
                        placeholder="Search users, cars, or posts..."
                        className="w-full bg-zinc-900 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-red-600 outline-none transition"
                    />
                </div>

                {q.trim() ? (
                    <div>
                        {buscando && <p className="text-zinc-500 text-sm mb-6">Searching...</p>}

                        {!buscando && sinResultados && (
                            <p className="text-zinc-600 text-center py-16">No results for "{q}".</p>
                        )}

                        {resultados?.usuarios.length > 0 && (
                            <section className="mb-10">
                                <h2 className="text-sm font-black uppercase text-zinc-500 tracking-widest mb-3">Users</h2>
                                <div className="space-y-2">
                                    {resultados.usuarios.map(u => (
                                        <Link key={u.id} to={`/usuarios/${u.id}`} className="flex items-center gap-3 bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-2xl p-4 transition">
                                            <Avatar nombre={u.nombre} avatarUrl={u.avatar_url} tamaño="w-10 h-10" />
                                            <span className="font-bold text-white">{u.nombre}</span>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {resultados?.coches.length > 0 && (
                            <section className="mb-10">
                                <h2 className="text-sm font-black uppercase text-zinc-500 tracking-widest mb-3">Cars</h2>
                                <CocheGrid coches={resultados.coches} onLike={handleLikeCoche} />
                            </section>
                        )}

                        {resultados?.publicaciones.length > 0 && (
                            <section>
                                <h2 className="text-sm font-black uppercase text-zinc-500 tracking-widest mb-3">Posts</h2>
                                <div className="max-w-xl">
                                    {resultados.publicaciones.map(p => <PostCard key={p.id} post={p} onLike={handleLikePublicacion} />)}
                                </div>
                            </section>
                        )}
                    </div>
                ) : cargandoInicial ? (
                    <p className="text-zinc-500">Loading...</p>
                ) : (
                    <div className="space-y-12">
                        <section>
                            <h2 className="flex items-center gap-2 text-sm font-black uppercase text-zinc-500 tracking-widest mb-4">
                                <TrendingUp size={14} className="text-red-600" /> Featured profiles
                            </h2>
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {destacados.perfiles_destacados.map(p => (
                                    <Link key={p.id} to={`/usuarios/${p.id}`} className="flex flex-col items-center gap-2 bg-zinc-900 border border-white/5 rounded-2xl p-4 shrink-0 w-28 hover:border-red-500/50 transition">
                                        <Avatar nombre={p.nombre} avatarUrl={p.avatar_url} tamaño="w-14 h-14 text-xl" />
                                        <span className="text-xs font-bold text-white text-center truncate w-full">{p.nombre}</span>
                                        <span className="text-[10px] text-zinc-500">{p.total_seguidores} followers</span>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="flex items-center gap-2 text-sm font-black uppercase text-zinc-500 tracking-widest mb-4">
                                <CarFront size={14} className="text-red-600" /> Featured cars
                            </h2>
                            <CocheGrid coches={destacados.coches_destacados} onLike={handleLikeCoche} />
                        </section>

                        <section>
                            <h2 className="flex items-center gap-2 text-sm font-black uppercase text-zinc-500 tracking-widest mb-4">
                                <Clock size={14} className="text-red-600" /> Recent activity
                            </h2>
                            <CocheGrid coches={recientes} onLike={handleLikeCoche} />
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
}
