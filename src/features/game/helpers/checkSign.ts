import { LABEL_LIST } from "../../../utils/modelHelper";

/**
 * Checks if all predicted hand signs match the ASL values in song_entries.
 *
 * @param predictedLabel - predicted of handsign by the model.
 * @param asl - correct asl shown.
 * @returns {boolean} - True if all predictions match the ASL values, false otherwise.
 */
const checkSign = (predictedLabel: string | null, asl: string) => {
  if (predictedLabel === asl) {
    return true;
  }
  console.log("Wrong at checksign: ", predictedLabel, "vs", asl)
}

export default checkSign;