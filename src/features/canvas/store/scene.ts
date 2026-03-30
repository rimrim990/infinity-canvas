import { atomWithStorage } from 'jotai/utils'
import type { CanvasElement, Scene } from '@/features/canvas/types.ts'
import { atom } from 'jotai'

export const sceneAtom = atomWithStorage<Scene>('scene', {
  viewport: { x: 0, y: 0, zoom: 0 },
  elements: [],
})

export const elementsAtom = atom(
  (get) => get(sceneAtom).elements,
  (get, set, element: CanvasElement) => {
    const scene = get(sceneAtom)
    set(sceneAtom, {
      ...scene,
      elements: [...scene.elements, { ...element, id: crypto.randomUUID() }],
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


