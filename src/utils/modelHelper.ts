import * as tf from '@tensorflow/tfjs';

/**
 * Cached TensorFlow.js GraphModel instance.
 * This is used to store the loaded model to avoid reloading it multiple times.
 */
let model: tf.GraphModel | null = null;

/**
 * List of labels corresponding to the model's output classes.
 * These labels represent hand gestures or signs.
 */
export const LABEL_LIST = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'O', 'P',
  'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'I love you', 'You', 'Me'
];

/**
 * Loads the TensorFlow.js GraphModel from the `/models` directory.
 * If the model is already loaded, it returns the cached instance.
 * 
 * @returns {Promise<tf.GraphModel | null>} The loaded model or `null` if loading fails.
 */
const loadModel = async (): Promise<tf.GraphModel | null> => {
  if (model) return model; // Return cached model if already loaded
  try {
    // Load the model from the specified path
    model = await tf.loadGraphModel('/models/model.json');
    return model;
  } catch (error) {
    console.error('Error loading model:', error);
    return null;
  }
};

/**
 * Preprocesses hand landmark coordinates for model input.
 * - Converts the coordinates to relative values based on the first landmark.
 * - Flattens the 2D array of coordinates into a 1D array.
 * - Normalizes the values by dividing by the maximum absolute value.
 * 
 * @param {number[][]} landmarkList - Array of [x, y] landmark coordinates.
 * @returns {number[]} The processed and normalized 1D array of coordinates.
 */
export function preProcessLandmark(landmarkList: number[][]): number[] {
  const tempLandmarkList = landmarkList.map(point => [...point]); // Deep copy of the array

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

  // Flatten the array to 1D
  const flatList = tempLandmarkList.flat();

  // Normalize the values
  const maxValue = Math.max(...flatList.map(Math.abs));
  const normalized = flatList.map(n => n / maxValue);

  return normalized;
}

/**
 * Runs inference on the given hand landmark list and returns the predicted gesture(s).
 * - If the input length is greater than 42, it splits the input into two parts
 *   and predicts two gestures.
 * - If the input length is exactly 42, it predicts a single gesture.
 * - If the input length is less than 42, it returns "No prediction".
 * 
 * @param {number[][]} landmarkList - Array of [x, y] landmark coordinates.
 * @returns {Promise<string | null>} The predicted gesture(s) as a string, or `null` if the model is not loaded.
 */
export const getPrediction = async (landmarkList: number[][]): Promise<string | null> => {
  const processedInput = preProcessLandmark(landmarkList); // Preprocess the input
  console.log("Processed Input:", processedInput.length);

  const loadedModel = await loadModel(); // Load the model
  if (!loadedModel) {
    console.error("Model not loaded");
    return null;
  }

  let resultString = '';
  let inputTensor: tf.Tensor2D;
  let prediction: tf.Tensor<tf.Rank>;
  let predictionArray: number[][];

  // Handle input length greater than 42
  if (processedInput.length > 42) {
    const processed1 = processedInput.splice(0, 42); // Take the first 42 elements
    inputTensor = tf.tensor2d([processed1]); // Create a tensor for the first part
    prediction = loadedModel.predict(inputTensor) as tf.Tensor;
    predictionArray = prediction.arraySync() as number[][];
    const resultIndex1 = predictionArray[0].indexOf(Math.max(...predictionArray[0]));

    inputTensor = tf.tensor2d([processedInput]); // Create a tensor for the remaining part
    prediction = loadedModel.predict(inputTensor) as tf.Tensor;
    predictionArray = prediction.arraySync() as number[][];
    const resultIndex2 = predictionArray[0].indexOf(Math.max(...predictionArray[0]));

    resultString = LABEL_LIST[resultIndex1] + " " + LABEL_LIST[resultIndex2]; // Combine predictions
  } 
  // Handle input length exactly 42
  else if (processedInput.length === 42) {
    inputTensor = tf.tensor2d([processedInput]); // Create a tensor for the input
    prediction = loadedModel.predict(inputTensor) as tf.Tensor;
    predictionArray = prediction.arraySync() as number[][];
    const resultIndex = predictionArray[0].indexOf(Math.max(...predictionArray[0]));

    resultString = LABEL_LIST[resultIndex]; // Single prediction
  } 
  // Handle input length less than 42
  else {
    resultString = 'No prediction';
  }

  return resultString;
};