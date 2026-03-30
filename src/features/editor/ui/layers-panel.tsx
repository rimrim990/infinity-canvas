import {Eye, EyeOff} from "lucide-react"
import {useState} from "react"

import {Button} from "@/shared/ui/button"
import {ScrollArea} from "@/shared/ui/scroll-area.tsx"

export default function LayersPanel() {
    return (
        <div className="w-50 border-r bg-muted/20 flex flex-col">
            <div className="h-10 flex items-center px-3 text-sm font-medium border-b">
                Layers
            </div>
            <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                    <LayerItem name="Rectangle 1"/>
                    <LayerItem name="Rectangle 2"/>
                    <LayerItem name="Ellipse 1"/>
                    <LayerItem name="Text 1"/>
                </div>
            </ScrollArea>
        </div>
    )
}

function LayerItem({name}: { name: string }) {
    const [visible, setVisible] = useState(true)

    return (
        <div
            className="flex items-center justify-between px-2 py-1 rounded text-sm hover:bg-muted group cursor-pointer">

            <span>{name}</span>

            <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                    e.stopPropagation()
                    setVisible(!visible)
                }}
            >
                {visible ? <Eye size={14}/> : <EyeOff size={14}/>}
            </Button>

        </div>
    )
}
