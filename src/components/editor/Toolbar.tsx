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
    { id: 'line', label: 'Ligne', icon:Slash},
    { id: 'square', label: 'Square', icon:Square},
    { id: 'circle', label: 'Circle', icon:Circle}
]

function Toolbar() {
    const { currentTool, setTool, currentColor, setColor, undo, redo } = useProjectStore()
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    return (
        <div className="w-16 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4 gap-4 shrink-0 z-10">
            <div className="flex flex-col gap-2 w-full px-2">
                {TOOLS.map((t) => {
                    const Icon = t.icon
                    return (
                        <button
                            key={t.id}
                            onClick={() => setTool(t.id)}
                            title={t.label}
                            className={`aspect-square rounded flex items-center justify-center transition-all ${
                                currentTool === t.id 
                                ? 'bg-blue-600 text-white shadow-lg' 
                                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                            <Icon size={20} />
                        </button>
                    )
                })}
            </div>

            <div className="h-px w-8 bg-gray-700 my-2" />

            <button
                onClick={() => setIsPickerOpen(true)}
                className="relative w-10 h-10 rounded border-2 border-gray-600 hover:border-gray-400 transition-all shadow-lg hover:scale-105"
                style={{ backgroundColor: currentColor }}
                title="Pick a color"
            />
            <ColorPickerModal
                isOpen={isPickerOpen}
                currentColor={currentColor}
                onClose={() => setIsPickerOpen(false)}
                onColorChange={setColor}
            />

            <div className="mt-auto flex flex-col gap-2 w-full px-2">
                <button onClick={undo} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded flex justify-center" title="Undo (Ctrl+Z)">
                    <Undo2 size={20} />
                </button>
                <button onClick={redo} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded flex justify-center" title="Redo (Ctrl+Y)">
                    <Redo2 size={20} />
                </button>
            </div>
        </div>
    )
}

export default Toolbar;