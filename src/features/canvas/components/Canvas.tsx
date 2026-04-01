import * as React from 'react'
import { useCallback, useEffect, useRef } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { cn } from '@/shared/lib/utils.ts'
import canvas2DStrategy from '@/features/canvas/lib/CanvasStrategy.ts'
import { toolbarAtom } from '@/features/editor/store/editor.ts'
import { elementsAtom, selectedElementAtom } from '@/features/canvas/store/scene.ts'

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [elements, pushElements] = useAtom(elementsAtom)
  const updateSelectedId = useSetAtom(selectedElementAtom)
  const [toolbarState, setToolbarState] = useAtom(toolbarAtom)

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    for (const element of elements) {
      canvas2DStrategy.drawElement(element, { ctx })
    }
  }, [elements])

  const handleClick: React.MouseEventHandler<HTMLCanvasElement> = useCallback(
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

          if (hit) updateSelectedId(hit.id)
          console.log(hit)
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

          canvas2DStrategy.drawElement(element, { ctx })
          pushElements(element)

          setToolbarState('select')
          break
        }
      }
    },
    [toolbarState, elements, updateSelectedId],
  )

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
          >
            Your browser does not support the HTML canvas tag.
          </canvas>
        </div>
      </div>
    </div>
  )
}
