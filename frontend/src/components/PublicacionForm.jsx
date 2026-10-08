import { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { Image, Send, CarFront } from 'lucide-react';

// publicacion: si se pasa, es modo edición (prellena y usa PUT).
export default function PublicacionForm({ publicacion = null, onGuardado }) {
    const esEdicion = !!publicacion;
    const { mostrarToast } = useToast();
    const [texto, setTexto] = useState(publicacion?.texto || '');
    const [cocheId, setCocheId] = useState(publicacion?.coche_id || '');
    const [imagen, setImagen] = useState(null);
    const [misCoches, setMisCoches] = useState([]);
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        api.get('/mis-coches')
            .then(res => setMisCoches(res.data.garaje))
            .catch(err => console.error('Error loading your cars:', err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!texto.trim() && !imagen && !publicacion?.imagen_url) {
            mostrarToast("Write something or add an image", "error");
            return;
        }
        setEnviando(true);
        try {
            const formData = new FormData();
            formData.append('texto', texto);
            if (cocheId) formData.append('coche_id', cocheId);
            if (imagen) formData.append('imagen', imagen);

            const res = esEdicion
                ? await api.put(`/publicaciones/${publicacion.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
                : await api.post('/publicaciones', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

            onGuardado(res.data);
            mostrarToast(esEdicion ? "Post updated" : "Post created", "exito");
        } catch (err) {
            mostrarToast(err.response?.data?.error || "Error saving post", "error");
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="w-full max-w-lg bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-white/10 h-fit">
            <h2 className="text-2xl font-bold text-white mb-6">
                {esEdicion ? <>Edit <span className="text-red-600">Post</span></> : <>New <span className="text-red-600">Post</span></>}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    value={texto}
                    onChange={e => setTexto(e.target.value)}
                    placeholder="What have you been up to with your car today?"
                    className="w-full bg-zinc-800 border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-red-600 outline-none transition h-28 resize-none"
                />

                {misCoches.length > 0 && (
                    <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase ml-1 flex items-center gap-1"><CarFront size={12} /> Tag a car (optional)</label>
                        <select
                            value={cocheId}
                            onChange={e => setCocheId(e.target.value)}
                            className="w-full bg-zinc-800 border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-red-600 outline-none transition"
                        >
                            <option value="">None</option>
                            {misCoches.map(c => (
                                <option key={c.id} value={c.id}>{c.marca} {c.modelo}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="relative bg-zinc-800 p-6 rounded-xl border-2 border-dashed border-zinc-700 text-center">
                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setImagen(e.target.files[0])} />
                    <Image className="mx-auto mb-2 text-zinc-500" size={28} />
                    <p className="text-xs text-zinc-500">
                        {imagen ? imagen.name : (esEdicion && publicacion.imagen_url ? "Change image (optional)" : "Add an image (optional)")}
                    </p>
                </div>

                <button type="submit" disabled={enviando} className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition">
                    <Send size={18} /> {enviando ? "Publishing..." : (esEdicion ? "Save changes" : "Publish")}
                </button>
            </form>
        </div>
    );
}
