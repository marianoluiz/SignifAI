/**
 * Represents the state of the game.
 */
export interface GameState {
  /**
   * The total duration of the song in milliseconds.
   */
  song_duration: number;

  /**
   * The player's current score.
   */
  score: number;

  /**
   * The current hand symbol being displayed.
   */
  currentSymbol: string;

  /**
   * The lyrics associated with the current hand symbol.
   */
  currentLyrics: string;

  /**
   * The prompt for the current hand symbol.
   */
  currentPrompt: string;

  /**
   * The player's current rating (e.g., "PERFECT", "GOOD", "OK", "MISS").
   */
  currentRating: string;

  /**
   * The timestamp when the current rating was calculated.
   */
  timestamp: number;
}

/**
 * Action type for setting the total game duration.
 */
export const SET_GAME = "SET_GAME" as const;

/**
 * Action type for adding points to the player's score.
 */
export const ADD_SCORE = "ADD_SCORE" as const;

/**
 * Action type for reducing the remaining song duration by 1 second.
 */
export const REDUCE_DURATION = "REDUCE_DURATION" as const;

/**
 * Action type for updating the current hand entry data.
 */
export const ADD_HAND_ENTRY = "ADD_HAND_ENTRY" as const;

/**
 * Action type for setting the player's current rating.
 */
export const SET_CURRENT_RATING = "SET_CURRENT_RATING" as const;

// Define Action types

/**
 * Action for setting the total game duration.
 */
type SetGameAction = {
  type: typeof SET_GAME;
  /**
   * The total duration of the song in milliseconds.
   */
  payload: number;
};

/**
 * Action for adding points to the player's score.
 */
type AddScoreAction = {
  type: typeof ADD_SCORE;
  /**
   * The player's rating (e.g., "PERFECT", "GOOD", "OK", "MISS").
   */
  payload: { rating: string; difficulty: string };
};

/**
 * Action for reducing the remaining song duration by 1 second.
 */
type ReduceDurationAction = {
  type: typeof REDUCE_DURATION;
};

/**
 * Action for updating the current hand entry data.
 */
type AddHandEntryAction = {
  type: typeof ADD_HAND_ENTRY;
  /**
   * The current hand symbol being displayed.
   */
  payload: {
    currentSymbol: string;
    /**
     * The lyrics associated with the current hand symbol.
     */
    currentLyrics: string;
    /**
     * The prompt for the current hand symbol.
     */
    currentPrompt: string;
  };
};

/**
 * Action for setting the player's current rating.
 */
type setCurrentRating = {
  type: typeof SET_CURRENT_RATING;
  /**
   * The player's current position (e.g., hand position).
   */
  payload: {
    newPosition: number;
    /**
     * The X-coordinate of the perfect zone.
     */
    perfectZoneX: number;
    /**
     * The timestamp when the rating was calculated.
     */
    timestamp: number;
    /**
     * The device of the user
     */
    deviceType: string;
  };
};

/**
 * Union type for all possible game actions.
 */
export type GameAction =
  | SetGameAction
  | AddScoreAction
  | ReduceDurationAction
  | AddHandEntryAction
  | setCurrentRating;