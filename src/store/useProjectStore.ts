import { create } from 'zustand'
import type { Project, Frame, Layer, Tool } from '../types'

interface ProjectStore extends Project {
  addFrame: () => void
  deleteFrame: (index: number) => void
  duplicateFrame: (index: number) => void
  setCurrentFrame: (index: number) => void

  addLayer: () => void
  deleteLayer: (id: string) => void
  updateLayer: (id: string, updates: Partial<Layer>) => void
  setCurrentLayer: (index: number) => void

  setTool: (tool: Tool) => void
  setColor: (color: string) => void

  updateFrameImageData: (frameIndex: number, layerId: string, imageData: ImageData) => void

  toggleOnionSkinning: () => void
  setFPS: (fps: number) => void

  resetProject: () => void
}

const initialState: Project = {
  config: {
    width: 32,
    height: 32,
    fps: 12,
    backgroundColor: '#ffffff'
  },
  frames: [],
  layers: [],
  currentFrameIndex: 0,
  currentLayerIndex: 0,
  currentTool: 'pencil',
  currentColor: '#000000',
  onionSkinning: false
}

export const useProjectStore = create<ProjectStore>((set, _get) => ({
  ...initialState,

  addFrame: () => set((state) => {
    const newFrame: Frame = {
      id: crypto.randomUUID(),
      layers: new Map(),
      thumbnail: undefined
    }

    state.layers.forEach(layer => {
      const imageData = new ImageData(state.config.width, state.config.height)
      newFrame.layers.set(layer.id, imageData)
    })

    return {
      frames: [...state.frames, newFrame],
      currentFrameIndex: state.frames.length
    }
  }),

  deleteFrame: (index) => set((state) => {
    if (state.frames.length <= 1) return state // 1 frame minimum

    const newFrames = state.frames.filter((_, i) => i !== index)
    const newIndex = Math.min(state.currentFrameIndex, newFrames.length - 1)

    return {
      frames: newFrames,
      currentFrameIndex: newIndex
    }
  }),

  duplicateFrame: (index) => set((state) => {
    const frameToDuplicate = state.frames[index]
    if (!frameToDuplicate) return state

    const newFrame: Frame = {
      id: crypto.randomUUID(),
      layers: new Map(frameToDuplicate.layers),
      thumbnail: frameToDuplicate.thumbnail
    }

    const newFrames = [...state.frames]
    newFrames.splice(index + 1, 0, newFrame)

    return {
      frames: newFrames,
      currentFrameIndex: index + 1
    }
  }),

  setCurrentFrame: (index) => set({ currentFrameIndex: index }),

  addLayer: () => set((state) => {
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
      layers: [...state.layers, newLayer],
      frames: updatedFrames,
      currentLayerIndex: state.layers.length
    }
  }),

  deleteLayer: (id) => set((state) => {
    if (state.layers.length <= 1) return state // 1 layer minimum
    const newLayers = state.layers.filter(layer => layer.id !== id)

    const updatedFrames = state.frames.map(frame => {
      frame.layers.delete(id)
      return frame
    })

    const deletedIndex = state.layers.findIndex(l => l.id === id)
    const newIndex = Math.min(state.currentLayerIndex, newLayers.length - 1)

    return {
      layers: newLayers,
      frames: updatedFrames,
      currentLayerIndex: deletedIndex <= state.currentLayerIndex ? newIndex : state.currentLayerIndex
    }
  }),

  updateLayer: (id, updates) => set((state) => ({
    layers: state.layers.map(layer =>
      layer.id === id ? { ...layer, ...updates } : layer
    )
  })),

  setCurrentLayer: (index) => set({ currentLayerIndex: index }),
  setTool: (tool) => set({ currentTool: tool }),
  setColor: (color) => set({ currentColor: color }),

  updateFrameImageData: (frameIndex, layerId, imageData) => set((state) => {
    const newFrames = [...state.frames]
    const frame = newFrames[frameIndex]
    if (frame) {
      frame.layers.set(layerId, imageData)
    }
    return { frames: newFrames }
  }),

  toggleOnionSkinning: () => set((state) => ({
    onionSkinning: !state.onionSkinning
  })),

  setFPS: (fps) => set((state) => ({
    config: { ...state.config, fps }
  })),

  resetProject: () => {
    const defaultLayer: Layer = {
      id: crypto.randomUUID(),
      name: 'Layer 1',
      visible: true,
      opacity: 1
    }

    const defaultFrame: Frame = {
      id: crypto.randomUUID(),
      layers: new Map([[
        defaultLayer.id,
        new ImageData(initialState.config.width, initialState.config.height)
      ]]),
      thumbnail: undefined
    }

    set({
      ...initialState,
      layers: [defaultLayer],
      frames: [defaultFrame]
    })
  }
}))

useProjectStore.getState().resetProject()