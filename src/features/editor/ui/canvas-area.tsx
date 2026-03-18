import {useCallback, useRef} from "react";
import {useAtomValue} from "jotai";
import {toolbarAtom} from "@/entities/editor/model/toolbar.ts";
import {cn} from "@/shared/lib/utils.ts";
import * as React from "react";
import {sceneStorage} from "@/features/editor/api/scene.ts";

export default function CanvasArea() {
    const toolbarState = useAtomValue(toolbarAtom)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const handleClick: React.MouseEventHandler<HTMLCanvasElement> = useCallback((e) => {
        const canvas = canvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()

        switch (toolbarState) {
            case "rectangle": {
                const {clientX, clientY} = e
                const x = clientX - rect.left
                const y = clientY - rect.top

                sceneStorage.createElement(toolbarState, {
                    x, y
                })
                break;
            }
        }
    }, [])

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
                            className={cn('w-full h-full', {'cursor-crosshair': toolbarState === 'rectangle'})}
                            onClick={handleClick}>
                        Your browser does not support the HTML canvas tag.
                    </canvas>
                </div>
            </div>
        </div>
    )
}
