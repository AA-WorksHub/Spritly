import type { Tool, ToolContext } from "./types"

let startPos: { x: number, y: number } | null = null;
let canvasSnapshot: any = null;
const drawEllipse = (x0: number, y0: number, x1: number, y1: number, color: string, context: ToolContext) => {
    let a = Math.abs(x1 - x0);
    let b = Math.abs(y1 - y0);
    let b1 = b & 1;

    let dx = 4 * (1 - a) * b * b;
    let dy = 4 * (b1 + 1) * a * a;
    let err = dx + dy + b1 * a * a;

    if (x0 > x1)
        { x0 = x1; x1 += a; }
    if (y0 > y1)
        y0 = y1;
    y0 += (b + 1) >> 1;
    y1 = y0 - b1;
    a *= 8 * a;
    b1 = 8 * b * b;

    do {
        context.drawPixel(x1, y0, color);
        context.drawPixel(x0, y0, color);
        context.drawPixel(x0, y1, color);
        context.drawPixel(x1, y1, color);

        let e2 = 2 * err;
        if (e2 <= dy) {
            y0++;
            y1--;
            err += dy += a;
        }
        if (e2 >= dx || 2 * err > dy) {
            x0++;
            x1--;
            err += dx += b1;
        }
    } while (x0 <= x1);
    while (y0 - y1 < b) {
        context.drawPixel(x0 - 1, y0, color);
        context.drawPixel(x1 + 1, y0++, color);
        context.drawPixel(x0 - 1, y1, color);
        context.drawPixel(x1 + 1, y1--, color);
    }
};

export const circleTool: Tool = {
    onMouseDown(x: number, y: number, context: ToolContext) {
        startPos = { x, y };
        canvasSnapshot = context.getSnapshot();
    },

    onMouseMove(x: number, y: number, context: ToolContext) {
        if (!startPos || !canvasSnapshot)
            return;
        context.restoreSnapshot(canvasSnapshot);
        const color = context.getCurrentColor();

        drawEllipse(startPos.x, startPos.y, x, y, color, context);
        context.refresh();
    },

    onMouseUp(x: number, y: number, context: ToolContext) {
        if (!startPos || !canvasSnapshot)
            return;
        context.restoreSnapshot(canvasSnapshot);
        const color = context.getCurrentColor();

        drawEllipse(startPos.x, startPos.y, x, y, color, context);
        context.refresh();
        context.saveState();
        startPos = null;
        canvasSnapshot = null;
    }
}
