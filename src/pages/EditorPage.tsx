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
        <div className="h-screen w-screen flex flex-col bg-gray-900 text-gray-300 overflow-hidden">
            <Navbar />
            
            <div className="flex-1 flex overflow-hidden">
                <Toolbar />
                
                {/* Zone centrale : Canvas + Timeline */}
                <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex-1 relative bg-[#2a2a2a] overflow-hidden shadow-inner flex flex-col">
                        <Canvas />
                    </div>
                    <Timeline />
                </div>

                <LayersPanel />
            </div>
        </div>
    )
}

export default EditorPage