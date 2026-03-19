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
        <div className="flex flex-col bg-slate-900/50">
             <div className="flex items-center justify-between p-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Preview</span>
                <div className="flex items-center gap-1.5 bg-slate-800 rounded-md px-2 py-0.5 border border-slate-700 hover:border-slate-500 transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                    <input
                        type="number"
                        value={fps}
                        onChange={handleFpsChange}
                        className="w-8 bg-transparent text-right text-slate-200 font-mono text-sm focus:outline-none m-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-slate-500 select-none text-xs font-medium">FPS</span>
                </div>
            </div>
            <div className="aspect-square w-full bg-slate-900 relative flex items-center justify-center border-y border-slate-800 overflow-hidden bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABtJREFUeNpiZGBqaGQACompTmQAURwYCBgAAAIMAAI3Xyl9AAAAAElFTkSuQmCC')]">
                <canvas
                    ref={canvasRef}
                    width={config.width}
                    height={config.height}
                    className="shadow-inner"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        imageRendering: 'pixelated'
                    }}
                />
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="absolute bottom-3 right-3 p-2 bg-slate-900/80 backdrop-blur shadow-lg border border-slate-700 hover:border-blue-500 hover:text-blue-400 text-slate-300 rounded-full transition-all hover:scale-110"
                >
                    {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                </button>
            </div>
            <div className="px-3 py-2 bg-slate-900/50 text-slate-400 text-xs text-center font-medium">
                Frame {previewIndex + 1} / {frames.length}
            </div>
        </div>
    )
}