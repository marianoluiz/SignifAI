import * as tf from '@tensorflow/tfjs';

/**
 * Cached TensorFlow.js GraphModel instance.
 */
let model: tf.GraphModel | null = null;

/**
 * Loads the TensorFlow.js GraphModel from the /models directory.
 * Uses a cached instance if already loaded.
 * 
 * @returns {Promise<tf.GraphModel | null>} The loaded model or null if loading fails.
 */
const loadModel = async (): Promise<tf.GraphModel | null> => {
  if (model) return model;
  try {
    // Model folder should be in the public directory
    // and accessible via the URL /models/model.json
    model = await tf.loadGraphModel('/models/model.json');
    return model;
  } catch (error) {
    console.error('Error loading model:', error);
    return null;
  }
};

/**
 * Preprocesses hand landmark coordinates for model input.
 * - Converts to relative coordinates based on the first landmark.
 * - Flattens the 2D array to 1D.
 * - Normalizes values by the maximum absolute value.
 * 
 * @param {number[][]} landmarkList - Array of [x, y] landmark coordinates.
 * @returns {number[]} The processed and normalized 1D array.
 */
export function preProcessLandmark(landmarkList: number[][]): number[] {
  const tempLandmarkList = landmarkList.map(point => [...point]);

  // Convert to relative coordinates
  let baseX = 0, baseY = 0;
  tempLandmarkList.forEach((landmarkPoint, index) => {
    if (index === 0) {
      baseX = landmarkPoint[0];
      baseY = landmarkPoint[1];
    }
    landmarkPoint[0] -= baseX;
    landmarkPoint[1] -= baseY;
  });

  // Flatten to 1D array
  const flatList = tempLandmarkList.flat();

  // Normalization
  const maxValue = Math.max(...flatList.map(Math.abs));
  const normalized = flatList.map(n => n / maxValue);

  return normalized;
}

/**
 * Runs inference on the given hand landmark list and returns the predicted class index.
 * 
 * @param {number[][]} landmarkList - Array of [x, y] landmark coordinates.
 * @returns {Promise<number | null>} The predicted class index, or null if model is not loaded.
 */
export const getPrediction = async (landmarkList: number[][]): Promise<number | null> => {
  const processedInput = preProcessLandmark(landmarkList);
  const loadedModel = await loadModel();
  if (!loadedModel) {
    console.error("Model not loaded");
    return null;
  }
  const inputTensor = tf.tensor2d([processedInput]);
  const prediction = loadedModel.predict(inputTensor) as tf.Tensor;
  const predictionArray = prediction.arraySync() as number[][];
  // Get the first (and only) prediction, then the index of the max value
  const resultIndex = predictionArray[0].indexOf(Math.max(...predictionArray[0]));
  return resultIndex; // Returns the index of the predicted class
};