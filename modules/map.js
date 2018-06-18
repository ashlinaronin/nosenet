import {playNote} from './sound';

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

export function drawPixelMap(ctx, videoWidth, videoHeight, color, map) {
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

export function calculateAndDrawMapPosition(keypoints, minConfidence, ctx, map, videoWidth, videoHeight) {
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i];

    if (keypoint.score < minConfidence) {
      continue;
    }

    const {y, x} = keypoint.position;

    if (keypoint.part === 'nose') {
      const trianglePoints = generateTrianglePoints(x, y, 20);
      const isInMap = checkForInMap(trianglePoints, map, videoWidth, videoHeight);
      const color = isInMap ? 'blue' : 'yellow';

      if (isInMap) {
        playNote();
      }

      drawTriangle(ctx, trianglePoints, color);
    }
  }
}

function generateTrianglePoints(x, y, r) {
  return [
    [x, y - (r/2)],
    [x - r, y + (r/2)],
    [x + r,y + (r/2)],
    [x, y] // center point, just used for collision detection
  ];
}

function checkForInMap(trianglePoints, map, videoWidth, videoHeight) {
  return trianglePoints.some(point => isPointInMap(point[0], point[1], map, videoWidth, videoHeight));
}

function isPointInMap(x, y, map, videoWidth, videoHeight) {
  const widthUnit = videoWidth / map.length; // # rows
  const heightUnit = videoHeight / map[0].length; // # cols

  const mapXCoord = Math.floor(x / widthUnit);
  const mapYCoord = Math.floor(y / heightUnit);
  return map[mapXCoord][mapYCoord] === true;
}

export function drawTriangle(ctx, trianglePoints, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(trianglePoints[0][0], trianglePoints[0][1]);
  ctx.lineTo(trianglePoints[1][0], trianglePoints[1][1]);
  ctx.lineTo(trianglePoints[2][0], trianglePoints[2][1]);
  ctx.fill();
}