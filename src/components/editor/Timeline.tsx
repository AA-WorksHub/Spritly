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
        <div className="h-44 bg-slate-900/80 backdrop-blur-md border-t border-slate-800 flex flex-col shrink-0 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
            <div className="h-10 px-4 bg-slate-900/50 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2 text-slate-300">
                    <Film size={16} className="text-blue-400" />
                    <span className="text-xs font-bold uppercase tracking-wider">Animation</span>
                    <span className="text-xs text-slate-500 ml-2 border-l border-slate-700 pl-2">{config.fps} FPS</span>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto p-4 flex items-center gap-4">
                {frames.map((frame, index) => (
                    <div 
                        key={frame.id}
                        onClick={() => setCurrentFrame(index)}
                        className={`relative group min-w-[80px] h-[80px] bg-slate-800/80 rounded-xl cursor-pointer flex items-center justify-center select-none overflow-hidden transition-all duration-200 ${
                            index === currentFrameIndex 
                            ? 'ring-2 ring-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] scale-105' 
                            : 'border border-slate-700 hover:border-slate-500'
                        }`}
                    >
                        <div className="w-full h-full p-2 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABtJREFUeNpiZGBqaGQACompTmQAURwYCBgAAAIMAAI3Xyl9AAAAAElFTkSuQmCC')]">
                            <FramePreview 
                                frame={frame}
                                layers={layers}
                                width={config.width}
                                height={config.height}
                            />
                        </div>

                        <span className="absolute bottom-1 left-1.5 text-[10px] font-bold text-slate-300 bg-slate-900/80 backdrop-blur-sm px-1.5 py-0.5 rounded pointer-events-none">
                            {index + 1}
                        </span>

                        <div className="absolute -top-2 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0 z-10">
                             <button 
                                onClick={(e) => { e.stopPropagation(); duplicateFrame(index) }}
                                className="w-6 h-6 bg-slate-700 text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-500 transition-colors"
                                title="Dupliquer"
                            >
                                <Copy size={12} />
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); deleteFrame(index) }}
                                className="w-6 h-6 bg-slate-700 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-500 transition-colors"
                                title="Supprimer"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    </div>
                ))}

                <button 
                    onClick={addFrame}
                    className="min-w-[80px] h-[80px] border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center text-slate-500 hover:text-blue-400 hover:border-blue-500 hover:bg-blue-500/10 transition-all"
                >
                    <Plus size={24} />
                </button>
            </div>
        </div>
    )
}

export default Timeline