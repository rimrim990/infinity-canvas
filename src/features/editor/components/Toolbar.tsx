import { Button } from '@/shared/ui/button.tsx'
import { Separator } from '@/shared/ui/separator.tsx'

import { Circle, GitBranch, MousePointer2, Square, Type } from 'lucide-react'
import { useAtom } from 'jotai'
import type { ReactNode } from 'react'
import { toolbarAtom } from '@/features/editor/store/editor.ts'
import type { ToolbarState } from '@/features/editor/types.ts'

const TOOLBAR_STATE_METAS: Record<ToolbarState, { icon: ReactNode }> = {
  select: { icon: <MousePointer2 size={18} /> },
  rectangle: { icon: <Square size={18} /> },
  ellipse: { icon: <Circle size={18} /> },
  text: { icon: <Type size={18} /> },
  connector: { icon: <GitBranch size={18} /> },
}

export default function Toolbar() {
  const [toolbar, setToolbar] = useAtom(toolbarAtom)

  return (
    <div className="h-12 border-b flex items-center px-4 gap-2 bg-muted/40">
      {Object.entries(TOOLBAR_STATE_METAS).map(([status, meta], idx) => (
        <>
          <Button
            key={status}
            id={status}
            variant="ghost"
            size="icon"
            onClick={() => setToolbar(status as ToolbarState)}
            active={toolbar === status}
          >
            {meta.icon}
          </Button>
          {idx === 0 && <Separator orientation="vertical" />}
        </>
      ))}
    </div>
  )
}
