import React, { useEffect, useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'
import { useProjectStore } from '../../store/useProjectStore'

export const AnimationPreview = () => {
    const { frames, layers, config } = useProjectStore()
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [fps, setFps] = useState<number>(6)

    const [isPlaying, setIsPlaying] = useState(true)
    const [previewIndex, setPreviewIndex] = useState(0)

    useEffect(() => {
        if (!isPlaying || frames.length === 0)
            return
        const safeFps = fps > 0 ? fps : 1
        const interval = setInterval(() => {
            setPreviewIndex((prev) => (prev + 1) % frames.length)
        }, 1000 / safeFps)

        return () => clearInterval(interval)
    }, [isPlaying, frames.length, fps])
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas || frames.length === 0)
            return
        const ctx = canvas.getContext('2d')
        if (!ctx)
            return
        ctx.clearRect(0, 0, config.width, config.height)
        const currentFrame = frames[previewIndex]
        if (!currentFrame)
            return
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = config.width
        tempCanvas.height = config.height
        const tempCtx = tempCanvas.getContext('2d')
        if (!tempCtx)
            return
        const layersToDraw = [...layers].reverse()
        layersToDraw.forEach(layer => {
            if (!layer.visible) return
            const imageData = currentFrame.layers.get(layer.id)
            if (imageData) {
                tempCtx.putImageData(imageData, 0, 0)
                ctx.drawImage(tempCanvas, 0, 0)
            }
        })
    }, [previewIndex, frames, layers, config])

    const handleFpsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value === '' ? 0 : parseInt(e.target.value);
        if (!isNaN(val)) setFps(val);
    }

    return (
        <div className="flex flex-col border-b border-gray-700 bg-gray-900">
             <div className="flex items-center gap-1 bg-gray-800 rounded px-1 border border-gray-700 hover:border-gray-500 transition-colors">
                <input
                    type="number"
                    value={fps}
                    onChange={handleFpsChange}
                    className="w-8 bg-transparent text-right text-white focus:outline-none m-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-gray-500 select-none text-xs">FPS</span>
            </div>
            <div className="aspect-square w-full bg-gray-800 relative flex items-center justify-center p-4 border-b border-gray-700 overflow-hidden bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABtJREFUeNpiZGBqaGQACompTmQAURwYCBgAAAIMAAI3Xyl9AAAAAElFTkSuQmCC')]">
                <canvas
                    ref={canvasRef}
                    width={config.width}
                    height={config.height}
                    className="bg-white shadow-lg rendering-pixelated"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        imageRendering: 'pixelated'
                    }}
                />
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="absolute bottom-2 right-2 p-1.5 bg-black/50 hover:bg-blue-600 text-white rounded transition-colors"
                >
                    {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                </button>
            </div>
            <div className="px-3 py-1 bg-gray-800 text-gray-500 text-xs text-center border-b border-gray-700">
                Frame {previewIndex + 1} / {frames.length}
            </div>
        </div>
    )
}