export function generateMap(width, height) {
  return [
    [0,0],
    [width/2, height/2],
    [width, height]
  ]
}

export function drawMaze(ctx, videoWidth, videoHeight, color) {
  const map = generateMap(videoWidth, videoHeight);
  const [ x, y ] = map[0];

  ctx.beginPath();
  ctx.moveTo(x, y);

  for (let i = 1; i < map.length; i++) {
    const [ pointX, pointY ] = map[i];
    ctx.lineTo(pointX, pointY);
  }

  ctx.closePath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 15;
  ctx.stroke();
}