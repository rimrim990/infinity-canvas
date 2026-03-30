import RectStrategy from '@/features/canvas/lib/RectStrategy.ts'
import type { CanvasElement, CanvasElementType } from '@/features/canvas/types.ts'

interface DrawContext {
  ctx: CanvasRenderingContext2D
}

interface CreateContext {
  clientX: number
  clientY: number
  canvasBounds: DOMRect
}

export interface CanvasStrategy {
  drawElement(element: CanvasElement, context: DrawContext): void

  createElement(type: CanvasElementType, context: CreateContext): CanvasElement

  hitTest(type: CanvasElementType, x: number, y: number): boolean
}

const canvas2DStrategy: CanvasStrategy = {
  drawElement(element, context) {
    switch (element.type) {
      case 'rectangle':
        RectStrategy.drawElement(element, context)
    }
  },
  createElement(type, context) {
    switch (type) {
      case 'rectangle': {
        return RectStrategy.createElement(type, context)
      }
      // tmp
      default: {
        return {} as CanvasElement
      }
    }
  },
  hitTest(type: CanvasElementType, x: number, y: number) {
    switch (type) {
      case 'rectangle': {
        return RectStrategy.hitTest(type, x, y)
      }
      default: {
        return false
      }
    }
  },
}

export default canvas2DStrategy
