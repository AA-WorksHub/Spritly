import type { Tool, ToolContext } from "./types"

let startPos: { x: number, y: number } | null = null;
let canvasSnapshot: any = null;
const drawLine = (x0: number, y0: number, x1: number, y1: number, color: string, context: ToolContext) => {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = (x0 < x1) ? 1 : -1;
    const sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    while (true) {
        context.drawPixel(x0, y0, color);
        if (x0 === x1 && y0 === y1) break;
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
};

export const lineTool: Tool = {
    onMouseDown(x: number, y: number, context: ToolContext) {
        startPos = { x, y };
        canvasSnapshot = context.getSnapshot();
    },

    onMouseMove(x: number, y: number, context: ToolContext) {
        if (!startPos || !canvasSnapshot)
            return;
        context.restoreSnapshot(canvasSnapshot);
        const color = context.getCurrentColor();

        drawLine(startPos.x, startPos.y, x, y, color, context);
        context.refresh();
    },

    onMouseUp(x: number, y: number, context: ToolContext) {
        if (!startPos || !canvasSnapshot)
            return;
        context.restoreSnapshot(canvasSnapshot);
        const color = context.getCurrentColor();

        drawLine(startPos.x, startPos.y, x, y, color, context);
        context.refresh();
        context.saveState();
        startPos = null;
        canvasSnapshot = null;
    }
}