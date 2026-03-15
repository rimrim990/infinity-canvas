import {Button} from "@/shared/ui/button.tsx"
import {Separator} from "@/shared/ui/separator.tsx"

import {
    MousePointer2,
    Square,
    Circle,
    Type,
    GitBranch
} from "lucide-react"

export default function Toolbar() {
    return (
        <div className="h-12 border-b flex items-center px-4 gap-2 bg-muted/40">
            <Button variant="ghost" size="icon">
                <MousePointer2 size={18}/>
            </Button>
            <Separator orientation="vertical"/>
            <Button variant="ghost" size="icon">
                <Square size={18}/>
            </Button>
            <Button variant="ghost" size="icon">
                <Circle size={18}/>
            </Button>
            <Button variant="ghost" size="icon">
                <Type size={18}/>
            </Button>
            <Button variant="ghost" size="icon">
                <GitBranch size={18}/>
            </Button>
        </div>
    )
}
