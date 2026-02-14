export type ToolType = 'pencil' | 'eraser' | 'bucket' | 'eyedropper' | 'line' | 'square' | 'circle'

//details sur l'outil
export interface Tool {
  id: ToolType;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  cursor: string;
}

//details sur les intéractions avec le canva
export interface DrawingState {
  activeTool: ToolType;
  color: string;
  brushSize: number;
}

// Calque
export interface Layer {
  id: string
  name: string
  visible: boolean
  opacity: number
}

export interface Frame {
  id: string
  layers: Map<string, ImageData>
  thumbnail?: string
}

export interface ProjectConfig {
  width: number
  height: number
  fps: number
  backgroundColor: string
}

export interface HistoryState {
  frames: Frame[]
  layers: Layer[]
  currentFrameIndex: number
  currentLayerIndex: number
}

export interface Project {
  config: ProjectConfig
  frames: Frame[]
  layers: Layer[]
  currentFrameIndex: number
  currentLayerIndex: number
  currentTool: ToolType
  currentColor: string
  onionSkinning: boolean
  
  history: HistoryState[]
  historyIndex: number
}