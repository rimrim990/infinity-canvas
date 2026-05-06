import type { CanvasStrategy } from '@/features/canvas/lib/CanvasStrategy.ts'
import type { CanvasRectangle } from '../types'
import {
  drawResizeHandles,
  drawSelectionStroke,
  drawSizeBadge,
  drawRect,
} from '@/features/canvas/lib/drawRect.ts'

const drawRectSelection = (ctx: CanvasRenderingContext2D, element: CanvasRectangle) => {
  drawSelectionStroke(ctx, element)
  // 2. 모서리 + 중간점 핸들 (8개)
  drawResizeHandles(ctx, element)
  // 3. 사이즈 뱃지
  drawSizeBadge(ctx, element)
}

const RectStrategy: CanvasStrategy = {
  drawElement(element: CanvasRectangle, { pointer, hovered }, context) {
    const { ctx } = context

    drawRect(ctx, element)
    if (pointer) {
      // highlight clicked rectangle
      drawRectSelection(ctx, element)
    } else if (hovered) {
      // highlight hovered rectangle
      drawSelectionStroke(ctx, element)
    }
  },

  createElement(type: 'rectangle', context): CanvasRectangle {
    const { x, y } = context

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

  hitTest(element: CanvasRectangle, { x, y }) {
    const { position, size: { width, height } } = element
    return position.x <= x && x <= position.x + width && position.y <= y && y <= position.y + height
  },
}

export default RectStrategy
