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
import Stats from 'stats.js';
import {createDefaultGuiState} from './modules/gui';
import {drawMirroredVideo, drawSkeleton} from './modules/canvasUtils';
import {drawPixelMap, generatePixelMap, calculateAndDrawMapPosition, mapIsEmpty} from './modules/map';
import {isMobile} from './modules/deviceDetection';

const VIDEO_WIDTH = 600;
const VIDEO_HEIGHT = 500;
const MAP_RESOLUTION = 8;
let waitingForNewMapFrames = 0;
const FRAMES_TO_WAIT_BETWEEN_MAPS = 24;
const stats = new Stats();
const guiState = createDefaultGuiState();
let map = generatePixelMap(MAP_RESOLUTION, MAP_RESOLUTION);

/**
 * Loads a the camera to be used in the demo
 *
 */
async function setupCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
        'Browser API navigator.mediaDevices.getUserMedia not available');
  }

  const video = document.getElementById('video');
  video.width = VIDEO_WIDTH;
  video.height = VIDEO_HEIGHT;

  const mobile = isMobile();
  const stream = await navigator.mediaDevices.getUserMedia({
    'audio': false,
    'video': {
      facingMode: 'user',
      width: mobile ? undefined : VIDEO_WIDTH,
      height: mobile ? undefined : VIDEO_HEIGHT,
    },
  });
  video.srcObject = stream;

  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

async function loadVideo() {
  const video = await setupCamera();
  video.play();

  return video;
}


/**
 * Sets up a frames per second panel on the top-left of the window
 */
function setupFPS() {
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  // document.body.appendChild(stats.dom);
}

/**
 * Feeds an image to posenet to estimate poses - this is where the magic
 * happens. This function loops with a requestAnimationFrame method.
 */
function detectPoseInRealTime(video) {
  const canvas = document.getElementById('output');
  const ctx = canvas.getContext('2d');

  canvas.width = VIDEO_WIDTH;
  canvas.height = VIDEO_HEIGHT;

  async function poseDetectionFrame() {
    // Begin monitoring code for frames per second
    stats.begin();

    const poses = await detectPoses();

    drawMapAndVideo(ctx);
    drawPoses(ctx, poses);
    checkAndRegenerateMap();

    // End monitoring code for frames per second
    stats.end();

    requestAnimationFrame(poseDetectionFrame);
  }

  poseDetectionFrame();
}

async function detectPoses() {
  // Scale an image down to a certain factor. Too large of an image will slow
  // down the GPU
  const FLIP_HORIZONTAL = true;
  const imageScaleFactor = guiState.input.imageScaleFactor;
  const outputStride = +guiState.input.outputStride;

  return guiState.net.estimateMultiplePoses(
    video,
    imageScaleFactor,
    FLIP_HORIZONTAL,
    outputStride,
    guiState.multiPoseDetection.maxPoseDetections,
    guiState.multiPoseDetection.minPartConfidence,
    guiState.multiPoseDetection.nmsRadius
  );
}

function drawPoses(ctx, poses) {
  // For each pose (i.e. person) detected in an image, loop through the poses
  // and draw the resulting skeleton and keypoints if over certain confidence
  // scores
  const minPoseConfidence = +guiState.multiPoseDetection.minPoseConfidence;
  const minPartConfidence = +guiState.multiPoseDetection.minPartConfidence;

  poses.forEach(({score, keypoints}) => {
    if (score >= minPoseConfidence) {
      if (guiState.output.showPoints) {
        calculateAndDrawMapPosition(
          keypoints,
          minPartConfidence,
          ctx,
          map,
          VIDEO_WIDTH,
          VIDEO_HEIGHT
        );
      }
      if (guiState.output.showSkeleton) {
        drawSkeleton(keypoints, minPartConfidence, ctx);
      }
    }
  });
}

function drawMapAndVideo(ctx) {
  ctx.clearRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
  ctx.globalCompositeOperation = 'source-over';

  drawPixelMap(ctx, VIDEO_WIDTH, VIDEO_HEIGHT, 'black', map);

  ctx.globalCompositeOperation = 'source-atop';

  if (guiState.output.showVideo) {
    drawMirroredVideo(ctx, VIDEO_WIDTH, VIDEO_HEIGHT, map);
  }

  ctx.globalCompositeOperation = 'source-over';
}

function checkAndRegenerateMap() {
  // If map is empty, pause for 48 frames then generate a new map
  if (mapIsEmpty(map)) {
    waitingForNewMapFrames++;

    if (waitingForNewMapFrames > FRAMES_TO_WAIT_BETWEEN_MAPS) {
      map = generatePixelMap(MAP_RESOLUTION, MAP_RESOLUTION);
      waitingForNewMapFrames = 0;
    }
  }
}

/**
 * Kicks off the demo by loading the posenet model, finding and loading
 * available camera devices, and setting off the detectPoseInRealTime function.
 */
export async function bindPage() {
  const net = await posenet.load(+guiState.input.mobileNetArchitecture);

  document.getElementById('loading').style.display = 'none';
  document.getElementById('main').style.display = 'block';

  let video;

  try {
    video = await loadVideo();
  } catch (e) {
    let info = document.getElementById('info');
    info.textContent = 'this browser does not support video capture,' +
        'or this device does not have a camera';
    info.style.display = 'block';
    throw e;
  }

  guiState.net = net;

  setupFPS();
  detectPoseInRealTime(video);
}

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
// kick off the demo
bindPage();
