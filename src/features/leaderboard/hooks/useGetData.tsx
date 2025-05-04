import { useEffect } from "react";
import { fetchData } from "../../../utils/firebase";
import { Entry } from "../leaderboardTypes";

/**
 * Custom Hook: useGetData
 * 
 * Fetches leaderboard data from the Firestore database and updates the provided state setter.
 * 
 * Features:
 * - Fetches data from the "leaderboards" Firestore collection using the `fetchData` utility.
 * - Handles errors gracefully by logging them to the console.
 * - Automatically runs on component mount.
 * 
 * @param setEntries - A state setter function to update the leaderboard entries.
 * 
 * Example Usage:
 * ```tsx
 * const [entries, setEntries] = useState<Entry[]>([]);
 * useGetData(setEntries);
 * ```
 */
const useGetData = (
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>
) => {
  useEffect(() => {
    const getScores = async () => {
      try {
        const fetchedDatas = await fetchData("leaderboards");
        setEntries(fetchedDatas);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getScores();
  }, [setEntries]);
};

export default useGetData;
