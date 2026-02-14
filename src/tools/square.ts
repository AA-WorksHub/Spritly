import type { Tool, ToolContext } from "./types"

let startPos: { x: number, y: number } | null = null;
let canvasSnapshot: any = null;
const drawRect = (x0: number, y0: number, x1: number, y1: number, color: string, context: ToolContext) => {
    const startX = Math.min(x0, x1);
    const endX = Math.max(x0, x1);
    const startY = Math.min(y0, y1);
    const endY = Math.max(y0, y1);

    for (let x = startX; x <= endX; x++) {
        context.drawPixel(x, startY, color);
        context.drawPixel(x, endY, color);
    }

    for (let y = startY; y <= endY; y++) {
        context.drawPixel(startX, y, color);
        context.drawPixel(endX, y, color);
    }
};

export const squareTool: Tool = {
    onMouseDown(x: number, y: number, context: ToolContext) {
        startPos = { x, y };
        canvasSnapshot = context.getSnapshot();
    },

    onMouseMove(x: number, y: number, context: ToolContext) {
        if (!startPos || !canvasSnapshot)
            return;
        context.restoreSnapshot(canvasSnapshot);
        const color = context.getCurrentColor();

        drawRect(startPos.x, startPos.y, x, y, color, context);
        context.refresh();
    },

    onMouseUp(x: number, y: number, context: ToolContext) {
        if (!startPos || !canvasSnapshot)
            return;
        context.restoreSnapshot(canvasSnapshot);
        const color = context.getCurrentColor();

        drawRect(startPos.x, startPos.y, x, y, color, context);
        context.refresh();
        context.saveState();
        startPos = null;
        canvasSnapshot = null;
    }
}
