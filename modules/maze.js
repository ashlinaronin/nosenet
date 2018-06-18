export function generateMap(width, height) {
  return [
    [0,0],
    [width/2, height/2],
    [width, height]
  ]
}

export function generatePixelMap(width, height) {
  const map = [];

  for (let i = 0; i < width; i++) {
    map[i] = [];
    for (let j = 0; j < height; j++) {
      map[i][j] = Math.random() >= 0.5;
    }
  }

  return map;
}

export function drawPixelMaze(ctx, videoWidth, videoHeight, color, map) {
 const widthUnit = videoWidth / map.length; // # rows
 const heightUnit = videoHeight / map[0].length; // # cols

 ctx.fillStyle = color;
 for (let i = 0; i < map.length; i++) {
   for (let j = 0; j < map[0].length; j++) {
     if (map[i][j] === true) {
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
