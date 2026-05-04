import { atom } from 'jotai'
import { setElementPositionAtom } from '@/features/canvas/store/scene.ts'
import { setPointerContextStatusAtom } from '@/features/canvas/store/selectors.ts'
import type { CanvasElement } from '@/features/canvas/types.ts'

type PointerPosition = {
  x: number
  y: number
}

export const pointerPositionAtom = atom<PointerPosition | null>(null)

export type PointerContext = {
  status: 'pointerDown' | 'pointerUp'
  pointerId: string
  pointerXOffset: number
  pointerYOffset: number
}

export const pointerContextAtom = atom<PointerContext | null>(null)

export const beginPointerInteractionAtom = atom(
  null,
  (_get, set, payload?: { pointer: PointerPosition; element: CanvasElement & { id: string } }) => {
    if (!payload) {
      set(pointerContextAtom, null)
      return
    }

    const { pointer, element } = payload
    set(pointerContextAtom, {
      status: 'pointerDown',
      pointerId: element.id,
      pointerXOffset: pointer.x - element.position.x,
      pointerYOffset: pointer.y - element.position.y,
    })
  },
)

export const movePointerInteractionAtom = atom(null, (get, set, position: PointerPosition) => {
  const context = get(pointerContextAtom)
  if (!context) return
  const { pointerId, pointerXOffset, pointerYOffset } = context
  set(setElementPositionAtom, {
    id: pointerId,
    position: {
      x: position.x - pointerXOffset,
      y: position.y - pointerYOffset,
    },
  })
})

export const endPointerInteractionAtom = atom(null, (_get, set) => set(setPointerContextStatusAtom, 'pointerUp'))
