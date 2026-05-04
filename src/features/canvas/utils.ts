export const isInsideCanvas = (x: number, y: number, canvas: HTMLCanvasElement) =>
  x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height

export const toCanvasCoords = (clientX: number, clientY: number, canvas: HTMLCanvasElement) => {
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height

  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  }
}
