import { useEffect } from 'react'
import { useProjectStore } from '../store/useProjectStore'
import Navbar from '../components/editor/Navbar'
import Toolbar from '../components/editor/Toolbar'
import Canvas from '../components/editor/Canvas'
import LayersPanel from '../components/editor/LayersPanel'
import Timeline from '../components/editor/Timeline'

function EditorPage() {
    const { undo, redo } = useProjectStore()

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault()
                undo()
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
                e.preventDefault()
                redo()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [undo, redo])

    return (
        <div className="h-screen w-screen flex flex-col bg-slate-900 text-slate-300 relative overflow-hidden">
            {/* Décoration d'arrière plan inspirée de la HomePage */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-10 bg-blue-500 blur-[120px] rounded-full pointer-events-none z-0"></div>

            {/* Contenu de l'éditeur (au dessus du fond) */}
            <div className="relative z-10 flex flex-col h-full w-full">
                <Navbar />
                
                <div className="flex-1 flex overflow-hidden">
                    <Toolbar />
                    
                    {/* Zone centrale : Canvas + Timeline */}
                    <div className="flex-1 flex flex-col min-w-0">
                        <div className="flex-1 relative overflow-hidden flex flex-col z-0">
                            <Canvas />
                        </div>
                        <Timeline />
                    </div>

                    <LayersPanel />
                </div>
            </div>
        </div>
    )
}

export default EditorPage