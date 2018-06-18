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
