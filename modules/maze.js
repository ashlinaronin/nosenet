export function drawMaze(ctx, videoWidth, videoHeight, color) {
  ctx.beginPath();
  ctx.arc(videoWidth / 2, videoHeight / 2, 70, 0, Math.PI * 2, true);

  ctx.strokeStyle = color;
  ctx.lineWidth = 15;
  ctx.stroke();
}
