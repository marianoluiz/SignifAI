export interface GameState {
    song_duration: number;
    score: number;

    currentSymbol: string;
    currentPrompt: string;
    currentRating: string;
}

export const SET_GAME = "SET_GAME" as const;
export const ADD_SCORE = "ADD_SCORE" as const;
export const REDUCE_DURATION = "REDUCE_DURATION" as const;
export const ADD_HAND_ENTRY = "ADD_HAND_ENTRY" as const;
export const SET_CURRENT_RATING = "SET_CURRENT_RATING" as const;

// Define Action types
type SetGameAction = {
  type: typeof SET_GAME;
  payload: number;
};

type AddScoreAction = {
  type: typeof ADD_SCORE;
  payload: { rating: string; difficulty: string };
};

type ReduceDurationAction = {
  type: typeof REDUCE_DURATION;
};

type AddHandEntryAction = {
  type: typeof ADD_HAND_ENTRY;
  payload: { currentSymbol: string, currentPrompt: string }
};

type setCurrentRating = ({
  type: typeof SET_CURRENT_RATING;
  payload: { newPosition: number, perfectZoneX: number }
});

export type GameAction =
  | SetGameAction
  | AddScoreAction
  | ReduceDurationAction
  | AddHandEntryAction
  | setCurrentRating;