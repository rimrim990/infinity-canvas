import * as React from 'react'
import { useCallback } from 'react'
import canvas2DStrategy from '@/features/canvas/lib/CanvasStrategy.ts'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { toolbarAtom } from '@/features/editor/store/editor.ts'
import { elementsAtom, setElementPositionAtom } from '@/features/canvas/store/scene.ts'
import { pointerContextAtom, pointerPositionAtom } from '@/features/canvas/store/pointer.ts'
import { isDraggingAtom, setPointerContextStatusAtom } from '@/features/canvas/store/selectors.ts'

export default function useCanvasInteraction(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const [elements, pushElements] = useAtom(elementsAtom)
  const setElementPosition = useSetAtom(setElementPositionAtom)

  const setPointerPosition = useSetAtom(pointerPositionAtom)

  const [pointerContext, setPointerContext] = useAtom(pointerContextAtom)
  const isDragging = useAtomValue(isDraggingAtom)
  const setPointerStatusUpdate = useSetAtom(setPointerContextStatusAtom)

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

          if (hit) {
            setPointerContext({
              pointerId: hit.id,
              status: 'pointerDown',
              pointerXOffset: x - hit.position.x,
              pointerYOffset: y - hit.position.y,
            })
          } else {
            setPointerContext(null)
          }
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
        const { pointerId, pointerXOffset, pointerYOffset } = pointerContext!

        setElementPosition({
          id: pointerId,
          position: {
            x: x - pointerXOffset,
            y: y - pointerYOffset,
          },
        })
      }

      if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
        setPointerPosition({ x, y })
      } else {
        setPointerPosition(null)
      }
    },
    [toolbarState, elements, pointerContext])

  const handlePointerUp: React.PointerEventHandler<HTMLCanvasElement> = useCallback(() => {
    // 드래그 종료
    setPointerStatusUpdate('pointerUp')
  }, [])

  return {
    handleClick,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  }
}
