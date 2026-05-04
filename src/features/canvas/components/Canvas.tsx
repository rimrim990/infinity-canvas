import { useEffect, useRef } from 'react'
import { useAtomValue } from 'jotai'
import { cn } from '@/shared/lib/utils.ts'
import canvas2DStrategy from '@/features/canvas/lib/CanvasStrategy.ts'
import { toolbarAtom } from '@/features/editor/store/editor.ts'
import { elementsAtom } from '@/features/canvas/store/scene.ts'
import { pointerContextAtom } from '@/features/canvas/store/pointer.ts'
import { hoveredElementAtom } from '@/features/canvas/store/selectors.ts'
import useCanvasInteraction from '@/features/canvas/hooks/useCanvasInteraction.ts'

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { handleClick, handlePointerUp, handlePointerDown, handlePointerMove } = useCanvasInteraction(canvasRef)

  const elements = useAtomValue(elementsAtom)
  const hoveredElement = useAtomValue(hoveredElementAtom)

  const pointerContext = useAtomValue(pointerContextAtom)
  const toolbarState = useAtomValue(toolbarAtom)

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
