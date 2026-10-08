import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import PublicacionForm from '../components/PublicacionForm';

export default function EditPost() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        let activo = true;
        api.get('/publicaciones')
            .then(res => {
                if (!activo) return;
                setPost(res.data.find(p => String(p.id) === String(id)) || null);
            })
            .catch(() => { if (activo) setPost(null); })
            .finally(() => { if (activo) setCargando(false); });
        return () => { activo = false; };
    }, [id]);

    if (cargando) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white pt-24">Loading...</div>;

    if (!post) return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white pt-24 gap-4 px-4 text-center">
            <p className="text-zinc-400">This post could not be found.</p>
            <Link to="/publicaciones" className="text-red-500 hover:underline">Volver</Link>
        </div>
    );

    if (!user || String(post.usuario_id) !== String(user.id)) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white pt-24 gap-4 px-4 text-center">
                <p className="text-zinc-400">You can't edit someone else's post.</p>
                <Link to={`/publicaciones/${id}`} className="text-red-500 hover:underline">Back to post</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28 sm:pt-32 pb-16 px-4 flex justify-center bg-zinc-950">
            <PublicacionForm publicacion={post} onGuardado={() => navigate(`/publicaciones/${id}`)} />
        </div>
    );
}
