import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import CocheGrid from '../components/CocheGrid';

// mode="global"    -> /coches-detallados (muro público)
// mode="mine"      -> /mis-coches (garaje del usuario logueado)
// mode="siguiendo" -> /feed-personalizado (coches de quienes sigues)
export default function Feed({ mode = 'global' }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { mostrarToast } = useToast();

    useEffect(() => {
        setLoading(true);
        const endpoints = { global: '/coches-detallados', mine: '/mis-coches', siguiendo: '/feed-personalizado' };
        api.get(endpoints[mode])
            .then(res => setPosts(mode === 'mine' ? res.data.garaje : res.data))
            .catch(err => console.error('Error loading cars:', err))
            .finally(() => setLoading(false));
    }, [mode]);

    const handleLike = async (id) => {
        if (!user) return mostrarToast("Log in to like this", "error");
        try {
            const res = await api.post(`/coches/${id}/like`);
            setPosts(posts.map(p => p.id === id
                ? { ...p, total_likes: res.data.liked ? (parseInt(p.total_likes || 0) + 1) : Math.max(0, parseInt(p.total_likes || 0) - 1), user_liked: res.data.liked }
                : p
            ));
        } catch (err) {
            console.error('Error liking car:', err);
        }
    };

    if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white pt-24">Loading garage...</div>;

    return (
        <div className="min-h-screen bg-zinc-950 pt-24 pb-12 px-4 max-w-6xl mx-auto">
            <header className="mb-10 sm:mb-12">
                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                    {mode === 'global' && <>Global <span className="text-red-600">Garage</span></>}
                    {mode === 'mine' && <>My <span className="text-red-600">Garage</span></>}
                    {mode === 'siguiendo' && <>Following<span className="text-red-600">.</span></>}
                </h1>
                <p className="text-zinc-500">
                    {mode === 'global' && 'Explore the latest cars from the community.'}
                    {mode === 'mine' && 'Cars you have added to your garage.'}
                    {mode === 'siguiendo' && 'Cars from people you follow.'}
                </p>
            </header>

            {posts.length === 0 && (
                <div className="text-center py-24 text-zinc-600">
                    {mode === 'global' && 'No cars have been posted yet.'}
                    {mode === 'mine' && "You haven't added any cars to your garage yet."}
                    {mode === 'siguiendo' && 'Follow other users to see their cars here.'}
                </div>
            )}

            <CocheGrid coches={posts} onLike={handleLike} />
        </div>
    );
}
