import * as tf from '@tensorflow/tfjs';

let model: tf.GraphModel | null = null;

const loadModel = async () => {
  if (model) return model;
  try {
    // Assumes model files are in public/models/
    model = await tf.loadGraphModel('/models/model.json');
    return model;
  } catch (error) {
    console.error('Error loading model:', error);
    return null;
  }
};

function preProcessLandmark(landmarkList: number[][]): number[] {
  // Deep copy
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

export const getPrediction = async (landmarkList: number[][]) => {
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
  return resultIndex;
};