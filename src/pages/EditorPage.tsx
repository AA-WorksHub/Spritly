import Navbar from '../components/editor/Navbar'
import Toolbar from '../components/editor/Toolbar'
import Canvas from '../components/editor/Canvas'
import LayersPanel from '../components/editor/LayersPanel'
import Timeline from '../components/editor/Timeline'

function EditorPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Toolbar />
                <div className="flex flex-col flex-1">
                    <Canvas />
                    <Timeline />
                </div>
                <LayersPanel />
            </div>
        </div>
    )
}

export default EditorPage