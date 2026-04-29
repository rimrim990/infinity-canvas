import * as React from 'react'
import { useCallback, useEffect, useRef } from 'react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { cn } from '@/shared/lib/utils.ts'
import canvas2DStrategy from '@/features/canvas/lib/CanvasStrategy.ts'
import { toolbarAtom } from '@/features/editor/store/editor.ts'
import { elementsAtom, setElementPositionAtom } from '@/features/canvas/store/scene.ts'
import { pointerContextAtom, pointerPositionAtom } from '@/features/canvas/store/pointer.ts'
import { hoveredElementAtom, isDraggingAtom, setPointerContextStatusAtom } from '@/features/canvas/store/selectors.ts'

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [elements, pushElements] = useAtom(elementsAtom)
  const setElementPosition = useSetAtom(setElementPositionAtom)

  const setPointerPosition = useSetAtom(pointerPositionAtom)
  const hoveredElement = useAtomValue(hoveredElementAtom)

  const [pointerContext, setPointerContext] = useAtom(pointerContextAtom)
  const isDragging = useAtomValue(isDraggingAtom)
  const setPointerStatusUpdate = useSetAtom(setPointerContextStatusAtom)

  const [toolbarState, setToolbarState] = useAtom(toolbarAtom)

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    // 캔버스 전체 초기화 후 다시 그리기
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)

    for (const element of elements) {
      canvas2DStrategy.drawElement(element, {
        hovered: !!hoveredElement?.id && hoveredElement.id === element.id,
        pointer: !!pointerContext && pointerContext.pointerId === element.id,
      }, { ctx })
    }
  }, [elements, pointerContext, hoveredElement])

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

  return (
    <div className="flex-1 relative overflow-hidden bg-neutral-100">
      {/* grid background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* canvas */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-250 h-160 bg-white shadow-lg border rounded-lg flex items-center justify-center text-sm text-muted-foreground">
          <canvas
            id="canvas-area"
            ref={canvasRef}
            width={1125}
            height={720}
            className={cn('w-full h-full', { 'cursor-crosshair': toolbarState === 'rectangle' })}
            onClick={handleClick}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            Your browser does not support the HTML canvas tag.
          </canvas>
        </div>
      </div>
    </div>
  )
}
