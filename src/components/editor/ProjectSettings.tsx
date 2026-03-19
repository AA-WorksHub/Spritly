import { useState } from 'react'
import { useProjectStore } from '../../store/useProjectStore'
import { Settings2, AlertTriangle } from 'lucide-react'

export function ProjectSettings() {
    const { config, updateProjectSize } = useProjectStore()
    const [isOpen, setIsOpen] = useState(false)
    const [dims, setDims] = useState({ w: config.width, h: config.height })

    const handleApply = () => {
        if (dims.w > 0 && dims.h > 0) {
            updateProjectSize(dims.w, dims.h)
            setIsOpen(false)
        }
    }

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className={`p-1.5 rounded transition-colors ${isOpen ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                title="Paramètres du projet"
            >
                <Settings2 size={18} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl w-56 z-50">
                    <h4 className="text-xs font-bold mb-3 uppercase tracking-wider text-gray-400">Dimensions du Canvas</h4>
                    
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[10px] text-gray-500 block mb-1">Largeur</label>
                                <input 
                                    type="number" 
                                    value={dims.w} 
                                    onChange={e => setDims({...dims, w: parseInt(e.target.value) || 0})}
                                    className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-500 block mb-1">Hauteur</label>
                                <input 
                                    type="number" 
                                    value={dims.h} 
                                    onChange={e => setDims({...dims, h: parseInt(e.target.value) || 0})}
                                    className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {[16, 32, 64].map(size => (
                                <button 
                                    key={size}
                                    onClick={() => setDims({w: size, h: size})}
                                    className="text-[10px] bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-gray-300"
                                >
                                    {size}x{size}
                                </button>
                            ))}
                        </div>

                        <div className="p-2 bg-amber-900/20 border border-amber-900/50 rounded flex gap-2 items-start">
                            <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-amber-200/70 leading-tight">
                                Redimensionner réinitialise l'historique (Undo/Redo).
                            </p>
                        </div>

                        <button 
                            onClick={handleApply}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-1.5 rounded text-xs font-bold transition-colors"
                        >
                            Appliquer
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}