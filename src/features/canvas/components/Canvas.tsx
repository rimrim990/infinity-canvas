import * as React from 'react'
import { useCallback, useEffect, useRef } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { cn } from '@/shared/lib/utils.ts'
import canvas2DStrategy from '@/features/canvas/lib/CanvasStrategy.ts'
import { toolbarAtom } from '@/features/editor/store/editor.ts'
import {
  elementsAtom,
  hoveredElementAtom,
  pointerElementContextAtom,
  selectedElementAtom, updateElementPositionAtom,
} from '@/features/canvas/store/scene.ts'


export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [elements, pushElements] = useAtom(elementsAtom)
  const updateElementPosition = useSetAtom(updateElementPositionAtom)

  const [selectedElement, updateSelectedId] = useAtom(selectedElementAtom)
  const [pointerElementContext, updatePointerContext] = useAtom(pointerElementContextAtom)
  const [hoveredElement, updatedHoveredId] = useAtom(hoveredElementAtom)

  const [toolbarState, setToolbarState] = useAtom(toolbarAtom)

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    // 캔버스 전체 초기화 후 다시 그리기
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)

    for (const element of elements) {
      canvas2DStrategy.drawElement(element, {
        focused: !!selectedElement?.id && selectedElement.id === element.id,
        hovered: !!hoveredElement?.id && hoveredElement.id === element.id,
        pointer: !!pointerElementContext?.pointerElement && pointerElementContext.pointerElement.id === element.id,
      }, { ctx })
    }
  }, [elements, selectedElement, pointerElementContext, hoveredElement])

  const handleClick: React.MouseEventHandler<HTMLCanvasElement> = useCallback((e) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const { clientX, clientY } = e
    const rect = canvas.getBoundingClientRect()

    switch (toolbarState) {
      case 'select': {
        const hit = elements.find(element => canvas2DStrategy.hitTest(element, {
          clientX,
          clientY,
          canvasBounds: rect,
        }))

        if (hit) updateSelectedId(hit.id)
        else updateSelectedId(null)
        break
      }

      case 'rectangle': {
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const element = canvas2DStrategy.createElement(toolbarState, {
          clientX,
          clientY,
          canvasBounds: rect,
        })

        canvas2DStrategy.drawElement(element, {}, { ctx })
        const id = pushElements(element)

        setToolbarState('select')
        updateSelectedId(id)
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

      switch (toolbarState) {
        case 'select': {
          const hit = elements.find(element => canvas2DStrategy.hitTest(element, {
            clientX,
            clientY,
            canvasBounds: rect,
          }))

          if (hit) {
            const calculatedX = clientX - rect.left
            const calculatedY = clientY - rect.top
            updatePointerContext({
              pointerId: hit.id,
              pointerXOffset: calculatedX - hit.position.x,
              pointerYOffset: calculatedY - hit.position.y,
            })
          }
          break
        }
      }
    },
    [toolbarState, elements, updatePointerContext],
  )

  const handlePointerMove: React.PointerEventHandler<HTMLCanvasElement> = useCallback(
    (e) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const { clientX, clientY } = e
      const rect = canvas.getBoundingClientRect()

      if (toolbarState !== 'select') return

      // 선택된 요소 드래그로 이동
      const pointerElement = pointerElementContext?.pointerElement
      if (pointerElement) {
        const { pointerXOffset, pointerYOffset } = pointerElementContext
        const calculatedX = clientX - rect.left
        const calculatedY = clientY - rect.top

        updateElementPosition({
          id: pointerElement.id,
          position: {
            x: calculatedX - pointerXOffset,
            y: calculatedY - pointerYOffset,
          },
        })
      }

      // 마우스 이동하면서 hover된 요소 하이라이팅
      const hit = elements.find(element => canvas2DStrategy.hitTest(element, {
        clientX,
        clientY,
        canvasBounds: rect,
      }))
      if (hit) updatedHoveredId(hit.id)
      else updatedHoveredId(null)
    },
    [toolbarState, elements, pointerElementContext])

  const handlePointerUp: React.PointerEventHandler<HTMLCanvasElement> = useCallback(() => {
    // 드래그 종료
    updatePointerContext(null)
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
