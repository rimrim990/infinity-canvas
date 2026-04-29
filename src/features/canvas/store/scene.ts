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

export const setElementPositionAtom = atom(
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

