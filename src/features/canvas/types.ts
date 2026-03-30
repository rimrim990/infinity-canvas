export type CanvasElementType = 'rectangle' | 'ellipse' | 'text' | 'connector'

// discriminated union
export type CanvasElement = CanvasRectangle | CanvasText

interface BaseElement {
  type: CanvasElementType
  name: string
  isVisible: boolean
  position: Position
  size: Size
  style: Style
}

export interface CanvasRectangle extends BaseElement {
  type: 'rectangle'
}

export interface CanvasText extends BaseElement {
  type: 'text'
  text: string
  fontSize: number
  lineHeight: number
}

type Size = {
  width: number
  height: number
}

type Style = {
  fill: string
  stroke: string | null
}

export type Position = {
  x: number
  y: number
}
