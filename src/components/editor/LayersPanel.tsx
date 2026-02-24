import { useProjectStore } from '../../store/useProjectStore'
import { Eye, EyeOff, Plus, Trash2, Layers } from 'lucide-react'
import { AnimationPreview } from './AnimationPreview'

function LayersPanel() {
    const { layers, currentLayerIndex, setCurrentLayer, addLayer, deleteLayer, toggleLayerVisibility } = useProjectStore()

    return (
        <div className="w-64 bg-gray-800 border-l border-gray-700 flex flex-col shrink-0 z-10 h-full">
            <AnimationPreview />
            <div className="h-10 px-3 bg-gray-900 flex items-center justify-between border-b border-gray-700 mt-0">
                <div className="flex items-center gap-2 text-gray-400">
                    <Layers size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Calques</span>
                </div>
                <button onClick={addLayer} className="text-gray-400 hover:text-white p-1 hover:bg-gray-700 rounded" title="Nouveau calque">
                    <Plus size={16} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1 min-h-0">
                {layers.map((layer, index) => (
                    <div 
                        key={layer.id}
                        onClick={() => setCurrentLayer(index)}
                        className={`group flex items-center gap-2 p-2 rounded text-sm cursor-pointer select-none border border-transparent ${
                            index === currentLayerIndex
                            ? 'bg-blue-600/20 border-blue-600/50 text-white'
                            : 'hover:bg-gray-700 text-gray-300'
                        }`}
                    >
                        <button
                            onClick={(e) => { e.stopPropagation(); toggleLayerVisibility(layer.id) }}
                            className={`w-6 flex justify-center hover:text-white ${layer.visible ? 'text-gray-300' : 'text-gray-600'}`}
                        >
                            {layer.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                        <span className="flex-1 truncate font-medium">{layer.name}</span>
                        <button
                            onClick={(e) => { e.stopPropagation(); deleteLayer(layer.id) }}
                            className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                            title="Supprimer le calque"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LayersPanel