import type { CanvasElement } from '@/features/canvas/types.ts'

const STROKE_WIDTH = 1

const HANDLE_SIZE = 6
const SELECTION_COLOR = '#0D99FF'

const LABEL_GAP = 8            // 도형 아래 여백
const LABEL_PADDING_X = 6
const LABEL_PADDING_Y = 3
const LABEL_FONT_SIZE = 11
const LABEL_RADIUS = 4

export const drawRect = (ctx: CanvasRenderingContext2D, element: CanvasElement) => {
  const { size, position, style } = element
  ctx.fillStyle = style.fill
  ctx.fillRect(position.x, position.y, size.width, size.height)

  if (style.stroke) {
    ctx.strokeStyle = style.stroke
    ctx.lineWidth = STROKE_WIDTH
    ctx.strokeRect(position.x, position.y, size.width, size.height)
  }
}

export const drawSelectionStroke = (ctx: CanvasRenderingContext2D, element: CanvasElement) => {
  const { size, position } = element
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
}

export const drawResizeHandles = (ctx: CanvasRenderingContext2D, element: CanvasElement) => {
  const { size, position } = element

  // corners
  const handles = [
    { x: position.x,                         y: position.y },
    { x: position.x + size.width,            y: position.y },
    { x: position.x,                         y: position.y + size.height },
    { x: position.x + size.width,            y: position.y + size.height },
  ]

  const half = HANDLE_SIZE / 2

  ctx.save()
  handles.forEach(({ x, y }) => {
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(x - half, y - half, HANDLE_SIZE, HANDLE_SIZE)
    ctx.strokeStyle = SELECTION_COLOR
    ctx.lineWidth = STROKE_WIDTH
    ctx.strokeRect(x - half, y - half, HANDLE_SIZE, HANDLE_SIZE)
  })
  ctx.restore()
}

export const drawSizeBadge = (ctx: CanvasRenderingContext2D, element: CanvasElement) => {
  const { size, position } = element
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
}
