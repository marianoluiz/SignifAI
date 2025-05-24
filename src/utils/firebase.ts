import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth";

/**
 * Firebase configuration object.
 * Replace these values with your Firebase project's configuration.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};  


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

/**
 * Adds data to a specified Firestore collection.
 * 
 * @param collectionName - The name of the Firestore collection.
 * @param data - The data object to be added to the collection.
 * @returns A promise that resolves to the document reference of the added data.
 * @throws An error if the operation fails.
 */
export const addDataToFirestore = async (collectionName: string, data: object) => {
    try {
        const docRef = await addDoc(collection(db, collectionName), data);
        // console.log("Document written with ID: ", docRef.id);
        return docRef;
    } catch (error) {
        console.error("Error adding document: ", error);
        throw error;
    }
};

/**
 * Fetches all documents from a specified Firestore collection.
 * 
 * @param collectionName - The name of the Firestore collection.
 * @returns A promise that resolves to an array of documents, each containing its ID and data.
 * @throws An error if the operation fails.
 */
export const fetchData = async (collectionName: string, sortBy: string = "score",
  order: "asc" | "desc" = "desc") => {
    try {
        const q = query(
            collection(db, collectionName),
            orderBy(sortBy, order)
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
            id: doc.id,                     // Accessing the document ID
            name: doc.data().name,          // Accessing the 'name' property from the document data
            score: doc.data().score,        // Accessing the 'score' property from the document data
            song: doc.data().song           // Accessing the 'song' property from the document data
        }));
        // console.log("Fetched data:", data);
        return data;
    } catch (error) {
        console.error("Error fetching documents: ", error);
        throw error;
    }
};

/**
 * Saves a user's score to the "leaderboards" Firestore collection.
 * 
 * @param userscore - The score achieved by the user.
 * @param song_title - The title of the song associated with the score.
 * @param username - The name of the user.
 * @returns A promise that resolves when the data is successfully added.
 * @throws An error if the operation fails.
 */
export const saveScore = async (
    userscore: number,
    song_title: string,
    username: string
) => {
    const data = { name: username, score: userscore, song: song_title };
    await addDataToFirestore("leaderboards", data);
};

// Export initialized Firebase services and utility functions
export { app, db, auth };