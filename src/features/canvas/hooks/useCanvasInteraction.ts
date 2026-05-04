import * as React from 'react'
import { useCallback } from 'react'
import canvas2DStrategy from '@/features/canvas/lib/CanvasStrategy.ts'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { toolbarAtom } from '@/features/editor/store/editor.ts'
import { createElementAtom, elementsAtom } from '@/features/canvas/store/scene.ts'
import {
  beginPointerInteractionAtom,
  endPointerInteractionAtom,
  movePointerInteractionAtom,
  pointerContextAtom,
  pointerPositionAtom,
} from '@/features/canvas/store/pointer.ts'
import { isDraggingAtom } from '@/features/canvas/store/selectors.ts'
import { isInsideCanvas, toCanvasCoords } from '@/features/canvas/utils.ts'

export default function useCanvasInteraction(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const elements = useAtomValue(elementsAtom)
  const createElement = useSetAtom(createElementAtom)

  const beginPointerInteraction = useSetAtom(beginPointerInteractionAtom)
  const movePointerInteraction = useSetAtom(movePointerInteractionAtom)
  const endPointerInteraction = useSetAtom(endPointerInteractionAtom)

  const setPointerPosition = useSetAtom(pointerPositionAtom)

  const [pointerContext, setPointerContext] = useAtom(pointerContextAtom)
  const isDragging = useAtomValue(isDraggingAtom)

  const [toolbarState, setToolbarState] = useAtom(toolbarAtom)

  const handleClick: React.MouseEventHandler<HTMLCanvasElement> = useCallback((e) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const { clientX, clientY } = e
    const { x, y } = toCanvasCoords(clientX, clientY, canvas)

    switch (toolbarState) {
      case 'rectangle': {
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const element = canvas2DStrategy.createElement(toolbarState, {
          x,
          y,
        })

        canvas2DStrategy.drawElement(element, {}, { ctx })
        const id = createElement(element)

        setToolbarState('select')
        setPointerContext({ pointerId: id, status: 'pointerUp' ,pointerYOffset: 0, pointerXOffset: 0 })
        break
      }
    }
  }, [toolbarState, elements])

  const handlePointerDown: React.PointerEventHandler<HTMLCanvasElement> = useCallback(
    (e) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const { clientX, clientY } = e
      const { x, y } = toCanvasCoords(clientX, clientY, canvas)

      switch (toolbarState) {
        case 'select': {
          const hit = elements.find(element => canvas2DStrategy.hitTest(element, {
            x,
            y,
          }))
          beginPointerInteraction(hit ? { x: hit.position.x, y: hit.position.y, id: hit.id } : undefined)
          break
        }
      }
    },
    [toolbarState, setPointerContext],
  )

  const handlePointerMove: React.PointerEventHandler<HTMLCanvasElement> = useCallback(
    (e) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const { clientX, clientY } = e
      const { x, y } = toCanvasCoords(clientX, clientY, canvas)

      if (toolbarState !== 'select') return

      // 선택된 요소 드래그로 이동
      if (isDragging) {
        movePointerInteraction({ x, y })
      }

      if (isInsideCanvas(x, y, canvas)) {
        setPointerPosition({ x, y })
      } else {
        setPointerPosition(null)
      }
    },
    [toolbarState, elements, pointerContext])

  const handlePointerUp: React.PointerEventHandler<HTMLCanvasElement> = useCallback(() => {
    endPointerInteraction()
  }, [])

  return {
    handleClick,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  }
}
