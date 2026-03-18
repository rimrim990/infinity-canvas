import type {CanvasElement, CanvasElementType, Position} from "@/entities/editor/model/types.ts";

type Scene = {
    elements: CanvasElement[]
    viewport: {
        x: number
        y: number
        zoom: number
    }
}

interface SceneStorage {
    save(scene: Scene): void

    load(): Scene | null

    createElement(type: CanvasElementType, position: Position): void
}

class LocalStorageSceneStorage implements SceneStorage {
    save(scene: Scene) {
        localStorage.setItem("scene", JSON.stringify(scene))
    }

    load() {
        const data = localStorage.getItem("scene")
        return data ? JSON.parse(data) : null
    }

    createElement(type: CanvasElementType, position: Position) {
        const element: CanvasElement = {
            type,
            name: `Rectangle_${Date.now()}`,
            isVisible: true,
            position,
            size: {
                width: 100,
                height: 100
            },
            style: {
                fill: '#D9D9D9',
                stroke: null
            }
        }
        console.log(element)

        const scene = this.load() || {viewport: {x: 0, y: 0, zoom: 0}}
        if (!scene.elements) scene.elements = []
        scene.elements.push(element)
        this.save(scene)
    }
}

export const sceneStorage = new LocalStorageSceneStorage()
