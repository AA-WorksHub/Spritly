import type { Tool, ToolContext } from "./types"

export const eraseTool: Tool = {
    onMouseDown(x: number, y: number, context: ToolContext){
        context.erasePixel(x, y)
        context.refresh()
    },
    onMouseMove(x: number, y: number, context: ToolContext){
        context.erasePixel(x, y)
        context.refresh()
    },
    onMouseUp(_x: number, _y: number, _context: ToolContext){
        //historique ?
    }
}