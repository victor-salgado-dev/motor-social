import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({ abierto, titulo, mensaje, onConfirmar, onCancelar }) {
    return (
        <AnimatePresence>
            {abierto && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={onCancelar}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={e => e.stopPropagation()}
                        className="bg-zinc-900 border border-white/10 rounded-3xl p-6 max-w-sm w-full"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-red-950 p-2 rounded-full shrink-0">
                                <AlertTriangle size={20} className="text-red-500" />
                            </div>
                            <h3 className="text-lg font-bold text-white">{titulo}</h3>
                        </div>
                        <p className="text-zinc-400 text-sm mb-6">{mensaje}</p>
                        <div className="flex gap-3">
                            <button onClick={onCancelar} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl transition">
                                Cancel
                            </button>
                            <button onClick={onConfirmar} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition">
                                Delete
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
