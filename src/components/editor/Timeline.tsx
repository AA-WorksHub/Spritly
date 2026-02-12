import { useProjectStore } from '../../store/useProjectStore'
import { Plus, Trash2, Film, Copy } from 'lucide-react'
import { FramePreview } from './FramePreview'

function Timeline() {
    const { 
        frames, 
        layers,
        currentFrameIndex, 
        setCurrentFrame, 
        addFrame, 
        deleteFrame, 
        duplicateFrame, 
        config 
    } = useProjectStore()

    return (
        <div className="h-40 bg-gray-800 border-t border-gray-700 flex flex-col shrink-0 z-10">
            <div className="h-8 px-3 bg-gray-900 flex items-center justify-between border-b border-gray-700">
                <div className="flex items-center gap-2 text-gray-400">
                    <Film size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Animation</span>
                    <span className="text-xs text-gray-600 ml-2 border-l border-gray-700 pl-2">{config.fps} FPS</span>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto p-4 flex items-center gap-3">
                {frames.map((frame, index) => (
                    <div 
                        key={frame.id}
                        onClick={() => setCurrentFrame(index)}
                        className={`relative group min-w-[80px] h-[80px] bg-[#1a1a1a] border-2 rounded-md cursor-pointer flex items-center justify-center select-none overflow-hidden ${
                            index === currentFrameIndex ? 'border-blue-500 shadow-[0_0_0_2px_rgba(59,130,246,0.3)]' : 'border-gray-600 hover:border-gray-500'
                        }`}
                    >
                        {/* Prévisualisation du contenu de la frame */}
                        <div className="w-full h-full p-1">
                            <FramePreview 
                                frame={frame}
                                layers={layers}
                                width={config.width}
                                height={config.height}
                            />
                        </div>

                        {/* Numéro de la frame en superposition discrète */}
                        <span className="absolute bottom-1 left-1 text-[10px] font-bold text-gray-500 bg-black/50 px-1 rounded pointer-events-none">
                            {index + 1}
                        </span>

                        {/* Boutons d'action au survol */}
                        <div className="absolute -top-3 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                             <button 
                                onClick={(e) => { e.stopPropagation(); duplicateFrame(index) }}
                                className="w-6 h-6 bg-gray-700 text-white rounded-full flex items-center justify-center shadow-sm hover:bg-blue-600"
                                title="Dupliquer"
                            >
                                <Copy size={12} />
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); deleteFrame(index) }}
                                className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-600"
                                title="Supprimer"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    </div>
                ))}

                <button 
                    onClick={addFrame}
                    className="min-w-[80px] h-[80px] border-2 border-dashed border-gray-600 rounded-md flex items-center justify-center text-gray-500 hover:text-white hover:border-gray-400 hover:bg-gray-700/50 transition-all"
                >
                    <Plus size={24} />
                </button>
            </div>
        </div>
    )
}

export default Timeline