import { useProjectStore } from '../../store/useProjectStore'
import type { ToolType } from '../../types'
import { useState } from 'react';
import { ColorPickerModal } from '../ToolBar/ColorPickerModal';
import { Pencil, Eraser, PaintBucket, Pipette, Undo2, Redo2, Slash, Square, Circle } from 'lucide-react'

const TOOLS: { id: ToolType; label: string; icon: React.ElementType }[] = [
    { id: 'pencil', label: 'Crayon', icon: Pencil },
    { id: 'eraser', label: 'Gomme', icon: Eraser },
    { id: 'bucket', label: 'Remplir', icon: PaintBucket },
    { id: 'eyedropper', label: 'Pipette', icon: Pipette },
    { id: 'line', label: 'Ligne', icon: Slash },
    { id: 'square', label: 'Rectangle', icon: Square },
    { id: 'circle', label: 'Cercle', icon: Circle }
]

function Toolbar() {
    const { currentTool, setTool, currentColor, setColor, undo, redo } = useProjectStore()
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    return (
        <div className="w-16 bg-slate-900/80 backdrop-blur-md border-r border-slate-800 flex flex-col items-center py-4 gap-4 shrink-0 z-20 shadow-xl">
            <div className="flex flex-col gap-2 w-full px-2">
                {TOOLS.map((t) => {
                    const Icon = t.icon
                    return (
                        <button
                            key={t.id}
                            onClick={() => setTool(t.id)}
                            title={t.label}
                            className={`aspect-square rounded-xl flex items-center justify-center transition-all duration-200 ${
                                currentTool === t.id 
                                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 scale-105' 
                                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                            }`}
                        >
                            <Icon size={20} strokeWidth={currentTool === t.id ? 2.5 : 2} />
                        </button>
                    )
                })}
            </div>

            <div className="h-px w-8 bg-slate-700/50 my-2" />

            <button
                onClick={() => setIsPickerOpen(true)}
                className="relative w-10 h-10 rounded-xl border-2 border-slate-600 hover:border-slate-400 transition-all shadow-lg hover:scale-105"
                style={{ backgroundColor: currentColor }}
                title="Choisir une couleur"
            />
            <ColorPickerModal
                isOpen={isPickerOpen}
                currentColor={currentColor}
                onClose={() => setIsPickerOpen(false)}
                onColorChange={setColor}
            />

            <div className="mt-auto flex flex-col gap-2 w-full px-2">
                <button onClick={undo} className="aspect-square text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl flex items-center justify-center transition-colors" title="Annuler (Ctrl+Z)">
                    <Undo2 size={20} />
                </button>
                <button onClick={redo} className="aspect-square text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl flex items-center justify-center transition-colors" title="Rétablir (Ctrl+Y)">
                    <Redo2 size={20} />
                </button>
            </div>
        </div>
    )
}

export default Toolbar;