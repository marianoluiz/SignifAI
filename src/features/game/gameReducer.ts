import { GameState, GameAction, SET_GAME, ADD_SCORE, REDUCE_DURATION, ADD_HAND_ENTRY, SET_CURRENT_RATING } from "./gameTypes";
import { calculateRating } from "./utils/calculateRating";
import { calculateScore } from "./utils/calculateScore";

/**
 * Reducer function for managing the game state. 
 * **This is not a global reducer
 * 
 * Handles actions such as setting the game duration, updating the score, reducing the song duration,
 * adding hand entry data, and setting the current rating.
 * 
 * @param state - The current state of the game.
 * @param action - The action to be processed, containing a type and optional payload.
 * @returns The updated game state.
 */
export const gameReducer = (state: GameState, action: GameAction) => {
  switch (action.type) {
    /**
     * Sets the initial game duration.
     * 
     * @action.type SET_GAME
     * @action.payload The total duration of the song in milliseconds.
     */
    case SET_GAME:
      return { ...state, song_duration: action.payload }

    /**
     * Reduces the remaining song duration by 1000 milliseconds (1 second).
     * 
     * @action.type REDUCE_DURATION
     */
    case REDUCE_DURATION:
      return { ...state, song_duration: state.song_duration - 1000}

    /**
     * Updates the current hand entry data, including the symbol, lyrics, and prompt.
     * 
     * @action.type ADD_HAND_ENTRY
     * @action.payload.currentSymbol The current hand symbol being displayed.
     * @action.payload.currentLyrics The lyrics associated with the current hand symbol.
     * @action.payload.currentPrompt The prompt for the current hand symbol.
     */
    case ADD_HAND_ENTRY:
      return { ...state, currentSymbol: action.payload.currentSymbol, currentLyrics: action.payload.currentLyrics, currentPrompt: action.payload.currentPrompt}
    
    /**
     * Adds points to the player's score based on their rating and difficulty.
     * 
     * @action.type ADD_SCORE
     * @action.payload.rating The player's rating (e.g., "PERFECT", "GOOD", "OK", "MISS").
     * @action.payload.difficulty The difficulty level of the game.
     */
    case ADD_SCORE:
      { const { rating, difficulty } = action.payload;
      const points = calculateScore(rating, difficulty);
      return { ...state, score: state.score + points }; }

    /**
     * Sets the current rating based on the player's position relative to the perfect zone.
     * 
     * @action.type SET_CURRENT_RATING
     * @action.payload.newPosition The player's current position (e.g., hand position).
     * @action.payload.perfectZoneX The X-coordinate of the perfect zone.
     * @action.payload.timestamp The timestamp when the rating was calculated.
     */
    
    case SET_CURRENT_RATING:
      { const { newPosition, perfectZoneX, timestamp} = action.payload;
        const rating = calculateRating(newPosition, perfectZoneX);
        return { ...state, currentRating: rating, timestamp: timestamp}; }
    
    /**
     * Default case: Returns the current state if the action type is not recognized.
     */
    default:
      return state;
  }
};

// Action creators ------------------------------

/**
 * Creates an action to set the total game duration.
 * 
 * @param song_duration - The total duration of the song in milliseconds.
 * @returns An action object with type `SET_GAME` and the song duration as payload.
 */
export const setGame = (song_duration: number) => ({
  type: SET_GAME,
  payload: song_duration,
});

/**
 * Creates an action to add points to the player's score.
 * 
 * @param rating - The player's rating (e.g., "PERFECT", "GOOD", "OK", "MISS").
 * @param difficulty - The difficulty level of the game.
 * @returns An action object with type `ADD_SCORE` and the rating and difficulty as payload.
 */
export const addScore = (rating: string, difficulty: string) => ({
  type: ADD_SCORE,
  payload: { rating, difficulty },
});

/**
 * Creates an action to reduce the remaining song duration by 1000 milliseconds (1 second).
 * 
 * @returns An action object with type `REDUCE_DURATION`.
 */
export const reduceDuration = () => ({
  type: REDUCE_DURATION,
});

/**
 * Creates an action to update the current hand entry data.
 * 
 * @param currentSymbol - The current hand symbol being displayed.
 * @param currentLyrics - The lyrics associated with the current hand symbol.
 * @param currentPrompt - The prompt for the current hand symbol.
 * @returns An action object with type `ADD_HAND_ENTRY` and the hand entry data as payload.
 */
export const addHandEntry = ( currentSymbol: string, currentLyrics: string, currentPrompt: string ) => ({
  type: ADD_HAND_ENTRY,
  payload: { currentSymbol, currentLyrics, currentPrompt}
});

/**
 * Creates an action to set the current rating based on the player's position.
 * 
 * @param newPosition - The player's current position (e.g., hand position).
 * @param perfectZoneX - The X-coordinate of the perfect zone.
 * @param timestamp - The timestamp when the rating was calculated.
 * @returns An action object with type `SET_CURRENT_RATING` and the rating data as payload.
 */
export const setCurrentRating = ( newPosition: number, perfectZoneX: number, timestamp: number ) => ({
  type: SET_CURRENT_RATING,
  payload: { newPosition, perfectZoneX, timestamp }
});