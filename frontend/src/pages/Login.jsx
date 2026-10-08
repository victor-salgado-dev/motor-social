import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, Car, FlaskConical } from 'lucide-react';

const CUENTA_DEMO = {
    email: 'demo1@motorsocial.local',
    password: 'demo1234',
};

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [enviando, setEnviando] = useState(false);
    const { login } = useAuth();
    const { mostrarToast } = useToast();
    const navigate = useNavigate();

    const iniciarSesion = async (correo, clave) => {
        setEnviando(true);
        try {
            await login(correo, clave);
            navigate('/');
        } catch (err) {
            mostrarToast("Incorrect email or password", "error");
        } finally {
            setEnviando(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await iniciarSesion(email, password);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
            <div className="max-w-md w-full bg-zinc-900 p-10 rounded-3xl border border-white/5 shadow-2xl">
                <div className="text-center mb-10">
                    <div className="inline-flex p-3 bg-red-600 rounded-2xl mb-4">
                        <Car size={32} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-black italic tracking-tighter text-white">WELCOME TO MOTOR<span className="text-red-600">SOCIAL</span></h2>
                    <p className="text-zinc-500 mt-2">Log in to manage your garage</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                            <input 
                                type="email" 
                                required
                                className="w-full bg-zinc-800 border-none rounded-xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-red-600 outline-none transition"
                                placeholder="you@email.com"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                            <input 
                                type="password" 
                                required
                                className="w-full bg-zinc-800 border-none rounded-xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-red-600 outline-none transition"
                                placeholder="••••••••"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={enviando} className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition transform active:scale-95 shadow-lg shadow-red-900/20">
                        <LogIn size={20} /> {enviando ? "LOGGING IN..." : "ENTER THE GARAGE"}
                    </button>
                </form>

                <button
                    type="button"
                    disabled={enviando}
                    onClick={() => iniciarSesion(CUENTA_DEMO.email, CUENTA_DEMO.password)}
                    className="w-full mt-4 border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800 disabled:opacity-50 text-zinc-200 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition"
                >
                    <FlaskConical size={18} /> LOG IN WITH DEMO ACCOUNT
                </button>

                <p className="text-center mt-8 text-zinc-500 text-sm">
                    Don't have an account? <Link to="/register" className="text-red-500 font-bold hover:underline">Sign up here</Link>
                </p>
            </div>
        </div>
    );
}