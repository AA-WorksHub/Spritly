import type { ToolType } from '../types'
import type { Tool } from './types'
import { pencilTool } from './pencil'
import { eraseTool } from './eraser'
import { eyedropperTool } from './eyedropper'
import { bucketTool } from './bucket'

export const tools: Record<ToolType, Tool> = {
    pencil: pencilTool,
    eraser: eraseTool,
    bucket: bucketTool,
    eyedropper: eyedropperTool,
    line: pencilTool,
    rectangle: pencilTool
}

export * from './types'

export function getTool(type: string) {
  return tools[type as keyof typeof tools] || tools.pencil
}