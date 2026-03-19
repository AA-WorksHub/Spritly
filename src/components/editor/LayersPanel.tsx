import { useProjectStore } from '../../store/useProjectStore'
import { Eye, EyeOff, Plus, Trash2, Layers } from 'lucide-react'
import { AnimationPreview } from './AnimationPreview'

function LayersPanel() {
    const { layers, currentLayerIndex, setCurrentLayer, addLayer, deleteLayer, toggleLayerVisibility } = useProjectStore()

    return (
        <div className="w-72 bg-slate-900/80 backdrop-blur-md border-l border-slate-800 flex flex-col shrink-0 z-20 shadow-[-4px_0_20px_rgba(0,0,0,0.2)] h-full">
            <AnimationPreview />
            <div className="h-10 px-4 bg-slate-900/50 flex items-center justify-between border-y border-slate-800 mt-0">
                <div className="flex items-center gap-2 text-slate-300">
                    <Layers size={16} className="text-blue-400" />
                    <span className="text-xs font-bold uppercase tracking-wider">Calques</span>
                </div>
                <button onClick={addLayer} className="text-slate-400 hover:text-white p-1.5 hover:bg-blue-600 rounded-md transition-colors" title="Nouveau calque">
                    <Plus size={16} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 min-h-0">
                {layers.map((layer, index) => (
                    <div 
                        key={layer.id}
                        onClick={() => setCurrentLayer(index)}
                        className={`group flex items-center gap-3 p-2.5 rounded-lg text-sm cursor-pointer select-none border transition-all duration-200 ${
                            index === currentLayerIndex
                            ? 'bg-blue-500/15 border-blue-500/30 text-white shadow-inner'
                            : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 text-slate-300'
                        }`}
                    >
                        <button
                            onClick={(e) => { e.stopPropagation(); toggleLayerVisibility(layer.id) }}
                            className={`w-6 flex justify-center transition-colors ${layer.visible ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-400'}`}
                        >
                            {layer.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                        <span className="flex-1 truncate font-medium">{layer.name}</span>
                        <button
                            onClick={(e) => { e.stopPropagation(); deleteLayer(layer.id) }}
                            className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded hover:bg-slate-700/50"
                            title="Supprimer le calque"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LayersPanel