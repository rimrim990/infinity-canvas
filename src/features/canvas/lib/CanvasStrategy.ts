import RectStrategy from '@/features/canvas/lib/RectStrategy.ts'
import type { CanvasElement, CanvasElementType } from '@/features/canvas/types.ts'

interface DrawContext {
  ctx: CanvasRenderingContext2D
}

interface CoordContext {
  x: number
  y: number
}

// registry
const strategies = {
  rectangle: RectStrategy,
} as const

const getStrategy = (type: CanvasElementType) => strategies[type as keyof typeof strategies]

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
    const strategy = getStrategy(element.type)
    strategy?.drawElement(element, options, context)
  },
  createElement(type, context) {
    const strategy = getStrategy(type)
    return strategy?.createElement(type, context)
  },
  hitTest(element: CanvasElement, context: CoordContext) {
    const strategy = getStrategy(element.type)
    return strategy?.hitTest(element, context) ?? false
  },
}

export default canvas2DStrategy
