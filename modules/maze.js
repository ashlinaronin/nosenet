export function generateMap(width, height) {
  return [
    [0,0],
    [width/2, height/2],
    [width, height]
  ]
}

export function generatePixelMap(width, height) {
  return [
    [0, 1, 0],
    [1, 0, 1],
    [0, 1, 0]
  ];
}

export function drawPixelMaze(ctx, videoWidth, videoHeight, color, map) {
 const widthUnit = videoWidth / 3;
 const heightUnit = videoHeight / 3;

 ctx.fillStyle = color;
 for (let i = 0; i < 3; i++) {
   for (let j = 0; j < 3; j++) {
     if (map[i][j] === 1) {
       ctx.fillRect(widthUnit * i, heightUnit * j, widthUnit, heightUnit);
     }
   }
 }
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
