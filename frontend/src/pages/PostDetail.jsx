import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/ConfirmModal';
import Avatar from '../components/Avatar';
import { fallbackImagen, imagenCocheDemo, resolverImagen } from '../utils/imagen';
import { ArrowLeft, Heart, Send, Pencil, Trash2, CarFront } from 'lucide-react';

export default function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [comentarios, setComentarios] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState('');
    const [cargando, setCargando] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [confirmandoEliminar, setConfirmandoEliminar] = useState(false);
    const { mostrarToast } = useToast();

    useEffect(() => {
        let activo = true;
        Promise.all([
            api.get('/publicaciones'),
            api.get(`/publicaciones/${id}/comentarios`)
        ]).then(([postsRes, comentariosRes]) => {
            if (!activo) return;
            setPost(postsRes.data.find(p => String(p.id) === String(id)) || null);
            setComentarios(comentariosRes.data);
        }).catch(err => console.error('Error loading post:', err))
            .finally(() => { if (activo) setCargando(false); });
        return () => { activo = false; };
    }, [id]);

    const esAutor = user && post && String(user.id) === String(post.usuario_id);

    const handleLike = async () => {
        if (!user) return mostrarToast("Log in to like this", "error");
        try {
            const res = await api.post(`/publicaciones/${id}/like`);
            setPost(prev => ({
                ...prev,
                total_likes: res.data.liked ? (parseInt(prev.total_likes || 0) + 1) : Math.max(0, parseInt(prev.total_likes || 0) - 1),
                user_liked: res.data.liked
            }));
        } catch (err) {
            console.error('Error liking post:', err);
        }
    };

    const postComentario = async (e) => {
        e.preventDefault();
        if (!nuevoComentario.trim()) return;
        setEnviando(true);
        try {
            const res = await api.post(`/publicaciones/${id}/comentarios`, { contenido: nuevoComentario });
            setComentarios(prev => [...prev, { ...res.data, autor: user?.nombre || 'You' }]);
            setNuevoComentario('');
        } catch (err) {
            mostrarToast(err.response?.data?.error || "Error posting comment", "error");
        } finally {
            setEnviando(false);
        }
    };

    const handleEliminar = async () => {
        setConfirmandoEliminar(false);
        try {
            await api.delete(`/publicaciones/${id}`);
            navigate('/publicaciones');
        } catch (err) {
            mostrarToast(err.response?.data?.error || "Error deleting post", "error");
        }
    };

    if (cargando) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white pt-24">Loading...</div>;

    if (!post) return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white pt-24 gap-4 px-4 text-center">
            <p className="text-zinc-400">This post could not be found.</p>
            <Link to="/publicaciones" className="text-red-500 hover:underline">Back to posts</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-950 pt-24 pb-12 px-4">
            <div className="max-w-xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm">
                        <ArrowLeft size={18} /> Back
                    </button>
                    {esAutor && (
                        <div className="flex items-center gap-3">
                            <Link to={`/publicaciones/${id}/editar`} className="flex items-center gap-1 text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-full transition">
                                <Pencil size={12} /> Edit
                            </Link>
                            <button onClick={() => setConfirmandoEliminar(true)} className="flex items-center gap-1 text-xs font-bold bg-red-950 hover:bg-red-900 text-red-400 px-3 py-1.5 rounded-full transition">
                                <Trash2 size={12} /> Delete
                            </button>
                        </div>
                    )}
                </div>

                <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden mb-6">
                    <Link to={`/usuarios/${post.usuario_id}`} className="flex items-center gap-3 p-4">
                        <Avatar nombre={post.nombre_autor} avatarUrl={post.avatar_autor} tamaño="w-10 h-10" />
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-white truncate">{post.nombre_autor}</p>
                            <p className="text-xs text-zinc-500">{new Date(post.fecha_registro).toLocaleString('en-US')}</p>
                        </div>
                        {post.coche_marca && (
                            <span className="flex items-center gap-1 bg-zinc-800 text-zinc-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase shrink-0">
                                <CarFront size={11} className="text-red-500" /> {post.coche_marca} {post.coche_modelo}
                            </span>
                        )}
                    </Link>

                    {post.texto && <p className="px-4 pb-4 text-zinc-200 text-sm whitespace-pre-wrap">{post.texto}</p>}
                    {post.imagen_url && (
                        <img
                            src={resolverImagen(post.imagen_url)}
                            alt=""
                            className="w-full max-h-[600px] object-cover"
                            onError={(event) => fallbackImagen(event, imagenCocheDemo(post.id))}
                        />
                    )}

                    <div className="p-4">
                        <button onClick={handleLike} className="flex items-center gap-2">
                            <Heart size={24} className={post.user_liked ? 'text-red-500 fill-red-500' : 'text-white'} />
                            <span className="text-sm font-bold text-white">{post.total_likes ?? 0} Likes</span>
                        </button>
                    </div>
                </div>

                <div className="space-y-3 mb-6">
                    {comentarios.length === 0 && <p className="text-zinc-600 text-sm">No comments yet.</p>}
                    {comentarios.map(com => (
                        <div key={com.id} className="text-sm bg-zinc-900 border border-white/5 p-3 rounded-2xl">
                            <span className="font-black text-red-500 mr-2 uppercase text-[10px]">{com.autor}:</span>
                            <span className="text-zinc-300">{com.contenido}</span>
                        </div>
                    ))}
                </div>

                {user ? (
                    <form onSubmit={postComentario} className="flex gap-2">
                        <input
                            type="text"
                            value={nuevoComentario}
                            onChange={(e) => setNuevoComentario(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 bg-zinc-800 rounded-2xl px-5 py-3 text-sm text-white focus:outline-none"
                        />
                        <button type="submit" disabled={enviando} className="bg-red-600 disabled:opacity-50 p-3 rounded-2xl">
                            <Send size={18} />
                        </button>
                    </form>
                ) : (
                    <p className="text-xs text-zinc-600 text-center uppercase italic font-black">Log in to comment</p>
                )}
            </div>

            <ConfirmModal
                abierto={confirmandoEliminar}
                titulo="Delete post"
                mensaje="Are you sure you want to delete this post? This action cannot be undone."
                onConfirmar={handleEliminar}
                onCancelar={() => setConfirmandoEliminar(false)}
            />
        </div>
    );
}
