import {
  HandLandmarker,
  FilesetResolver
} from '@mediapipe/tasks-vision';

/**
* The handLandmarker instance used for detecting hand landmarks.
*/
let handLandmarker: HandLandmarker;

/**
* Stores the last processed video frame time to avoid redundant processing.
*/
let lastVideoTime = -1;

/**
* Stores the latest detection results from the handLandmarker.
*/
let results: any;

/**
* List of landmark index pairs representing hand connections for drawing.
* Each pair connects two landmark indices.
*/
const HAND_CONNECTIONS = [
  [0,1], [1,2], [2,3], [3,4],       // Thumb
  [0,5], [5,6], [6,7], [7,8],       // Index
  [5,9], [9,10], [10,11], [11,12],  // Middle
  [9,13], [13,14], [14,15], [15,16],// Ring
  [13,17], [17,18], [18,19], [19,20],// Pinky
  [0,17]                            // Palm base to pinky
];

/**
* Stores the detected hand landmark coordinates as [x, y] pairs.
* This array is cleared and updated on each detection.
*/
export let resultLandmarks: number[][] = [];

/**
* Initializes the MediaPipe HandLandmarker with the specified model and options.
* Loads the WASM fileset and creates the handLandmarker instance.
* 
* @returns {Promise<void>} Resolves when the handLandmarker is ready.
*/
export const initializeHandLandmarker = async () => {
  const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
  );

  handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
          delegate: "GPU"
      },
      runningMode: "VIDEO",
      numHands: 2
  });
};

/**
* Starts the webcam, attaches the video stream to the provided videoRef,
* and begins hand landmark detection and drawing on the provided canvasRef.
* 
* @param videoRef - React ref to the HTMLVideoElement for webcam input.
* @param canvasRef - React ref to the HTMLCanvasElement for drawing results.
*/
export const startWebcamAndDetect = (
  videoRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>
) => {
  const constraints = { video: true };

  navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
          if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.addEventListener('loadeddata', () => predictWebcam(videoRef, canvasRef));
          }
      })
      .catch((err) => {
          console.error("Error accessing webcam:", err);
      });
};

/**
* Draws lines between connected hand landmarks on the canvas.
* 
* @param ctx - Canvas rendering context.
* @param landmarks - Array of landmark objects with x and y properties.
* @param width - Width of the canvas/video frame.
* @param height - Height of the canvas/video frame.
*/
const drawConnections = (
  ctx: CanvasRenderingContext2D,
  landmarks: any[],
  width: number,
  height: number
) => {
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 4;

  for (const [startIdx, endIdx] of HAND_CONNECTIONS) {
      const start = landmarks[startIdx];
      const end = landmarks[endIdx];

      ctx.beginPath();
      ctx.moveTo(start.x * width, start.y * height);
      ctx.lineTo(end.x * width, end.y * height);
      ctx.stroke();
  }
};

/**
* Performs hand landmark detection on the current video frame,
* draws the results on the canvas, and schedules the next frame.
* 
* @param videoRef - React ref to the HTMLVideoElement.
* @param canvasRef - React ref to the HTMLCanvasElement.
*/
const predictWebcam = async (
  videoRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>
) => {
  const video = videoRef.current!;
  const canvas = canvasRef.current!;
  const ctx = canvas.getContext('2d')!;

  // Set canvas size to match the video frame size
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  if (lastVideoTime !== video.currentTime) {
      const startTimeMs = performance.now();
      lastVideoTime = video.currentTime;
      results = handLandmarker.detectForVideo(video, startTimeMs);
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  resultLandmarks.length = 0; // Clear previous landmarks

  if (results?.landmarks) {
      for (const landmarks of results.landmarks) {
          drawConnections(ctx, landmarks, video.videoWidth, video.videoHeight);

          for (const landmark of landmarks) {
              resultLandmarks.push([landmark.x, landmark.y]); // Store landmark coordinates as pairs of [x, y] to be flattened later
              ctx.beginPath();
              ctx.arc(landmark.x * video.videoWidth, landmark.y * video.videoHeight, 5, 0, 2 * Math.PI);
              ctx.fillStyle = 'red';
              ctx.fill();
          }
      }
  }

  window.requestAnimationFrame(() => predictWebcam(videoRef, canvasRef));
};