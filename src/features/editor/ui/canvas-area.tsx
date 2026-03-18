import {useRef} from "react";
import {useAtomValue} from "jotai";
import {toolbarAtom} from "@/entities/editor/model/toolbar.ts";
import {cn} from "@/shared/lib/utils.ts";

export default function CanvasArea() {
    const toolbarState = useAtomValue(toolbarAtom)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    return (
        <div className="flex-1 relative overflow-hidden bg-neutral-100">
            {/* grid background */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage:
                        "linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                }}
            />

            {/* canvas */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div
                    className="w-[900px] h-[600px] bg-white shadow-lg border rounded-lg flex items-center justify-center text-sm text-muted-foreground">
                    <canvas id='canvas-area' ref={canvasRef}
                            className={cn('w-full h-full', {'cursor-crosshair': toolbarState === 'rectangle'})}>
                        Your browser does not support the HTML canvas tag.
                    </canvas>
                </div>
            </div>
        </div>
    )
}
