import { useProjectStore } from '../../store/useProjectStore'
import { useRef, useEffect, useState } from 'react'

function Canvas() {

    const bufferCanvasRef = useRef<HTMLCanvasElement>(null)
    const displayCanvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [myZoom, setZoom] = useState(1.0)
    const { config } = useProjectStore()
    const { width, height } = config

    useEffect(() => {

        const bufferCanvas = bufferCanvasRef.current
        const displayCanvas = displayCanvasRef.current
        const container = containerRef.current

        if (!bufferCanvas || !displayCanvas || !container)
            return

        const resizeCanvas = () => {

            const pixelSizeWidth = Math.floor((container.clientWidth - 40) / width)
            const pixelSizeHeight = Math.floor((container.clientHeight - 40) / height)
            const pixelSize = Math.min(pixelSizeWidth, pixelSizeHeight)

            bufferCanvas.width = width
            bufferCanvas.height = height
            displayCanvas.width = width * pixelSize
            displayCanvas.height = height * pixelSize

            const bufferContext = bufferCanvas.getContext('2d')
            const displayContext = displayCanvas.getContext('2d')

            if (!bufferContext || !displayContext)
                return

            displayContext.setTransform(1, 0, 0, 1, 0, 0)
            displayContext.scale(myZoom, myZoom)

            displayContext.fillStyle = 'white'
            displayContext.fillRect(0, 0, displayCanvas.width, displayCanvas.height)
            drawGrid(displayContext, pixelSize)
        }

        const drawGrid = (ctx: CanvasRenderingContext2D, pixelSize: number) => {
            ctx.strokeStyle = 'rgba(0,0,0,0.1)'
            ctx.lineWidth = 1

            for (let x = 0; x <= width; x++) {
                const posx = x * pixelSize
                ctx.beginPath()
                ctx.moveTo(posx, 0)
                ctx.lineTo(posx, height * pixelSize)
                ctx.stroke()
            }
            for (let y = 0; y <= height; y++) {
                const posy = y * pixelSize
                ctx.beginPath()
                ctx.moveTo(0, posy)
                ctx.lineTo(width * pixelSize, posy)
                ctx.stroke()
            }
        }

        const handleZoom = (e: WheelEvent) => {
            e.preventDefault()

            const zoomSpeed = 0.1
            const delta = e.deltaY > 0 ? -zoomSpeed : zoomSpeed

            setZoom(prev => {
                const newZoom = prev + delta
                return Math.max(1.0, Math.min(5.0, newZoom))
            })
        }

        resizeCanvas()
        window.addEventListener('resize', resizeCanvas)
        displayCanvas.addEventListener('wheel', handleZoom)

        return () => {
            window.removeEventListener('resize', resizeCanvas)
            displayCanvas.removeEventListener('wheel', handleZoom)
        }
    }, [width, height, myZoom])

    return (
        <div className="flex-1 min-w-0 min-h-0bg-gray-100 flex items-center justify-center" ref={containerRef}>
            <canvas ref={bufferCanvasRef} style={{ display: 'none' }} />
            <canvas ref={displayCanvasRef} style={{ border: '1px solid black' }} />
        </div>
    )
}

export default Canvas