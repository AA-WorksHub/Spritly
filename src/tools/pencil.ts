import type { Tool, ToolContext } from "./types"

export const pencilTool: Tool = {
    onMouseDown(x: number, y: number, context: ToolContext){
        const color = context.getCurrentColor()
        context.drawPixel(x, y, color)
        context.refresh()
    },
    onMouseMove(x: number, y: number, context: ToolContext){
        const color = context.getCurrentColor()
        context.drawPixel(x, y, color)
        context.refresh()
    },
    onMouseUp(_x: number, _y: number, _context: ToolContext){
        //historique ?
    }
}