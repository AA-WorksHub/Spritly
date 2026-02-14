import type { Tool, ToolContext } from "./types"

let lastPos: { x: number, y: number } | null = null;

const drawLineBetween = (x0: number, y0: number, x1: number, y1: number, color: string, context: ToolContext) => {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = (x0 < x1) ? 1 : -1;
    const sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    while (true) {
        context.drawPixel(x0, y0, color);
        if (x0 === x1 && y0 === y1)
            break;
        const e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }
}

export const pencilTool: Tool = {
    onMouseDown(x: number, y: number, context: ToolContext) {
        const color = context.getCurrentColor();
        context.drawPixel(x, y, color);
        lastPos = { x, y };
        context.refresh();
    },

    onMouseMove(x: number, y: number, context: ToolContext) {
        if (!lastPos) {
            lastPos = { x, y };
            return;
        }
        const color = context.getCurrentColor();
        drawLineBetween(lastPos.x, lastPos.y, x, y, color, context);
        lastPos = { x, y };
        context.refresh();
    },

    onMouseUp(_x: number, _y: number, context: ToolContext) {
        lastPos = null;
        context.saveState();
        // historique ?
    }
}