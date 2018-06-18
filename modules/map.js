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
  let anyTrianglePointInMap = false;

  trianglePoints.forEach(trianglePoint => {
    const [pointX, pointY] = trianglePoint;

    const mapCoordinates = getMapCoordinatesForPoint(pointX, pointY, map, videoWidth, videoHeight);
    const containsPoint = mapContainsPoint(map, mapCoordinates);

    if (containsPoint) {
      anyTrianglePointInMap = true;
      removePointFromMap(map, mapCoordinates);
    }
  });

  return anyTrianglePointInMap;
}

function removePointFromMap(map, mapPointCoords) {
  const [mapXCoord, mapYCoord] = mapPointCoords;
  map[mapXCoord][mapYCoord] = false;
}

function getMapCoordinatesForPoint(x, y, map, videoWidth, videoHeight) {
  const widthUnit = videoWidth / map.length; // # rows
  const heightUnit = videoHeight / map[0].length; // # cols

  let mapXCoord = Math.floor(x / widthUnit);
  let mapYCoord = Math.floor(y / heightUnit);

  // Account for edges of camera window
  if (mapXCoord >= map.length) {
    mapXCoord = map.length - 1;
  }

  if (mapYCoord >= map[0].length) {
    mapYCoord = map[0].length - 1;
  }

  if (mapXCoord <= 0) {
    mapXCoord = 0;
  }

  if (mapYCoord <= 0) {
    mapYCoord = 0;
  }

  return [mapXCoord, mapYCoord];
}

function mapContainsPoint(map, mapPointCoords) {
  const [mapXCoord, mapYCoord] = mapPointCoords;
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