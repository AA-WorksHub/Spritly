import { useState } from 'react'
import { useProjectStore } from '../../store/useProjectStore'
import { Link } from 'react-router-dom'
import { Download, ChevronDown } from 'lucide-react'
import { ProjectSettings } from './ProjectSettings'

function Navbar() {
    const { config, frames, layers } = useProjectStore()
    const [exportScale, setExportScale] = useState(10) // Par défaut 10x (ex: 32px -> 320px)

    const handleExport = () => {
        const scale = exportScale
        const canvas = document.createElement('canvas')
        
        // Taille totale de la spritesheet multipliée par l'échelle
        canvas.width = (config.width * frames.length) * scale
        canvas.height = config.height * scale
        
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // DÉSACTIVER LE LISSAGE (Secret du Pixel Art)
        ctx.imageSmoothingEnabled = false

        // Dessiner chaque frame
        frames.forEach((frame, frameIndex) => {
            const offsetX = frameIndex * config.width * scale;

            [...layers].reverse().forEach(layer => {
                if (layer.visible) {
                    const imgData = frame.layers.get(layer.id)
                    if (imgData) {
                        const tempCanvas = document.createElement('canvas')
                        tempCanvas.width = config.width
                        tempCanvas.height = config.height
                        tempCanvas.getContext('2d')?.putImageData(imgData, 0, 0)
                        
                        ctx.globalAlpha = layer.opacity
                        
                        // Dessiner la frame sur le canvas final avec mise à l'échelle
                        ctx.drawImage(
                            tempCanvas, 
                            0, 0, config.width, config.height, // Source
                            offsetX, 0, config.width * scale, config.height * scale // Destination
                        )
                    }
                }
            })
        });

        const link = document.createElement('a')
        link.download = `spritly-${config.width}x${config.height}-scaled.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
    }

    return (
        <div className="bg-gray-900 border-b border-gray-700 text-white px-4 h-12 flex items-center justify-between shrink-0 z-20 shadow-lg">
            <div className="flex items-center gap-4">
                <Link to="/" className="text-xl font-bold tracking-tighter hover:text-blue-400 transition-colors">
                    SPRITLY<span className="text-blue-500">.</span>
                </Link>
                <div className="h-4 w-px bg-gray-700" />
                <span className="text-[10px] bg-gray-800 border border-gray-700 px-2 py-0.5 rounded text-gray-400 font-mono">
                    {config.width}x{config.height}px
                </span>
            </div>

            <div className="flex items-center gap-3">
                {/* Sélecteur d'échelle d'export */}
                <div className="flex items-center bg-gray-800 border border-gray-700 rounded px-2 hover:border-gray-500 transition-colors">
                    <span className="text-[9px] text-gray-500 font-bold uppercase mr-2">Export Scale</span>
                    <div className="relative flex items-center">
                        <select 
                            value={exportScale} 
                            onChange={(e) => setExportScale(parseInt(e.target.value))}
                            className="bg-transparent text-xs py-1 pr-4 appearance-none focus:outline-none cursor-pointer font-bold text-blue-400"
                        >
                            <option value="1">1x</option>
                            <option value="2">2x</option>
                            <option value="4">4x</option>
                            <option value="8">8x</option>
                            <option value="10">10x</option>
                            <option value="20">20x</option>
                        </select>
                        <ChevronDown size={10} className="absolute right-0 pointer-events-none text-gray-500" />
                    </div>
                </div>

                <button 
                    onClick={handleExport} 
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded font-bold transition-all shadow-lg active:scale-95"
                >
                    <Download size={14} />
                    Export Sprite Sheet
                </button>

                <div className="h-4 w-px bg-gray-700 mx-1" />

                <ProjectSettings />
            </div>
        </div>
    )
}

export default Navbar