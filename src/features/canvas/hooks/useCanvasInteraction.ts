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
  pointerPositionAtom,
} from '@/features/canvas/store/pointer.ts'
import { isDraggingAtom } from '@/features/canvas/store/selectors.ts'
import { isInsideCanvas, toCanvasCoords } from '@/features/canvas/utils.ts'

export default function useCanvasInteraction(canvas: HTMLCanvasElement | null) {
  const elements = useAtomValue(elementsAtom)
  const createElement = useSetAtom(createElementAtom)

  const beginPointerInteraction = useSetAtom(beginPointerInteractionAtom)
  const movePointerInteraction = useSetAtom(movePointerInteractionAtom)
  const endPointerInteraction = useSetAtom(endPointerInteractionAtom)

  const setPointerPosition = useSetAtom(pointerPositionAtom)

  const isDragging = useAtomValue(isDraggingAtom)

  const [toolbarState, setToolbarState] = useAtom(toolbarAtom)

  const handleClick: React.MouseEventHandler<HTMLCanvasElement> = useCallback((e) => {
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
        createElement(element)

        setToolbarState('select')
        break
      }
    }
  }, [toolbarState, createElement, setToolbarState])

  const handlePointerDown: React.PointerEventHandler<HTMLCanvasElement> = useCallback(
    (e) => {
      if (!canvas) return

      const { clientX, clientY } = e
      const { x, y } = toCanvasCoords(clientX, clientY, canvas)

      switch (toolbarState) {
        case 'select': {
          const hit = elements.find(element => canvas2DStrategy.hitTest(element, {
            x,
            y,
          }))
          beginPointerInteraction(
            hit ? { pointer: { x, y }, element: hit } : undefined,
          )
          break
        }
      }
    },
    [toolbarState, elements, beginPointerInteraction],
  )

  const handlePointerMove: React.PointerEventHandler<HTMLCanvasElement> = useCallback(
    (e) => {
      if (!canvas) return

      const { clientX, clientY } = e
      const { x, y } = toCanvasCoords(clientX, clientY, canvas)

      switch (toolbarState) {
        case 'select': {
          // 선택된 요소 드래그로 이동
          if (isDragging) {
            movePointerInteraction({ x, y })
          }

          setPointerPosition(isInsideCanvas(x, y, canvas) ? { x, y } : null)
          break
        }
      }
    },
    [toolbarState, isDragging, movePointerInteraction, setPointerPosition])

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
