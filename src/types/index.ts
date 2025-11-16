// Types des outils de dessin
export type ToolType = 'pencil' | 'eraser' | 'bucket' | 'eyedropper' | 'line' | 'rectangle'

// Calque
export interface Layer {
  id: string
  name: string
  visible: boolean
  opacity: number
}

// Frame de l'animation
export interface Frame {
  id: string
  layers: Map<string, ImageData>
  thumbnail?: string
}

// Configuration du projet
export interface ProjectConfig {
  width: number
  height: number
  fps: number
  backgroundColor: string
}

// État complet du projet
export interface Project {
  config: ProjectConfig
  frames: Frame[]
  layers: Layer[]
  currentFrameIndex: number
  currentLayerIndex: number
  currentTool: ToolType
  currentColor: string
  onionSkinning: boolean
}

// Historique pour undo/redo
export interface HistoryState {
  frames: Frame[]
  currentFrameIndex: number
}