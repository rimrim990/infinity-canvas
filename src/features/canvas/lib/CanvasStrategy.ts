import RectStrategy from '@/features/canvas/lib/RectStrategy.ts'
import type { CanvasElement, CanvasElementType } from '@/features/canvas/types.ts'

interface DrawContext {
  ctx: CanvasRenderingContext2D
}

interface CoordContext {
  clientX: number
  clientY: number
  canvasBounds: DOMRect
}

export interface CanvasStrategy {
  drawElement(element: CanvasElement, options: {
    hovered?: boolean,
    pointer?: boolean
  }, context: DrawContext): void

  createElement(type: CanvasElementType, context: CoordContext): CanvasElement

  hitTest(element: CanvasElement, context: CoordContext): boolean
}

const canvas2DStrategy: CanvasStrategy = {
  drawElement(element, options, context) {
    switch (element.type) {
      case 'rectangle':
        RectStrategy.drawElement(element, options, context)
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
  hitTest(element: CanvasElement, context: CoordContext) {
    switch (element.type) {
      case 'rectangle': {
        return RectStrategy.hitTest(element, context)
      }
      default: {
        return false
      }
    }
  },
}

export default canvas2DStrategy
