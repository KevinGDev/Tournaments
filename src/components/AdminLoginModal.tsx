'use client'

import { useState } from 'react'
import { loginAdminAction } from '@/app/actions'
import { useRouter } from 'next/navigation'

export default function AdminLoginModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    // 1. Montage conditionnel : si ce n'est pas ouvert, on ne rend rien du tout.
    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-bg-panel border border-steel/30 p-8 rounded-xl shadow-2xl w-80"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-text-main font-bold mb-6 uppercase tracking-widest text-center">
                    Accès administrateur
                </h2>

                <form onSubmit={async (e) => {
                    e.preventDefault();
                    setIsLoading(true);
                    setError('');

                    const result = await loginAdminAction(password);

                    if (result.success) {
                        onClose();
                        router.push('/admin');
                        router.refresh();
                    } else {
                        setError(result.message || "Code incorrect");
                        setIsLoading(false);
                    }
                }} className="space-y-4">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Code secret"
                        className="w-full p-3 bg-bg-dark border border-steel/30 rounded text-text-main focus:border-blood outline-none"
                        required
                        disabled={isLoading}
                    />
                    {error && <p className="text-blood text-xs text-center font-bold">{error}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blood hover:bg-blood/90 text-white font-bold py-3 rounded transition-all disabled:opacity-50"
                    >
                        {isLoading ? "Vérification..." : "Se connecter"}
                    </button>
                </form>

                <button
                    onClick={onClose}
                    className="mt-6 text-steel text-sm w-full hover:text-text-main transition-colors"
                >
                    Fermer
                </button>
            </div>
        </div>
    )
}