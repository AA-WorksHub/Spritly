import { useProjectStore } from '../../store/useProjectStore'
import { useRef, useEffect, useState } from 'react'
import { getTool } from '../../tools'
import type { ToolContext } from '../../tools'

function Canvas() {

    const bufferCanvasRef = useRef<HTMLCanvasElement>(null)
    const displayCanvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const [isDrawing, setIsDrawing] = useState(false)
    const [pixelSize, setPixelSize] = useState(1)
    const [myZoom, setZoom] = useState(1.0)

    const { config, currentTool, currentColor, currentFrameIndex, currentLayerIndex,
        frames, layers, updateFrameImageData, setColor} = useProjectStore()
    const { width, height } = config

    const mouseToCanvas = (clientX: number, clientY: number): { x: number, y: number} | null => {
        const displayCanvas = displayCanvasRef.current
        if (!displayCanvas)
            return null

        const rect = displayCanvas.getBoundingClientRect()
        const screenX = clientX - rect.left
        const screenY = clientY - rect.top

        const x = (screenX - mousePos.x) / myZoom + mousePos.x
        const y = (screenY - mousePos.y) / myZoom + mousePos.y
        const pixelX = Math.floor(x / pixelSize)
        const pixelY = Math.floor(y / pixelSize)

        if (pixelX < 0 || pixelX >= width || pixelY < 0 || pixelY >= height)
            return null

        return { x: pixelX, y: pixelY }
    }

    const createToolContext = (): ToolContext => {
        const currentFrame = frames[currentFrameIndex]
        const currentLayer = layers[currentLayerIndex]

        if (!currentFrame || !currentLayer)
            throw new Error('No current frame or layer')

        const imageData = currentFrame.layers.get(currentLayer.id)

        if (!imageData)
            throw new Error('No image data for current layer')

        return {
            drawPixel: (x: number, y: number, color: string) => {
                const hex = color.replace('#', '')
                const r = parseInt(hex.substring(0, 2), 16)
                const g = parseInt(hex.substring(2, 4), 16)
                const b = parseInt(hex.substring(4, 6), 16)
                const a = 255

                const index = (y * width + x) * 4
                imageData.data[index] = r
                imageData.data[index + 1] = g
                imageData.data[index + 2] = b
                imageData.data[index + 3] = a

                updateFrameImageData(currentFrameIndex, currentLayer.id, imageData)
            },

            erasePixel: (x: number, y: number) => {
                const index = (y * width + x) * 4
                imageData.data[index] = 0
                imageData.data[index + 1] = 0
                imageData.data[index + 2] = 0
                imageData.data[index + 3] = 0

                updateFrameImageData(currentFrameIndex, currentLayer.id, imageData)
            },

            getPixelColor: (x: number, y: number) => {
                const index = (y * width + x) * 4
                const r = imageData.data[index]
                const g = imageData.data[index + 1]
                const b = imageData.data[index + 2]
                const a = imageData.data[index + 3]

                if (a === 0)
                    return null

                const toHex = (n: number) => n.toString(16).padStart(2, '0')
                return `#${toHex(r)}${toHex(g)}${toHex(b)}`
            },

            getCurrentColor: () => currentColor,

            setCurrentColor: (color: string) => {
                setColor(color)
            },

            getSnapshot: () => {
                return new Uint8ClampedArray(imageData.data);
            },

            restoreSnapshot: (snapshot: Uint8ClampedArray) => {
                imageData.data.set(snapshot);
            },

            refresh: () => {
                renderCanvas(pixelSize)
            }
        }
    }

    useEffect(() => {
        const displayCanvas = displayCanvasRef.current
        if (!displayCanvas)
            return

        const handleMouseDown = (e: MouseEvent) => {
            const coords = mouseToCanvas(e.clientX, e.clientY)
            if (!coords)
                return

            setIsDrawing(true)
            const tool = getTool(currentTool)
            const context = createToolContext()
            tool.onMouseDown(coords.x, coords.y, context)
        }

        const handleMouseMove = (e: MouseEvent) => {
            const coords = mouseToCanvas(e.clientX, e.clientY)
            if (!coords)
                return

            if (isDrawing) {
                const tool = getTool(currentTool)
                const context = createToolContext()
                tool.onMouseMove(coords.x, coords.y, context)
            }
        }

        const handleMouseUp = (e: MouseEvent) => {
            const coords = mouseToCanvas(e.clientX, e.clientY)
            if (!coords)
                return

            setIsDrawing(false)
            const tool = getTool(currentTool)
            const context = createToolContext()
            tool.onMouseUp(coords.x, coords.y, context)
        }

        const handleMouseLeave = () => {
            const tool = getTool(currentTool)
            if (tool.onMouseLeave) {
                 const context = createToolContext()
                 tool.onMouseLeave(context)
            }
        }

        displayCanvas.addEventListener('mousedown', handleMouseDown)
        displayCanvas.addEventListener('mousemove', handleMouseMove)
        displayCanvas.addEventListener('mouseup', handleMouseUp)
        displayCanvas.addEventListener('mouseleave', handleMouseLeave)

        return () => {
            displayCanvas.removeEventListener('mousedown', handleMouseDown)
            displayCanvas.removeEventListener('mousemove', handleMouseMove)
            displayCanvas.removeEventListener('mouseup', handleMouseUp)
            displayCanvas.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, [isDrawing, currentTool, currentColor, currentFrameIndex, currentLayerIndex, pixelSize, myZoom, mousePos])

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
        const bufferCanvas = bufferCanvasRef.current
        if (!displayCanvas || !bufferCanvas)
            return

        const displayContext = displayCanvas.getContext("2d")
        const bufferContext = bufferCanvas.getContext("2d")
        if (!displayContext || !bufferContext)
            return

        bufferContext.clearRect(0, 0, width, height)
        const currentFrame = frames[currentFrameIndex]
        if (currentFrame) {
            layers.forEach(layer => {
                if (layer.visible) {
                    const imageData = currentFrame.layers.get(layer.id)
                    if (imageData)
                        bufferContext.putImageData(imageData, 0, 0)
                }
            })
        }

        displayContext.setTransform(1, 0, 0, 1, 0, 0)
        displayContext.translate(mousePos.x, mousePos.y)
        displayContext.scale(myZoom, myZoom)
        displayContext.translate(-mousePos.x, -mousePos.y)

        displayContext.fillStyle = 'white'
        displayContext.fillRect(0, 0, displayCanvas.width, displayCanvas.height)

        displayContext.imageSmoothingEnabled = false
        displayContext.drawImage(bufferCanvas, 0, 0, width, height, 0, 0, displayCanvas.width, displayCanvas.height)

        drawGrid(displayContext, newPixelSize)
    }

    useEffect(() => {
        renderCanvas(pixelSize)
    }, [mousePos, myZoom, pixelSize, frames, currentFrameIndex, layers])

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