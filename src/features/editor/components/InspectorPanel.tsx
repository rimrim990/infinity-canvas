import { Input } from '@/shared/ui/input.tsx'
import { Label } from '@/shared/ui/label.tsx'
import { useAtomValue } from 'jotai'
import { pointerElementContextAtom } from '@/features/canvas/store/scene.ts'

export default function InspectorPanel() {
  const pointerElementContext = useAtomValue(pointerElementContextAtom)
  const pointerElement = pointerElementContext?.pointerElement

  return (
    <div className="w-55 border-l bg-muted/20 flex flex-col">
      <div className="h-10 flex items-center px-3 text-sm font-medium border-b">Inspector</div>
      <div className="p-4 space-y-6 text-sm">
        <div className="space-y-2">
          <Label>Position</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="X" defaultValue={pointerElement?.position.x} />
            <Input placeholder="Y" defaultValue={pointerElement?.position.y} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Size</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Width" defaultValue={pointerElement?.size.width} />
            <Input placeholder="Height" defaultValue={pointerElement?.size.height} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Style</Label>
          <Input placeholder="Fill color" defaultValue={pointerElement?.style.fill} />
          <Input placeholder="Stroke color" defaultValue={pointerElement?.style.stroke || undefined} />
        </div>
      </div>
    </div>
  )
}
