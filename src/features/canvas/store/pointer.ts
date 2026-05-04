import { atom } from 'jotai'
import { setElementPositionAtom } from '@/features/canvas/store/scene.ts'
import { setPointerContextStatusAtom } from '@/features/canvas/store/selectors.ts'

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

export const beginPointerInteractionAtom = atom(null, (_get, set, position?: PointerPosition & { id: string }) => {
  if (!position) set(pointerContextAtom, null)
  else set(pointerContextAtom, {
    status: 'pointerDown',
    pointerId: position.id,
    pointerXOffset: position.x,
    pointerYOffset: position.y,
  })
})

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
