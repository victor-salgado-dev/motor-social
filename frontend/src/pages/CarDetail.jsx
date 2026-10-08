import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/ConfirmModal';
import { getImagenCoche } from '../utils/coche';
import { fallbackImagen } from '../utils/imagen';
import { ArrowLeft, Heart, Send, Pencil, Trash2, Plus, X, Gauge, MapPin, Palette } from 'lucide-react';

// No existe todavía un GET /coches/:id en el backend (solo el listado
// /coches-detallados y /coches/:id/comentarios), así que pedimos el listado
// completo y filtramos por id. Con el volumen de datos actual (unas pocas
// decenas de coches) el coste es insignificante; si el catálogo crece mucho,
// tiene sentido añadir un endpoint dedicado más adelante.
export default function CarDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [coche, setCoche] = useState(null);
    const [fotos, setFotos] = useState([]);
    const [imagenActiva, setImagenActiva] = useState(null);
    const [comentarios, setComentarios] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState('');
    const [cargando, setCargando] = useState(true);
    const [enviandoComentario, setEnviandoComentario] = useState(false);
    const [subiendoFoto, setSubiendoFoto] = useState(false);
    const [confirmandoEliminar, setConfirmandoEliminar] = useState(false);
    const { mostrarToast } = useToast();

    const cargar = () => {
        let activo = true;
        setCargando(true);
        Promise.all([
            api.get('/coches-detallados'),
            api.get(`/coches/${id}/comentarios`),
            api.get(`/coches/${id}/fotos`)
        ]).then(([cochesRes, comentariosRes, fotosRes]) => {
            if (!activo) return;
            const encontrado = cochesRes.data.find(c => String(c.id) === String(id));
            setCoche(encontrado || null);
            setComentarios(comentariosRes.data);
            setFotos(fotosRes.data);
            setImagenActiva(null);
        }).catch(err => {
            console.error('Error loading car:', err);
        }).finally(() => {
            if (activo) setCargando(false);
        });
        return () => { activo = false; };
    };

    useEffect(cargar, [id]);

    const esPropietario = user && coche && String(user.id) === String(coche.propietario_id);

    const handleLike = async () => {
        if (!user) return mostrarToast("Log in to like this", "error");
        try {
            const res = await api.post(`/coches/${id}/like`);
            setCoche(prev => ({
                ...prev,
                total_likes: res.data.liked ? (parseInt(prev.total_likes || 0) + 1) : Math.max(0, parseInt(prev.total_likes || 0) - 1),
                user_liked: res.data.liked
            }));
        } catch (err) {
            console.error('Error liking car:', err);
        }
    };

    const postComentario = async (e) => {
        e.preventDefault();
        if (!nuevoComentario.trim()) return;
        setEnviandoComentario(true);
        try {
            const res = await api.post(`/coches/${id}/comentarios`, { contenido: nuevoComentario });
            setComentarios(prev => [...prev, { ...res.data, autor: user?.nombre || 'You' }]);
            setNuevoComentario('');
        } catch (err) {
            mostrarToast(err.response?.data?.error || "Error posting comment", "error");
        } finally {
            setEnviandoComentario(false);
        }
    };

    const handleSubirFoto = async (e) => {
        const archivo = e.target.files[0];
        if (!archivo) return;
        setSubiendoFoto(true);
        try {
            const formData = new FormData();
            formData.append('foto', archivo);
            const res = await api.post(`/coches/${id}/fotos`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFotos(prev => [...prev, res.data]);
        } catch (err) {
            mostrarToast(err.response?.data?.error || "Error uploading photo", "error");
        } finally {
            setSubiendoFoto(false);
        }
    };

    const handleEliminarFoto = async (fotoId) => {
        try {
            await api.delete(`/coches/${id}/fotos/${fotoId}`);
            setFotos(prev => prev.filter(f => f.id !== fotoId));
            setImagenActiva(prev => prev === fotoId ? null : prev);
        } catch (err) {
            console.error('Error deleting photo:', err);
        }
    };

    const handleEliminarCoche = async () => {
        setConfirmandoEliminar(false);
        try {
            await api.delete(`/coches/${id}`);
            navigate('/garaje');
        } catch (err) {
            mostrarToast(err.response?.data?.error || "Error deleting car", "error");
        }
    };

    if (cargando) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white pt-24">Loading...</div>;

    if (!coche) return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white pt-24 gap-4 px-4 text-center">
            <p className="text-zinc-400">This car could not be found.</p>
            <Link to="/" className="text-red-500 hover:underline">Back to the global garage</Link>
        </div>
    );

    // La imagen grande activa: por defecto la principal; si se elige una de
    // la galería, se muestra esa.
    const urlImagenGrande = imagenActiva
        ? getImagenCoche(fotos.find(f => f.id === imagenActiva)?.foto_url, coche.id, coche.marca)
        : getImagenCoche(coche.foto_url, coche.id, coche.marca);

    return (
        <div className="min-h-screen bg-zinc-950 pt-24 pb-12 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm">
                        <ArrowLeft size={18} /> Back
                    </button>
                    {esPropietario && (
                        <div className="flex items-center gap-3">
                            <Link to={`/coches/${id}/editar`} className="flex items-center gap-1 text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-full transition">
                                <Pencil size={12} /> Edit
                            </Link>
                            <button onClick={() => setConfirmandoEliminar(true)} className="flex items-center gap-1 text-xs font-bold bg-red-950 hover:bg-red-900 text-red-400 px-3 py-1.5 rounded-full transition">
                                <Trash2 size={12} /> Delete
                            </button>
                        </div>
                    )}
                </div>

                <div className="bg-zinc-900 rounded-3xl overflow-hidden border border-white/10 flex flex-col md:flex-row">
                    <div className="md:flex-[1.5] flex flex-col">
                        <div className="bg-black flex items-center justify-center p-4 max-h-[50vh] md:max-h-[65vh]">
                            <img
                                src={urlImagenGrande}
                                className="max-h-full max-w-full object-contain rounded-xl"
                                alt={coche.modelo}
                                onError={(event) => fallbackImagen(event, getImagenCoche(null, coche.id, coche.marca))}
                            />
                        </div>

                        {/* Galería: foto principal + fotos adicionales */}
                        <div className="flex gap-2 p-4 overflow-x-auto">
                            <button
                                onClick={() => setImagenActiva(null)}
                                className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 ${imagenActiva === null ? 'border-red-600' : 'border-transparent opacity-60'}`}
                            >
                                <img
                                    src={getImagenCoche(coche.foto_url, coche.id, coche.marca)}
                                    className="w-full h-full object-cover"
                                    alt="Main photo"
                                    onError={(event) => fallbackImagen(event, getImagenCoche(null, coche.id, coche.marca))}
                                />
                            </button>
                            {fotos.map(f => (
                                <div key={f.id} className="relative shrink-0 group">
                                    <button
                                        onClick={() => setImagenActiva(f.id)}
                                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${imagenActiva === f.id ? 'border-red-600' : 'border-transparent opacity-60'}`}
                                    >
                                        <img
                                            src={getImagenCoche(f.foto_url, coche.id, coche.marca)}
                                            className="w-full h-full object-cover"
                                            alt=""
                                            onError={(event) => fallbackImagen(event, getImagenCoche(null, coche.id, coche.marca))}
                                        />
                                    </button>
                                    {esPropietario && (
                                        <button
                                            onClick={() => handleEliminarFoto(f.id)}
                                            className="absolute -top-1 -right-1 bg-black/80 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                                            title="Remove this photo"
                                        >
                                            <X size={12} className="text-white" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            {esPropietario && (
                                <label className="w-16 h-16 shrink-0 rounded-lg border-2 border-dashed border-zinc-700 flex items-center justify-center cursor-pointer hover:border-red-600 transition">
                                    {subiendoFoto ? (
                                        <span className="text-[9px] text-zinc-500">Uploading…</span>
                                    ) : (
                                        <Plus size={20} className="text-zinc-600" />
                                    )}
                                    <input type="file" accept="image/*" className="hidden" onChange={handleSubirFoto} disabled={subiendoFoto} />
                                </label>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col border-t md:border-t-0 md:border-l border-white/10">
                        <div className="p-6 sm:p-8 border-b border-white/10">
                            <p className="text-red-500 text-xs font-black uppercase mb-2">{coche.marca} · {coche.año || 'Year not specified'}</p>
                            <h1 className="text-2xl sm:text-3xl font-black italic uppercase leading-none mb-4 text-white">{coche.modelo}</h1>

                            {(coche.potencia_cv || coche.kilometraje || coche.color) && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {coche.potencia_cv && (
                                        <span className="flex items-center gap-1 bg-zinc-800 text-zinc-300 text-xs font-bold px-3 py-1.5 rounded-full">
                                            <Gauge size={12} className="text-red-500" /> {coche.potencia_cv} CV
                                        </span>
                                    )}
                                    {coche.kilometraje && (
                                        <span className="flex items-center gap-1 bg-zinc-800 text-zinc-300 text-xs font-bold px-3 py-1.5 rounded-full">
                                            <MapPin size={12} className="text-red-500" /> {parseInt(coche.kilometraje).toLocaleString('en-US')} km
                                        </span>
                                    )}
                                    {coche.color && (
                                        <span className="flex items-center gap-1 bg-zinc-800 text-zinc-300 text-xs font-bold px-3 py-1.5 rounded-full">
                                            <Palette size={12} className="text-red-500" /> {coche.color}
                                        </span>
                                    )}
                                </div>
                            )}

                            <p className="text-zinc-400 text-sm italic border-l-2 border-red-600 pl-4">
                                {coche.descripcion || 'No description.'}
                            </p>
                            <p className="text-zinc-600 text-xs mt-4">
                                Posted by{' '}
                                <Link to={`/usuarios/${coche.propietario_id}`} className="text-zinc-400 hover:text-red-500 underline">
                                    {coche.nombre_propietario}
                                </Link>
                            </p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-4 max-h-96">
                            {comentarios.length === 0 && <p className="text-zinc-600 text-sm">No comments yet.</p>}
                            {comentarios.map(com => (
                                <div key={com.id} className="text-sm bg-zinc-800/40 p-3 rounded-2xl">
                                    <span className="font-black text-red-500 mr-2 uppercase text-[10px]">{com.autor}:</span>
                                    <span className="text-zinc-300">{com.contenido}</span>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 sm:p-8 border-t border-white/10 bg-zinc-900/50">
                            <button onClick={handleLike} className="flex items-center gap-2 mb-6">
                                <Heart size={26} className={coche.user_liked ? 'text-red-500 fill-red-500' : 'text-white'} />
                                <span className="text-xs font-black uppercase text-white">{coche.total_likes ?? 0} Likes</span>
                            </button>
                            {user ? (
                                <form onSubmit={postComentario} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={nuevoComentario}
                                        onChange={(e) => setNuevoComentario(e.target.value)}
                                        placeholder="Add a comment..."
                                        className="flex-1 bg-zinc-800 rounded-2xl px-5 py-3 text-sm text-white focus:outline-none"
                                    />
                                    <button type="submit" disabled={enviandoComentario} className="bg-red-600 disabled:opacity-50 p-3 rounded-2xl">
                                        <Send size={18} />
                                    </button>
                                </form>
                            ) : (
                                <p className="text-xs text-zinc-600 text-center uppercase italic font-black">Log in to comment</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmModal
                abierto={confirmandoEliminar}
                titulo="Delete car"
                mensaje={`Are you sure you want to delete ${coche.marca} ${coche.modelo}? This action cannot be undone.`}
                onConfirmar={handleEliminarCoche}
                onCancelar={() => setConfirmandoEliminar(false)}
            />
        </div>
    );
}
