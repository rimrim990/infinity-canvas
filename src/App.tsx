import Toolbar from '@/features/editor/components/Toolbar.tsx'
import Canvas from '@/features/canvas/components/Canvas.tsx'
import StatusBar from '@/features/editor/components/StatusBar.tsx'

export default function App() {
  return (
    <div className="h-screen w-screen bg-background text-foreground">
      <div className="flex flex-col h-full">
        {/* Toolbar */}
        <Toolbar />

        {/* Main Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Layers */}
          {/*<LayersPanel/>*/}
          {/* Canvas */}
          <Canvas />
          {/* Inspector */}
          {/*<InspectorPanel/>*/}
        </div>

        {/* Status Bar */}
        <StatusBar />
      </div>
    </div>
  )
}
