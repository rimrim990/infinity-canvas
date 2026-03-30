import { Input } from '@/shared/ui/input.tsx'
import { Label } from '@/shared/ui/label.tsx'
import { useAtomValue } from 'jotai'
import { selectedElementAtom } from '@/features/canvas/store/scene.ts'

export default function InspectorPanel() {
  const selectedElement = useAtomValue(selectedElementAtom)

  return (
    <div className="w-55 border-l bg-muted/20 flex flex-col">
      <div className="h-10 flex items-center px-3 text-sm font-medium border-b">Inspector</div>
      <div className="p-4 space-y-6 text-sm">
        <div className="space-y-2">
          <Label>Position</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="X" defaultValue={selectedElement?.position.x} />
            <Input placeholder="Y" defaultValue={selectedElement?.position.y} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Size</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Width" defaultValue={selectedElement?.size.width} />
            <Input placeholder="Height" defaultValue={selectedElement?.size.height} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Style</Label>
          <Input placeholder="Fill color" defaultValue={selectedElement?.style.fill} />
          <Input placeholder="Stroke color" defaultValue={selectedElement?.style.stroke || undefined} />
        </div>
      </div>
    </div>
  )
}
