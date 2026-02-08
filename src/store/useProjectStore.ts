import { create } from 'zustand'
import type { Project, Frame, Layer, ToolType, HistoryState } from '../types'

const DEFAULT_CONFIG = { width: 32, height: 32, fps: 12, backgroundColor: '#ffffff' }
const createInitialData = () => {
    const layerId = crypto.randomUUID()
    const layer: Layer = {
        id: layerId,
        name: 'Layer 1',
        visible: true,
        opacity: 1
    }

    const frame: Frame = {
        id: crypto.randomUUID(),
        layers: new Map([[layerId, new ImageData(DEFAULT_CONFIG.width, DEFAULT_CONFIG.height)]]),
        thumbnail: undefined
    }

    return { layer, frame }
}

const { layer: initialLayer, frame: initialFrame } = createInitialData()

const cloneFrames = (frames: Frame[], width: number, height: number): Frame[] => {
    return frames.map(frame => {
        const newLayers = new Map<string, ImageData>()
        frame.layers.forEach((imgData, key) => {
            const newImg = new ImageData(
                new Uint8ClampedArray(imgData.data),
                width,
                height
            )
            newLayers.set(key, newImg)
        })
        return { ...frame, layers: newLayers }
    })
}

interface ProjectStore extends Project {
  addFrame: () => void
  deleteFrame: (index: number) => void
  duplicateFrame: (index: number) => void
  setCurrentFrame: (index: number) => void

  addLayer: () => void
  deleteLayer: (id: string) => void
  updateLayer: (id: string, updates: Partial<Layer>) => void
  setCurrentLayer: (index: number) => void
  toggleLayerVisibility: (id: string) => void

  setTool: (tool: ToolType) => void
  setColor: (color: string) => void
  setFPS: (fps: number) => void

  updateFrameImageData: (frameIndex: number, layerId: string, imageData: ImageData) => void
  saveToHistory: () => void
  undo: () => void
  redo: () => void

  resetProject: () => void
}

