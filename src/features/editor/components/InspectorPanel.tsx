import { Input } from '@/shared/ui/input.tsx'
import { Label } from '@/shared/ui/label.tsx'
import { useAtomValue } from 'jotai'
import { activePointerElementAtom } from '@/features/canvas/store/selectors.ts'

export default function InspectorPanel() {
  const activePointerElement = useAtomValue(activePointerElementAtom)

  return (
    <div className="w-55 border-l bg-muted/20 flex flex-col">
      <div className="h-10 flex items-center px-3 text-sm font-medium border-b">Inspector</div>
      <div className="p-4 space-y-6 text-sm">
        <div className="space-y-2">
          <Label>Position</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="X" defaultValue={activePointerElement?.position.x} />
            <Input placeholder="Y" defaultValue={activePointerElement?.position.y} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Size</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Width" defaultValue={activePointerElement?.size.width} />
            <Input placeholder="Height" defaultValue={activePointerElement?.size.height} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Style</Label>
          <Input placeholder="Fill color" defaultValue={activePointerElement?.style.fill} />
          <Input placeholder="Stroke color" defaultValue={activePointerElement?.style.stroke || undefined} />
        </div>
      </div>
    </div>
  )
}
