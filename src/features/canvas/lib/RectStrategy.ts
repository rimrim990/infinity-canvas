import type { CanvasStrategy } from '@/features/canvas/lib/CanvasStrategy.ts'
import type { CanvasRectangle } from '../types'

const SELECTION_COLOR = '#0D99FF'
const STROKE_WIDTH = 1
const HANDLE_SIZE = 6

const LABEL_GAP = 8            // 도형 아래 여백
const LABEL_PADDING_X = 6
const LABEL_PADDING_Y = 3
const LABEL_FONT_SIZE = 11
const LABEL_RADIUS = 4

const RectStrategy: CanvasStrategy = {
  drawElement(element: CanvasRectangle, { focused, hovered }, context) {
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

    // highlight focused rectangle
    if (focused) {
      const offset = STROKE_WIDTH / 2

      ctx.save()
      ctx.strokeStyle = SELECTION_COLOR
      ctx.lineWidth = STROKE_WIDTH
      ctx.strokeRect(
        position.x - offset,
        position.y - offset,
        size.width + STROKE_WIDTH,
        size.height + STROKE_WIDTH
      )

      // 2. 모서리 + 중간점 핸들 (8개)
      const handles = [
        // corners
        { x: position.x,                         y: position.y },
        { x: position.x + size.width,            y: position.y },
        { x: position.x,                         y: position.y + size.height },
        { x: position.x + size.width,            y: position.y + size.height },
      ]

      const half = HANDLE_SIZE / 2
      handles.forEach(({ x, y }) => {
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(x - half, y - half, HANDLE_SIZE, HANDLE_SIZE)
        ctx.strokeStyle = SELECTION_COLOR
        ctx.lineWidth = STROKE_WIDTH
        ctx.strokeRect(x - half, y - half, HANDLE_SIZE, HANDLE_SIZE)
      })

      // 3. 사이즈 뱃지
      const label = `${Math.round(size.width)} × ${Math.round(size.height)}`
      ctx.font = `${LABEL_FONT_SIZE}px sans-serif`

      const textWidth = ctx.measureText(label).width
      const boxWidth = textWidth + LABEL_PADDING_X * 2
      const boxHeight = LABEL_FONT_SIZE + LABEL_PADDING_Y * 2

      // 도형 하단 중앙에 위치
      const boxX = position.x + size.width / 2 - boxWidth / 2
      const boxY = position.y + size.height + LABEL_GAP

      // 배경 (파란 라운드 박스)
      ctx.fillStyle = SELECTION_COLOR
      ctx.beginPath()
      ctx.roundRect(boxX, boxY, boxWidth, boxHeight, LABEL_RADIUS)
      ctx.fill()

      // 텍스트
      ctx.fillStyle = '#FFFFFF'
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'
      ctx.fillText(label, boxX + boxWidth / 2, boxY + boxHeight / 2)

      ctx.restore()
      return
    }

    if (hovered) {
      const offset = STROKE_WIDTH / 2

      ctx.save()
      ctx.strokeStyle = SELECTION_COLOR
      ctx.lineWidth = STROKE_WIDTH
      ctx.strokeRect(
        position.x - offset,
        position.y - offset,
        size.width + STROKE_WIDTH,
        size.height + STROKE_WIDTH
      )

      ctx.restore()
      return
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

  hitTest(element: CanvasRectangle, context) {
    const { position: { x, y }, size: { width, height } } = element
    const clientX = context.clientX - context.canvasBounds.left
    const clientY = context.clientY - context.canvasBounds.top
    return x <= clientX && clientX <= x + width && y <= clientY && clientY <= y + height;
  },
}

export default RectStrategy
