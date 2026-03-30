import { Input } from "@/shared/ui/input.tsx"
import { Label } from "@/shared/ui/label.tsx"

export default function InspectorPanel() {
    return (
        <div className="w-55 border-l bg-muted/20 flex flex-col">
            <div className="h-10 flex items-center px-3 text-sm font-medium border-b">
                Inspector
            </div>
            <div className="p-4 space-y-6 text-sm">
                <div className="space-y-2">
                    <Label>Position</Label>
                    <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="X" />
                        <Input placeholder="Y" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Size</Label>
                    <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="Width" />
                        <Input placeholder="Height" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Style</Label>
                    <Input placeholder="Fill color" />
                    <Input placeholder="Stroke color" />
                </div>
            </div>
        </div>
    )
}
