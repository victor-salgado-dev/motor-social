import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Avatar from '../components/Avatar';
import { Camera, Save } from 'lucide-react';

export default function EditProfile() {
    const { user, actualizarPerfilLocal } = useAuth();
    const { mostrarToast } = useToast();
    const navigate = useNavigate();
    const [nombre, setNombre] = useState('');
    const [bio, setBio] = useState('');
    const [avatarActual, setAvatarActual] = useState(null);
    const [nuevoAvatar, setNuevoAvatar] = useState(null);
    const [previa, setPrevia] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        if (!user) return;
        api.get(`/usuarios/${user.id}`)
            .then(res => {
                setNombre(res.data.nombre || '');
                setBio(res.data.bio || '');
                setAvatarActual(res.data.avatar_url);
            })
            .catch(err => console.error('Error loading profile:', err))
            .finally(() => setCargando(false));
    }, [user]);

    const handleAvatarChange = (e) => {
        const archivo = e.target.files[0];
        if (!archivo) return;
        setNuevoAvatar(archivo);
        setPrevia(URL.createObjectURL(archivo));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nombre.trim()) return mostrarToast("Name cannot be empty", "error");
        setGuardando(true);
        try {
            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('bio', bio);
            if (nuevoAvatar) formData.append('avatar', nuevoAvatar);

            const res = await api.put('/perfil', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            actualizarPerfilLocal({ nombre: res.data.nombre, avatar_url: res.data.avatar_url });
            mostrarToast("Profile updated", "exito");
            navigate(`/usuarios/${user.id}`);
        } catch (err) {
            mostrarToast(err.response?.data?.error || "Error saving profile", "error");
        } finally {
            setGuardando(false);
        }
    };

    if (cargando) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white pt-24">Loading...</div>;

    return (
        <div className="min-h-screen pt-28 sm:pt-32 pb-16 px-4 flex justify-center bg-zinc-950">
            <div className="w-full max-w-md bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-white/10 h-fit">
                <h2 className="text-2xl font-bold text-white mb-8">Edit <span className="text-red-600">Profile</span></h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex flex-col items-center gap-3">
                        {previa ? (
                            <img src={previa} alt="Preview" className="w-24 h-24 rounded-full object-cover border border-white/10" />
                        ) : (
                            <Avatar nombre={nombre} avatarUrl={avatarActual} tamaño="w-24 h-24 text-3xl" />
                        )}
                        <label className="text-xs font-bold text-zinc-400 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-full cursor-pointer flex items-center gap-2 transition">
                            <Camera size={14} /> Change photo
                            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                        </label>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Name</label>
                        <input
                            required
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            className="w-full bg-zinc-800 border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-red-600 outline-none transition"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Bio</label>
                        <textarea
                            value={bio}
                            onChange={e => setBio(e.target.value)}
                            placeholder="Tell us about yourself and your passion for cars..."
                            className="w-full bg-zinc-800 border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-red-600 outline-none transition h-28 resize-none"
                        />
                    </div>

                    <button type="submit" disabled={guardando} className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl mt-2 flex items-center justify-center gap-2 transition">
                        <Save size={18} /> {guardando ? "Saving..." : "Save changes"}
                    </button>
                </form>
            </div>
        </div>
    );
}
