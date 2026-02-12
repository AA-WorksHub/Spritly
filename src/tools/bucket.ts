import type { Tool, ToolContext } from "./types"

export const bucketTool: Tool = {
    onMouseDown(x: number, y: number, context: ToolContext) {
        const targetHex = context.getPixelColor(x, y)
        const replaceHex = context.getCurrentColor()
        
        if (targetHex === replaceHex) return

        const w = context.width
        const h = context.height
        const stack = [[x, y]]
        const visited = new Set<string>()
        const match = (cx: number, cy: number) => {
            const col = context.getPixelColor(cx, cy)
            if (targetHex === null) return col === null
            return col === targetHex
        }

        while (stack.length) {
            const [cx, cy] = stack.pop()!
            const key = `${cx},${cy}`
            if (visited.has(key)) continue
            visited.add(key)

            if (match(cx, cy)) {
                context.drawPixel(cx, cy, replaceHex)
                
                if (cx > 0) stack.push([cx - 1, cy])
                if (cx < w - 1) stack.push([cx + 1, cy])
                if (cy > 0) stack.push([cx, cy - 1])
                if (cy < h - 1) stack.push([cx, cy + 1])
            }
        }
        context.refresh()
    },
    onMouseMove() {},
    onMouseUp(_x, _y, context) {
        context.saveState()
    }
}