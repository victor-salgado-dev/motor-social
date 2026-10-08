import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Avatar from '../components/Avatar';
import { ArrowLeft } from 'lucide-react';

// tipo="seguidores" -> GET /usuarios/:id/seguidores (quién le sigue a él)
// tipo="seguidos"   -> GET /usuarios/:id/seguidos   (a quién sigue él)
export default function FollowList({ tipo }) {
    const { id } = useParams();
    const [personas, setPersonas] = useState([]);
    const [nombrePerfil, setNombrePerfil] = useState('');
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        let activo = true;
        setCargando(true);
        Promise.all([
            api.get(`/usuarios/${id}`),
            api.get(`/usuarios/${id}/${tipo}`)
        ]).then(([perfilRes, listaRes]) => {
            if (!activo) return;
            setNombrePerfil(perfilRes.data.nombre);
            setPersonas(listaRes.data);
        }).catch(err => console.error('Error loading list:', err))
            .finally(() => { if (activo) setCargando(false); });
        return () => { activo = false; };
    }, [id, tipo]);

    const titulo = tipo === 'seguidores' ? 'Followers' : 'Following';

    if (cargando) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white pt-24">Loading...</div>;

    return (
        <div className="min-h-screen bg-zinc-950 pt-24 pb-12 px-4">
            <div className="max-w-md mx-auto">
                <Link to={`/usuarios/${id}`} className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-6">
                    <ArrowLeft size={18} /> Back to profile
                </Link>

                <h1 className="text-xl font-black uppercase italic text-white mb-6">
                    {titulo} de <span className="text-red-600">{nombrePerfil}</span>
                </h1>

                {personas.length === 0 ? (
                    <p className="text-zinc-600 text-sm">
                        {tipo === 'seguidores' ? 'No followers yet.' : 'Not following anyone yet.'}
                    </p>
                ) : (
                    <div className="space-y-2">
                        {personas.map(p => (
                            <Link
                                key={p.id}
                                to={`/usuarios/${p.id}`}
                                className="flex items-center gap-3 bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-2xl p-4 transition"
                            >
                                <Avatar nombre={p.nombre} avatarUrl={p.avatar_url} tamaño="w-10 h-10" />
                                <span className="font-bold text-white">{p.nombre}</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
