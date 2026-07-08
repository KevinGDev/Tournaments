'use client'
export default function AdminLoginModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-dark/80 backdrop-blur-sm">
            <div className="bg-bg-panel border border-steel/30 p-8 rounded-xl shadow-2xl w-80">
                <h2 className="text-text-main font-bold mb-6 uppercase tracking-widest">Accès administrateur</h2>
                <form action="/api/admin/login" method="POST" className="space-y-4">
                    <input type="password" name="password" placeholder="Code secret" className="w-full p-3 bg-bg-dark border border-steel/30 rounded text-text-main focus:border-blood outline-none" required />
                    <button type="submit" className="w-full bg-blood hover:bg-glow text-white font-bold py-3 rounded transition-all">Se connecter</button>
                </form>
                <button onClick={onClose} className="mt-6 text-steel text-sm w-full hover:text-text-main transition-colors">Fermer</button>
            </div>
        </div>
    )
}