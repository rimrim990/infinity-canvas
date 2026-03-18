export type CanvasElementType = 'rectangle' | 'ellipse' | 'text' | 'connector'

/**
 * Canvas
 */
export interface CanvasElement {
    type: CanvasElementType,
    name: string,
    isVisible: boolean,
    position: Position,
    size: Size,
    style: Style
}

export interface CanvasRectangle extends CanvasElement {
    type: 'rectangle'
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

/**
 * Toolbar
 */
export type ToolbarState = 'select' | 'rectangle' | 'ellipse' | 'text' | 'connector'
