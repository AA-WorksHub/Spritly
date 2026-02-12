import { useEffect, useRef } from 'react'
import type { Frame, Layer } from '../../types'

interface Props {
    frame: Frame
    layers: Layer[]
    width: number
    height: number
}

export function FramePreview({ frame, layers, width, height }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.clearRect(0, 0, width, height)
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, width, height);
        [...layers].reverse().forEach(layer => {
            if (!layer.visible) return

            const imageData = frame.layers.get(layer.id)
            if (imageData) {
                const tempCanvas = document.createElement('canvas')
                tempCanvas.width = width
                tempCanvas.height = height
                tempCanvas.getContext('2d')?.putImageData(imageData, 0, 0)

                ctx.globalAlpha = layer.opacity
                ctx.drawImage(tempCanvas, 0, 0)
            }
        })
    }, [frame, layers, width, height])

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="w-full h-full object-contain"
            style={{ imageRendering: 'pixelated' }}
        />
    )
}