const initialState: Project = {
  config: DEFAULT_CONFIG,
  frames: [initialFrame],
  layers: [initialLayer],
  currentFrameIndex: 0,
  currentLayerIndex: 0,
  currentTool: 'pencil',
  currentColor: '#000000',
  onionSkinning: false,
  history: [],
  historyIndex: -1
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  ...initialState,

  saveToHistory: () => {
    const { frames, layers, currentFrameIndex, currentLayerIndex, history, historyIndex, config } = get()
    const newHistory = history.slice(0, historyIndex + 1)
    
    const snapshot: HistoryState = {
        frames: cloneFrames(frames, config.width, config.height),
        layers: [...layers],
        currentFrameIndex,
        currentLayerIndex
    }

    if (newHistory.length >= 20) newHistory.shift()

    set({
        history: [...newHistory, snapshot],
        historyIndex: newHistory.length
    })
  },

  undo: () => set((state) => {
    if (state.historyIndex <= 0) return state
    const newIndex = state.historyIndex - 1
    const prevState = state.history[newIndex]
    
    return {
        ...state,
        frames: cloneFrames(prevState.frames, state.config.width, state.config.height),
        layers: prevState.layers,
        currentFrameIndex: prevState.currentFrameIndex,
        currentLayerIndex: prevState.currentLayerIndex,
        historyIndex: newIndex
    }
  }),

  redo: () => set((state) => {
    if (state.historyIndex >= state.history.length - 1) return state
    const newIndex = state.historyIndex + 1
    const nextState = state.history[newIndex]
    
    return {
        ...state,
        frames: cloneFrames(nextState.frames, state.config.width, state.config.height),
        layers: nextState.layers,
        currentFrameIndex: nextState.currentFrameIndex,
        currentLayerIndex: nextState.currentLayerIndex,
        historyIndex: newIndex
    }
  }),

  addLayer: () => {
    get().saveToHistory()
    set((state) => {
      const newLayer: Layer = {
        id: crypto.randomUUID(),
        name: `Layer ${state.layers.length + 1}`,
        visible: true,
        opacity: 1
      }
      const updatedFrames = state.frames.map(frame => {
        const imageData = new ImageData(state.config.width, state.config.height)
        frame.layers.set(newLayer.id, imageData)
        return frame
      })
      return {
        layers: [newLayer, ...state.layers],
        frames: updatedFrames,
        currentLayerIndex: 0
      }
    })
  },

  deleteLayer: (id) => {
    get().saveToHistory()
    set((state) => {
        if (state.layers.length <= 1) return state
        const newLayers = state.layers.filter(l => l.id !== id)
        const updatedFrames = state.frames.map(frame => {
            frame.layers.delete(id)
            return frame
        })
        return { 
            layers: newLayers, 
            frames: updatedFrames,
            currentLayerIndex: 0 
        }
    })
  },

  toggleLayerVisibility: (id) => set((state) => ({
    layers: state.layers.map(l => l.id === id ? { ...l, visible: !l.visible } : l)
  })),

  addFrame: () => {
    get().saveToHistory()
    set((state) => {
        const newFrame: Frame = {
            id: crypto.randomUUID(),
            layers: new Map(),
            thumbnail: undefined
        }
        state.layers.forEach(layer => {
            newFrame.layers.set(layer.id, new ImageData(state.config.width, state.config.height))
        })
        return { frames: [...state.frames, newFrame], currentFrameIndex: state.frames.length }
    })
  },

  deleteFrame: (index) => {
      get().saveToHistory()
      set((state) => {
          if (state.frames.length <= 1) return state
          const newFrames = state.frames.filter((_, i) => i !== index)
          const newIndex = index >= newFrames.length ? newFrames.length - 1 : index
          
          return {
              frames: newFrames,
              currentFrameIndex: newIndex
          }
      })
  },

  duplicateFrame: (index) => {
      get().saveToHistory()
      set((state) => {
          const srcFrame = state.frames[index]
          const newFrame: Frame = {
              id: crypto.randomUUID(),
              layers: new Map(),
          }
          srcFrame.layers.forEach((val, key) => {
              newFrame.layers.set(key, new ImageData(new Uint8ClampedArray(val.data), state.config.width, state.config.height))
          })
          const newFrames = [...state.frames]
          newFrames.splice(index + 1, 0, newFrame)
          return { frames: newFrames, currentFrameIndex: index + 1 }
      })
  },

  setCurrentFrame: (index) => set({ currentFrameIndex: index }),
  setCurrentLayer: (index) => set({ currentLayerIndex: index }),
  setTool: (tool) => set({ currentTool: tool }),
  setColor: (color) => set({ currentColor: color }),
  setFPS: (fps) => set(s => ({ config: {...s.config, fps} })),
  updateLayer: (id, updates) => set(s => ({ layers: s.layers.map(l => l.id === id ? {...l, ...updates} : l)})),

  updateFrameImageData: (frameIndex, layerId, imageData) => set((state) => {
    const newFrames = [...state.frames]
    if (newFrames[frameIndex]) {
        const newLayerMap = new Map(newFrames[frameIndex].layers)
        newLayerMap.set(layerId, imageData)
        newFrames[frameIndex] = { ...newFrames[frameIndex], layers: newLayerMap }
    }
    return { frames: newFrames }
  }),

  resetProject: () => {
      const { layer, frame } = createInitialData()
      
      set({
          ...initialState,
          layers: [layer],
          frames: [frame],
          history: [],
          historyIndex: -1
      })
      
      set(s => ({ 
          history: [{ 
              frames: cloneFrames(s.frames, DEFAULT_CONFIG.width, DEFAULT_CONFIG.height), 
              layers: s.layers, 
              currentFrameIndex: 0, 
              currentLayerIndex: 0 
          }], 
          historyIndex: 0 
      }))
  }
}))