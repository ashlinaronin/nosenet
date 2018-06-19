import {playNote} from './sound';

let lastPosition;
const MIN_DISTANCE_TO_PLAY = 10;

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
 const widthUnit = videoWidth / getMapWidth(map);
 const heightUnit = videoHeight / getMapHeight(map);

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
      checkForInMap(trianglePoints, map, videoWidth, videoHeight);
      drawTriangle(ctx, trianglePoints, 'black');

      if (typeof lastPosition === 'undefined') {
        lastPosition = [x, y];
      }

      if (
        Math.abs(lastPosition[0] - x) > MIN_DISTANCE_TO_PLAY ||
        Math.abs(lastPosition[1] - y) > MIN_DISTANCE_TO_PLAY) {
        playNote(x, y, videoWidth, videoHeight);
        lastPosition = [x, y];
      }
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
      // playNote(mapCoordinates[0], mapCoordinates[1], getMapWidth(map), getMapHeight(map));
      removePointFromMap(map, mapCoordinates);
    }
  });

  return anyTrianglePointInMap;
}

function removePointFromMap(map, mapPointCoords) {
  const [mapXCoord, mapYCoord] = mapPointCoords;
  map[mapXCoord][mapYCoord] = false;
}

function getMapWidth(map) {
  return map.length;
}

function getMapHeight(map) {
  return map[0].length;
}

function getMapCoordinatesForPoint(x, y, map, videoWidth, videoHeight) {
  const mapWidth = getMapWidth(map);
  const mapHeight = getMapHeight(map);

  const widthUnit = videoWidth / mapWidth; // # rows
  const heightUnit = videoHeight / mapHeight; // # cols


  let mapXCoord = Math.floor(x / widthUnit);
  let mapYCoord = Math.floor(y / heightUnit);

  // Account for edges of camera window
  if (mapXCoord >= mapWidth) {
    mapXCoord = mapWidth - 1;
  }

  if (mapYCoord >= mapHeight) {
    mapYCoord = mapHeight - 1;
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

export function mapIsEmpty(map) {
  return !map.some(row => row.some(col => col === true));
}

export function drawTriangle(ctx, trianglePoints, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(trianglePoints[0][0], trianglePoints[0][1]);
  ctx.lineTo(trianglePoints[1][0], trianglePoints[1][1]);
  ctx.lineTo(trianglePoints[2][0], trianglePoints[2][1]);
  ctx.fill();
}