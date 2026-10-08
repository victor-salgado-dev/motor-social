import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import PostCard from '../components/PostCard';
import { PenSquare } from 'lucide-react';

export default function PostFeed() {
    const [posts, setPosts] = useState([]);
    const [cargando, setCargando] = useState(true);
    const { user } = useAuth();
    const { mostrarToast } = useToast();

    useEffect(() => {
        api.get('/publicaciones')
            .then(res => setPosts(res.data))
            .catch(err => console.error('Error loading posts:', err))
            .finally(() => setCargando(false));
    }, []);

    const handleLike = async (id) => {
        if (!user) return mostrarToast("Log in to like this", "error");
        try {
            const res = await api.post(`/publicaciones/${id}/like`);
            setPosts(prev => prev.map(p => p.id === id
                ? { ...p, total_likes: res.data.liked ? (parseInt(p.total_likes || 0) + 1) : Math.max(0, parseInt(p.total_likes || 0) - 1), user_liked: res.data.liked }
                : p
            ));
        } catch (err) {
            console.error('Error liking post:', err);
        }
    };

    if (cargando) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white pt-24">Loading...</div>;

    return (
        <div className="min-h-screen bg-zinc-950 pt-24 pb-12 px-4">
            <div className="max-w-xl mx-auto">
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Posts<span className="text-red-600">.</span></h1>
                        <p className="text-zinc-500">The latest from the community.</p>
                    </div>
                    {user && (
                        <Link to="/publicaciones/nueva" className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-4 py-2.5 rounded-full transition shrink-0">
                            <PenSquare size={16} /> <span className="hidden sm:inline">Create post</span>
                        </Link>
                    )}
                </header>

                {posts.length === 0 ? (
                    <div className="text-center py-24 text-zinc-600">No posts yet. Be the first!</div>
                ) : (
                    posts.map(post => <PostCard key={post.id} post={post} onLike={handleLike} />)
                )}
            </div>
        </div>
    );
}
