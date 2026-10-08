import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User as UserIcon, MessageCircle, Heart } from 'lucide-react';
import { getImagenCoche } from '../utils/coche';
import { fallbackImagen } from '../utils/imagen';

// Rejilla de tarjetas de coche, reutilizada por Feed (global y "mi garaje")
// y por la página de perfil público. onLike es opcional: si no se pasa, el
// corazón se muestra pero no hace nada al pulsarlo.
export default function CocheGrid({ coches, onLike, ocultarPropietario = false }) {
    const navigate = useNavigate();

    if (coches.length === 0) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {coches.map((car, idx) => (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx * 0.05, 0.4) }}
                    key={car.id}
                    onClick={() => navigate(`/coches/${car.id}`)}
                    className="group cursor-pointer bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden hover:border-red-500/50 transition-all duration-300 shadow-2xl"
                >
                    <div className="relative h-56 sm:h-64 bg-zinc-800 overflow-hidden">
                        <img
                            src={getImagenCoche(car.foto_url, car.id, car.marca)}
                            alt={car.modelo}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(event) => fallbackImagen(event, getImagenCoche(null, car.id, car.marca))}
                        />
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-widest border border-white/10">
                            {car.marca}
                        </div>
                    </div>

                    <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-1 uppercase italic">{car.modelo}</h3>

                        <div className="flex gap-4 mb-6 mt-4 text-zinc-400 text-sm">
                            <div className="flex items-center gap-1">
                                <Calendar size={14} className="text-red-600" /> {car.año || '—'}
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            {!ocultarPropietario ? (
                                <div
                                    className="flex items-center gap-2 min-w-0 hover:opacity-80"
                                    onClick={(e) => { e.stopPropagation(); navigate(`/usuarios/${car.propietario_id}`); }}
                                >
                                    <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center shrink-0">
                                        <UserIcon size={14} />
                                    </div>
                                    <span className="text-sm font-medium text-zinc-300 truncate">{car.nombre_propietario}</span>
                                </div>
                            ) : <span />}
                            <div className="flex items-center gap-4 text-zinc-500 shrink-0">
                                <button
                                    onClick={(e) => { e.stopPropagation(); onLike && onLike(car.id); }}
                                    className="flex items-center gap-1 hover:text-red-500 transition"
                                >
                                    <Heart size={18} className={car.user_liked ? 'text-red-500 fill-red-500' : ''} />
                                    <span className="text-xs">{car.total_likes ?? 0}</span>
                                </button>
                                <MessageCircle size={18} />
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
