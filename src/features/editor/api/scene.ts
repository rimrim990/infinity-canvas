import type {CanvasElement} from "@/entities/editor/model/types.ts";

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
    createElement(element: CanvasElement): void
    getAllElements(): CanvasElement[]
}

class LocalStorageSceneStorage implements SceneStorage {
    save(scene: Scene) {
        localStorage.setItem("scene", JSON.stringify(scene))
    }

    load() {
        const data = localStorage.getItem("scene")
        return data ? JSON.parse(data) : null
    }

    createElement(element: CanvasElement) {
        const scene = this.load() || {viewport: {x: 0, y: 0, zoom: 0}}
        if (!scene.elements) scene.elements = []
        scene.elements.push(element)
        this.save(scene)
    }

    getAllElements(): CanvasElement[] {
        const data = this.load()
        return data?.elements || []
    }
}

export const sceneStorage = new LocalStorageSceneStorage()
