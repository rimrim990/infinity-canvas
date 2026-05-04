export const isInsideCanvas = (x: number, y: number, canvas: HTMLCanvasElement) => x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height;

export const toCanvasCoords = (x: number, y: number, canvas: HTMLCanvasElement) => {
  const rect = canvas.getBoundingClientRect()
  return { x: x - rect.left, y: y - rect.top }
}
