/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licnses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import * as posenet from '@tensorflow-models/posenet';
import {playNote} from './sound';

const color = 'yellow';
const lineWidth = 2;

function toTuple({y, x}) {
  return [y, x];
}

export function drawMirroredVideo(ctx, videoWidth, videoHeight) {
  ctx.save();
  ctx.scale(-1, 1);
  ctx.translate(-videoWidth, 0);
  ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
  ctx.restore();
}

export function drawTriangle(ctx, y, x, r, color, map, videoWidth, videoHeight) {
  const trianglePoints = [
    [x, y - (r/2)],
    [x - r, y + (r/2)],
    [x + r,y + (r/2)],
    [x, y] // center point, just used for collision detection
  ];

  const anyPointInMap = trianglePoints.some(point => isPointInMap(point[0], point[1], map, videoWidth, videoHeight));

  if (anyPointInMap) {
    playNote();
  }

  ctx.fillStyle = anyPointInMap ? 'blue' : color;

  ctx.beginPath();

  ctx.moveTo(trianglePoints[0][0], trianglePoints[0][1]);
  ctx.lineTo(trianglePoints[1][0], trianglePoints[1][1]);
  ctx.lineTo(trianglePoints[2][0], trianglePoints[2][1]);

  ctx.fill();
}

function isPointInMap(x, y, map, videoWidth, videoHeight) {
  const widthUnit = videoWidth/map.length; // # rows
  const heightUnit = videoHeight/map[0].length; // #columns

  const multX = Math.floor(x / widthUnit);
  const multY = Math.floor(y / heightUnit);
  return map[multX][multY] === true;
}

/**
 * Draws a line on a canvas, i.e. a joint
 */
export function drawSegment([ay, ax], [by, bx], color, scale, ctx) {
  ctx.beginPath();
  ctx.moveTo(ax * scale, ay * scale);
  ctx.lineTo(bx * scale, by * scale);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.stroke();
}

/**
 * Draws a pose skeleton by looking up all adjacent keypoints/joints
 */
export function drawSkeleton(keypoints, minConfidence, ctx, scale = 1) {
  const adjacentKeyPoints = posenet.getAdjacentKeyPoints(
    keypoints, minConfidence);

  adjacentKeyPoints.forEach((keypoints) => {
    drawSegment(toTuple(keypoints[0].position),
      toTuple(keypoints[1].position), color, scale, ctx);
  });
}

/**
 * Draw pose keypoints onto a canvas
 */
export function drawKeypoints(keypoints, minConfidence, ctx, scale = 1, map) {
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i];

    if (keypoint.score < minConfidence) {
      continue;
    }

    const {y, x} = keypoint.position;

    if (keypoint.part === 'nose') {
      drawTriangle(ctx, y * scale, x * scale, 20, color, map, 600, 500);
    }

  }
}
