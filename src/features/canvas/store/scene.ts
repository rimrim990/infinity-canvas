import { atomWithStorage } from 'jotai/utils'
import type { CanvasElement, Position, Scene } from '@/features/canvas/types.ts'
import { atom } from 'jotai'

type UpdatePositionPayload = {
  id: string
  position: Position
}

export const sceneAtom = atomWithStorage<Scene>('scene', {
  viewport: { x: 0, y: 0, zoom: 0 },
  elements: [],
})

export const elementsAtom = atom(
  (get) => get(sceneAtom).elements,
  (get, set, element: CanvasElement) => {
    const scene = get(sceneAtom)
    const id = crypto.randomUUID()
    set(sceneAtom, {
      ...scene,
      elements: [...scene.elements, { ...element, id }],
    })
    return id
  },
)

export const updateElementPositionAtom = atom(
  null, // 읽기 불필요
  (get, set, { id, position }: UpdatePositionPayload) => {
    const scene = get(sceneAtom)
    set(sceneAtom, {
      ...scene,
      elements: scene.elements.map((el) =>
        el.id === id ? { ...el, position } : el,
      ),
    })
  },
)

const selectedIdAtom = atom<string | null>(null)

export const selectedElementAtom = atom((get) => {
  const selectedId = get(selectedIdAtom)
  const elements = get(elementsAtom)
  return elements.find((element) => element.id === selectedId)
}, (_get, set, selectedId: string | null) => {
  set(selectedIdAtom, selectedId)
})

type PointerContext = {
  pointerId: string
  pointerXOffset: number
  pointerYOffset: number
}

const pointerContextAtom = atom<PointerContext | null>(null)

export const pointerElementContextAtom = atom((get) => {
  const context = get(pointerContextAtom)
  if (!context) return null
  const elements = get(elementsAtom)
  const pointerElement =  elements.find((element) => element.id === context.pointerId)
  if (!pointerElement) return null
  return {
    pointerElement,
    pointerXOffset: context.pointerXOffset,
    pointerYOffset: context.pointerYOffset,
  }
}, (_get, set, selectContext: PointerContext | null) => {
  set(pointerContextAtom, selectContext)
})

const hoveredIdAtom = atom<string | null>(null)

export const hoveredElementAtom = atom((get) => {
  const hoveredId = get(hoveredIdAtom)
  const elements = get(elementsAtom)
  return elements.find((element) => element.id === hoveredId)
}, (_get, set, hoveredId: string | null) => {
  set(hoveredIdAtom, hoveredId)
})


