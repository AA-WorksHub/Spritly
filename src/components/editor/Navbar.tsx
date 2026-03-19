import { useProjectStore } from '../../store/useProjectStore'
import { Link } from 'react-router-dom'

function Navbar() {
    const { config, frames, layers } = useProjectStore()

    const handleExport = () => {
        const canvas = document.createElement('canvas')
        
        // La largeur du canvas devient la largeur d'une frame multipliée par le nombre total de frames
        canvas.width = config.width * frames.length
        canvas.height = config.height
        
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Remplit le fond pour toute la sprite sheet
        ctx.fillStyle = config.backgroundColor
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Boucle sur chaque frame pour les dessiner côte à côte
        frames.forEach((frame, frameIndex) => {
            // Décalage horizontal pour la frame courante
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
                        // On dessine le contenu de la frame au bon endroit sur l'axe X
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
        <div className="bg-gray-900 border-b border-gray-700 text-white px-4 h-12 flex items-center justify-between shrink-0 z-20">
            <div className="flex items-center gap-4">
                <Link to="/" className="text-xl font-bold text-blue-400 hover:text-blue-300">Spritly</Link>
                <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400">
                    {config.width}x{config.height}px
                </span>
            </div>
            <div className="flex gap-2">
                <button onClick={handleExport} className="bg-blue-600 hover:bg-blue-500 text-xs px-3 py-1.5 rounded font-medium transition-colors">
                    Export Sprite Sheet
                </button>
            </div>
        </div>
    )
}

export default Navbar