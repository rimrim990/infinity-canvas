export default function StatusBar() {
  return (
    <div className="h-8 border-t flex items-center px-4 text-xs bg-muted/40">
      <div className="flex gap-6">
        <span>Zoom: 100%</span>
        <span>Cursor: 320, 120</span>
        <span>Elements: 12</span>
        <span>FPS: 60</span>
      </div>
    </div>
  )
}
