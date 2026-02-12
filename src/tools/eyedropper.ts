import type { Tool, ToolContext } from "./types"

export const eyedropperTool: Tool = {
    onMouseDown(x: number, y: number, context: ToolContext) {
        const color = context.getPixelColor(x, y)
        if (color) {
            context.setCurrentColor(color)
        }
    },
    onMouseMove(x: number, y: number, context: ToolContext) {
        const color = context.getPixelColor(x, y)
        if (color) {
            //  MAJ UI
        }
    },
    onMouseUp() {}
}