import { useProjectStore } from '../../store/useProjectStore'
import { useRef, useEffect, useState } from 'react'

function Canvas() {

    const bufferCanvasRef = useRef<HTMLCanvasElement>(null)
    const displayCanvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const [pixelSize, setPixelSize] = useState(1)
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
            const newPixelSize = Math.min(pixelSizeWidth, pixelSizeHeight)
            setPixelSize(newPixelSize)

            bufferCanvas.width = width
            bufferCanvas.height = height
            displayCanvas.width = width * newPixelSize
            displayCanvas.height = height * newPixelSize

            renderCanvas(newPixelSize)
        }

        resizeCanvas()
        window.addEventListener("resize", resizeCanvas)
        return () => window.removeEventListener("resize", resizeCanvas)
    }, [width, height])

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

    const renderCanvas = (newPixelSize: number) => {
        const displayCanvas = displayCanvasRef.current
        if (!displayCanvas)
            return

        const displayContext = displayCanvas.getContext("2d")
        if (!displayContext)
            return

        displayContext.setTransform(1, 0, 0, 1, 0, 0)
        displayContext.translate(mousePos.x, mousePos.y)
        displayContext.scale(myZoom, myZoom)
        displayContext.translate(-mousePos.x, -mousePos.y)

        displayContext.fillStyle = 'white'
        displayContext.fillRect(0, 0, displayCanvas.width, displayCanvas.height)
        drawGrid(displayContext, newPixelSize)
        displayContext.fillStyle = 'black'
        displayContext.fillRect(20 * newPixelSize, 16 * newPixelSize, newPixelSize, newPixelSize)
    }

    useEffect(() => {
        renderCanvas(pixelSize)
    }, [mousePos, myZoom, pixelSize])

    useEffect(() => {
        const displayCanvas = displayCanvasRef.current
        if (!displayCanvas)
            return

        const handleZoom = (e: WheelEvent) => {
            e.preventDefault()

            const rect = displayCanvas.getBoundingClientRect()
            const mouseX = e.clientX - rect.left
            const mouseY = e.clientY - rect.top
            setMousePos({ x: mouseX, y: mouseY })
            setZoom(z => Math.min(5, Math.max(1, z + (e.deltaY > 0 ? -0.1 : 0.1))))
        }

        displayCanvas.addEventListener("wheel", handleZoom)
        return () => displayCanvas.removeEventListener("wheel", handleZoom)
    }, [myZoom])

    return (
        <div className="flex-1 min-w-0 min-h-0bg-gray-100 flex items-center justify-center" ref={containerRef}>
            <canvas ref={bufferCanvasRef} style={{ display: 'none' }} />
            <canvas ref={displayCanvasRef} style={{ border: '1px solid black' }} />
        </div>
    )
}

export default Canvas