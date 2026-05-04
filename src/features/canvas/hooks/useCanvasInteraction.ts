import * as React from 'react'
import { useCallback } from 'react'
import canvas2DStrategy from '@/features/canvas/lib/CanvasStrategy.ts'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { toolbarAtom } from '@/features/editor/store/editor.ts'
import { elementsAtom } from '@/features/canvas/store/scene.ts'
import {
  beginPointerInteractionAtom,
  endPointerInteractionAtom,
  movePointerInteractionAtom,
  pointerContextAtom,
  pointerPositionAtom,
} from '@/features/canvas/store/pointer.ts'
import { isDraggingAtom } from '@/features/canvas/store/selectors.ts'

export default function useCanvasInteraction(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const [elements, pushElements] = useAtom(elementsAtom)

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
    const rect = canvas.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top

    switch (toolbarState) {
      case 'rectangle': {
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const element = canvas2DStrategy.createElement(toolbarState, {
          x,
          y,
        })

        canvas2DStrategy.drawElement(element, {}, { ctx })
        const id = pushElements(element)

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
      const rect = canvas.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top

      switch (toolbarState) {
        case 'select': {
          const hit = elements.find(element => canvas2DStrategy.hitTest(element, {
            x,
            y,
          }))
          beginPointerInteraction(hit ? { x: hit?.position.x, y: hit?.position.y, id: hit?.id } : undefined)
          break
        }
      }
    },
    [toolbarState, elements, setPointerContext],
  )

  const handlePointerMove: React.PointerEventHandler<HTMLCanvasElement> = useCallback(
    (e) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const { clientX, clientY } = e
      const rect = canvas.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top

      if (toolbarState !== 'select') return

      // 선택된 요소 드래그로 이동
      if (isDragging) {
        movePointerInteraction({ x, y })
      }

      if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
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
