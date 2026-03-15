import Toolbar from "./toolbar"
import LayersPanel from "./layers-panel"
import CanvasArea from "./canvas-area"
import InspectorPanel from "./inspector-panel"
import StatusBar from "./status-bar"

export default function EditorLayout() {
    return (
        <div className="flex flex-col h-full">
            {/* Toolbar */}
            <Toolbar/>

            {/* Main Area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Layers */}
                <LayersPanel/>
                {/* Canvas */}
                <CanvasArea/>
                {/* Inspector */}
                <InspectorPanel/>
            </div>

            {/* Status Bar */}
            <StatusBar/>
        </div>
    )
}
