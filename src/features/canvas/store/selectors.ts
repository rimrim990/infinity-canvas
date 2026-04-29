// derived state
import { atom } from 'jotai'
import canvas2DStrategy from '@/features/canvas/lib/CanvasStrategy.ts'
import { elementsAtom } from '@/features/canvas/store/scene.ts'
import { type PointerContext, pointerContextAtom, pointerPositionAtom } from '@/features/canvas/store/pointer.ts'

export const activePointerElementAtom = atom((get) => {
  const context = get(pointerContextAtom)
  if (!context) return null

  const elements = get(elementsAtom)
  return elements.find((el) => el.id === context.pointerId) ?? null
})

export const setPointerContextStatusAtom = atom(null, (get, set, status: PointerContext['status']) => {
  const prev = get(pointerContextAtom)
  if (!prev) return
  set(pointerContextAtom, { ...prev, status })
})

export const isDraggingAtom = atom((get) => {
  const context = get(pointerContextAtom)
  return context?.status === 'pointerDown'
})

export const hoveredElementAtom = atom((get) => {
  const pointer = get(pointerPositionAtom)
  if (!pointer) return null

  const elements = get(elementsAtom)
  return elements.find((element) =>
    canvas2DStrategy.hitTest(element, {
      x: pointer.x,
      y: pointer.y,
    }),
  )
})
