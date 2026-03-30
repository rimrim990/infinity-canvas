import type { CanvasStrategy } from '@/features/canvas/lib/CanvasStrategy.ts'
import type { CanvasRectangle } from '../types'

const RectStrategy: CanvasStrategy = {
  drawElement(element: CanvasRectangle, context) {
    const { ctx } = context
    const { size, position, style } = element

    ctx.fillStyle = style.fill
    ctx.fillRect(position.x, position.y, size.width, size.height)

    // draws a rectangular outline (stroked rectangle.)
    if (style.stroke) {
      ctx.strokeStyle = style.stroke
      ctx.lineWidth = 1
      ctx.strokeRect(position.x, position.y, size.width, size.height)
    }
  },

  createElement(type: 'rectangle', context): CanvasRectangle {
    const {
      clientX,
      clientY,
      canvasBounds: { left, top },
    } = context
    const x = clientX - left
    const y = clientY - top

    return {
      type,
      name: `Rectangle_${Date.now()}`,
      isVisible: true,
      position: {
        x,
        y,
      },
      size: {
        width: 30,
        height: 30,
      },
      style: {
        fill: '#D9D9D9',
        stroke: null,
      },
    }
  },

  hitTest(type: 'rectangle', x: number, y: number) {
    console.log(`hitTest-${type}(${x}, ${y})`)
    return true
  },
}

export default RectStrategy
