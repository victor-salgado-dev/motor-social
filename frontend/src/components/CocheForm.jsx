import { useState } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { CarFront, Send, Camera } from 'lucide-react';

// coche: si se pasa, es modo edición (prellena los campos y usa PUT).
// Si no se pasa, es modo creación (POST). onGuardado recibe el coche resultante.
export default function CocheForm({ coche = null, onGuardado }) {
    const esEdicion = !!coche;
    const { mostrarToast } = useToast();
    const [form, setForm] = useState({
        marca: coche?.marca || '',
        modelo: coche?.modelo || '',
        año: coche?.año || '',
        descripcion: coche?.descripcion || '',
        potencia_cv: coche?.potencia_cv || '',
        kilometraje: coche?.kilometraje || '',
        color: coche?.color || '',
    });
    const [foto, setFoto] = useState(null);
    const [enviando, setEnviando] = useState(false);

    const campo = (key, label, props = {}) => (
        <div>
            <label className="text-xs font-bold text-zinc-500 uppercase ml-1">{label}</label>
            <input
                value={form[key]}
                className="w-full bg-zinc-800 border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-red-600 outline-none transition"
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                {...props}
            />
        </div>
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEnviando(true);
        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                if (value) formData.append(key, value);
            });
            if (foto) formData.append('foto', foto);

            const res = esEdicion
                ? await api.put(`/coches/${coche.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
                : await api.post('/coches', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

            onGuardado(res.data);
            mostrarToast(esEdicion ? "Car updated" : "Car published", "exito");
        } catch (err) {
            mostrarToast(err.response?.data?.error || "Error saving car", "error");
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-white/10 h-fit">
            <div className="flex items-center gap-3 mb-8">
                <CarFront className="text-red-600" size={32} />
                <h2 className="text-2xl font-bold text-white">
                    {esEdicion ? <>Edit <span className="text-red-600">Car</span></> : <>Add to <span className="text-red-600">Garage</span></>}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    {campo('marca', 'Make', { required: true, placeholder: 'e.g. Porsche' })}
                    {campo('modelo', 'Model', { required: true, placeholder: 'e.g. 911 GT3' })}
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {campo('año', 'Year', { type: 'number', placeholder: '2023' })}
                    {campo('potencia_cv', 'HP', { type: 'number', placeholder: '450' })}
                    {campo('color', 'Color', { placeholder: 'Red' })}
                </div>
                {campo('kilometraje', 'Mileage (km)', { type: 'number', placeholder: '45000' })}
                <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Description</label>
                    <textarea
                        value={form.descripcion}
                        className="w-full bg-zinc-800 border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-red-600 outline-none transition h-24 resize-none"
                        placeholder="Technical details, history, modifications..."
                        onChange={e => setForm({ ...form, descripcion: e.target.value })}
                    />
                </div>
                <div className="relative bg-zinc-800 p-6 rounded-xl border-2 border-dashed border-zinc-700 text-center">
                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setFoto(e.target.files[0])} />
                    <Camera className="mx-auto mb-2 text-zinc-500" size={28} />
                    <p className="text-xs text-zinc-500">
                        {foto ? foto.name : (esEdicion ? "Change main photo (optional)" : "Upload a photo (optional)")}
                    </p>
                </div>
                <button type="submit" disabled={enviando} className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl mt-4 flex items-center justify-center gap-2 transition">
                    <Send size={18} /> {enviando ? "Saving..." : (esEdicion ? "Save changes" : "Publish")}
                </button>
            </form>
        </div>
    );
}
