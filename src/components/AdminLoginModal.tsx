'use client'

import { useState } from 'react'
import { loginAdminAction } from '@/app/actions'
import { useRouter } from 'next/navigation'

export default function AdminLoginModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        const result = await loginAdminAction(password)

        if (result.success) {
            onClose()
            router.push('/admin')
            router.refresh()
        } else {
            setError(result.message || "Code incorrect")
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-dark/80 backdrop-blur-sm">
            <div className="bg-bg-panel border border-steel/30 p-8 rounded-xl shadow-2xl w-80">
                <h2 className="text-text-main font-bold mb-6 uppercase tracking-widest">Accès administrateur</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Code secret"
                        className="w-full p-3 bg-bg-dark border border-steel/30 rounded text-text-main focus:border-blood outline-none"
                        required
                    />

                    {error && <p className="text-blood text-xs">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-blood hover:bg-blood/90 text-white font-bold py-3 rounded transition-all"
                    >
                        Se connecter
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