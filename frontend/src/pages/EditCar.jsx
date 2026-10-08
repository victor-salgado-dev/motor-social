import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import CocheForm from '../components/CocheForm';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function EditCar() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { mostrarToast } = useToast();
    const [coche, setCoche] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        api.get('/mis-coches')
            .then(res => {
                const encontrado = res.data.garaje.find(c => String(c.id) === String(id));
                if (encontrado) setCoche(encontrado);
                else {
                    mostrarToast("Car not found or you don't have permission to edit it", "error");
                    navigate('/garaje');
                }
            })
            .catch(err => {
                console.error(err);
                navigate('/garaje');
            })
            .finally(() => setCargando(false));
    }, [id, navigate]);

    if (cargando) return <div className="min-h-screen pt-32 text-center text-white bg-zinc-950">Loading...</div>;
    if (!coche) return null;

    return (
        <div className="min-h-screen pt-28 sm:pt-32 pb-16 px-4 flex justify-center bg-zinc-950">
            <CocheForm coche={coche} onGuardado={() => navigate(`/coches/${id}`)} />
        </div>
    );
}