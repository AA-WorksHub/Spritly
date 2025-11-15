import { useProjectStore } from '../../store/useProjectStore'
import {useRef, useEffect } from 'react'

function Canvas() {

    const bufferCanvasRef = useRef<HTMLCanvasElement>(null)
    const displayCanvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const { config } = useProjectStore()
    const { width, height } = config

    useEffect(() => {
        const bufferCanvas = bufferCanvasRef.current
        const displayCanvas = displayCanvasRef.current
        const container = containerRef.current

        if (!bufferCanvas || !displayCanvas || !container)
            return

        const pixelSizeWidth = Math.floor(container.clientWidth / width)
        const pixelSizeHeight = Math.floor(container.clientHeight / height)
        const pixelSize = Math.min(pixelSizeWidth, pixelSizeHeight)

        bufferCanvas.width = width
        bufferCanvas.height = height
        displayCanvas.width = width * pixelSize
        displayCanvas.height = height * pixelSize

        const bufferContext = bufferCanvas.getContext('2d')
        const displayContext = displayCanvas.getContext('2d')

        if (!bufferContext || !displayContext)
            return

        displayContext.fillStyle = 'white'
        displayContext.fillRect(0, 0, displayCanvas.width, displayCanvas.height)
    }, [width, height])

    return (
        <div className="bg-gray-100 flex-1 flex items-center justify-center" ref={containerRef}>
            <canvas ref={bufferCanvasRef} style={{ display: 'none' }} />
            <canvas ref={displayCanvasRef} style={{ border: '1px solid black' }} />
        </div>
    )
}

export default Canvas