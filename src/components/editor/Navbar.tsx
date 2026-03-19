import { useProjectStore } from '../../store/useProjectStore'
import { Link } from 'react-router-dom'
import { Download } from 'lucide-react'

function Navbar() {
    const { config, frames, layers } = useProjectStore()

    const handleExport = () => {
        const canvas = document.createElement('canvas')
        canvas.width = config.width * frames.length
        canvas.height = config.height
        
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.fillStyle = config.backgroundColor
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        frames.forEach((frame, frameIndex) => {
            const offsetX = frameIndex * config.width;
            [...layers].reverse().forEach(layer => {
                if (layer.visible) {
                    const imgData = frame.layers.get(layer.id)
                    if (imgData) {
                        const tempCanvas = document.createElement('canvas')
                        tempCanvas.width = config.width
                        tempCanvas.height = config.height
                        tempCanvas.getContext('2d')?.putImageData(imgData, 0, 0)
                        
                        ctx.globalAlpha = layer.opacity
                        ctx.drawImage(tempCanvas, offsetX, 0)
                    }
                }
            })
        });

        const link = document.createElement('a')
        link.download = 'spritly-spritesheet.png'
        link.href = canvas.toDataURL('image/png')
        link.click()
    }

    return (
        <div className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 text-slate-100 px-6 h-14 flex items-center justify-between shrink-0 z-20">
            <div className="flex items-center gap-6">
                <Link to="/" className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 hover:opacity-80 transition-opacity">
                    Spritly
                </Link>
                <div className="h-4 w-px bg-slate-700"></div>
                <span className="text-xs bg-slate-800/50 border border-slate-700 px-2 py-1.5 rounded-md text-slate-300 font-medium">
                    {config.width} × {config.height} px
                </span>
            </div>
            <div className="flex gap-3">
                <button 
                    onClick={handleExport} 
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg font-bold transition-all hover:scale-105 shadow-lg shadow-blue-500/25"
                >
                    <Download size={16} />
                    Export Sprite Sheet
                </button>
            </div>
        </div>
    )
}

export default Navbar