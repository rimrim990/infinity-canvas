import { atom } from 'jotai'

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
