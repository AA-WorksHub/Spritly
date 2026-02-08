export interface ToolContext {
    width: number
    height: number
    drawPixel: (x: number, y: number, color: string) => void
    erasePixel: (x: number, y: number) => void
    getPixelColor: (x: number, y: number) => string | null
    getCurrentColor: () => string
    setCurrentColor: (color: string) => void
    refresh: () => void
    saveState: () => void
}

export interface Tool {
    onMouseDown: (x: number, y: number, context: ToolContext) => void
    onMouseMove: (x: number, y: number, context: ToolContext) => void
    onMouseUp: (x: number, y: number, context: ToolContext) => void
}