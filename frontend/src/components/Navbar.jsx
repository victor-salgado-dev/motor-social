import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Avatar from './Avatar';
import { Car, LogOut, PlusSquare, LogIn, Bell, Menu, X } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [noLeidas, setNoLeidas] = useState(0);
    const [menuAbierto, setMenuAbierto] = useState(false);

    useEffect(() => {
        if (!user) return;
        const cargarContador = () => {
            api.get('/notificaciones/contador')
                .then(res => setNoLeidas(res.data.no_leidas))
                .catch(() => {});
        };
        cargarContador();
        // Sondeo simple, sin WebSocket: suficiente para un demo.
        const intervalo = setInterval(cargarContador, 20000);
        return () => clearInterval(intervalo);
    }, [user]);

    // Los enlaces de texto están ocultos en pantallas pequeñas (hidden
    // sm:inline) para no saturar la barra; en móvil viven en este menú.
    const enlacesPrincipales = [
        { to: '/', texto: 'Global' },
        { to: '/publicaciones', texto: 'Posts' },
        { to: '/descubrir', texto: 'Discover' },
        ...(user ? [
            { to: '/garaje', texto: 'My Garage' },
            { to: '/siguiendo', texto: 'Following' },
        ] : []),
    ];

    const cerrarMenu = () => setMenuAbierto(false);

    return (
        <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
            <div className="px-4 sm:px-6 py-4 flex justify-between items-center">
                <Link to="/" onClick={cerrarMenu} className="text-xl sm:text-2xl font-black tracking-tighter flex items-center gap-2 italic">
                    <div className="bg-red-600 p-1 rounded-sm">
                        <Car size={22} color="white" />
                    </div>
                    <span className="text-white">MOTOR<span className="text-red-600 font-light">SOCIAL</span></span>
                </Link>

                <div className="flex items-center gap-4 sm:gap-6">
                    {enlacesPrincipales.map(e => (
                        <Link key={e.to} to={e.to} className="hidden sm:inline text-sm text-zinc-400 hover:text-white transition-colors">
                            {e.texto}
                        </Link>
                    ))}
                    {user ? (
                        <>
                            <Link to="/create" className="text-zinc-300 hover:text-red-500 transition-colors" title="Add a car">
                                <PlusSquare size={22} />
                            </Link>
                            <Link to="/notificaciones" className="relative text-zinc-300 hover:text-red-500 transition-colors" title="Notifications">
                                <Bell size={22} />
                                {noLeidas > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                        {noLeidas > 9 ? '9+' : noLeidas}
                                    </span>
                                )}
                            </Link>
                            <Link to={`/usuarios/${user.id}`} title="My profile">
                                <Avatar nombre={user.nombre} avatarUrl={user.avatar_url} tamaño="w-8 h-8 text-sm" />
                            </Link>
                            <button onClick={() => { logout(); navigate('/'); }} className="hidden sm:block text-zinc-400 hover:text-white" title="Log out">
                                <LogOut size={20} />
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="hidden sm:flex items-center gap-2 bg-white text-black px-3 sm:px-4 py-2 rounded-full font-bold text-xs sm:text-sm hover:bg-zinc-200 transition">
                            <LogIn size={16} /> LOGIN
                        </Link>
                    )}

                    {/* Botón de menú, solo en móvil: es la única forma de llegar a
                        Global/Publicaciones/Descubrir/Mi Garaje/Siguiendo ahí,
                        ya que esos enlaces de texto se ocultan en pantallas pequeñas. */}
                    <button onClick={() => setMenuAbierto(v => !v)} className="sm:hidden text-zinc-300" title="Menu">
                        {menuAbierto ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {menuAbierto && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="sm:hidden overflow-hidden border-t border-white/10 bg-black/95"
                    >
                        <div className="flex flex-col p-4 gap-1">
                            {enlacesPrincipales.map(e => (
                                <Link
                                    key={e.to}
                                    to={e.to}
                                    onClick={cerrarMenu}
                                    className="text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-xl px-4 py-3 text-sm font-bold transition-colors"
                                >
                                    {e.texto}
                                </Link>
                            ))}
                            {user ? (
                                <button
                                    onClick={() => { cerrarMenu(); logout(); navigate('/'); }}
                                    className="flex items-center gap-2 text-red-400 hover:bg-zinc-900 rounded-xl px-4 py-3 text-sm font-bold transition-colors text-left"
                                >
                                    <LogOut size={16} /> Log out
                                </button>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={cerrarMenu}
                                    className="flex items-center gap-2 bg-white text-black rounded-xl px-4 py-3 text-sm font-bold justify-center mt-2"
                                >
                                    <LogIn size={16} /> LOGIN
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
