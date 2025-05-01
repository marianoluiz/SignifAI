import { GameState, GameAction, SET_GAME, ADD_SCORE, REDUCE_DURATION, ADD_HAND_ENTRY, SET_CURRENT_RATING } from "./gameTypes";
import { calculateRating } from "./helpers/calculateRating";
import { calculateScore } from "./helpers/calculateScore";

export const gameReducer = (state: GameState, action: GameAction) => {
  switch (action.type) {
    case SET_GAME:
      return { ...state, song_duration: action.payload }

    case ADD_SCORE:
      { const { rating, difficulty } = action.payload;
      const points = calculateScore(rating, difficulty);
      return { ...state, score: state.score + points }; }

    case REDUCE_DURATION:
      return { ...state, song_duration: state.song_duration - 1000}

    case ADD_HAND_ENTRY:
      return { ...state, currentSymbol: action.payload.currentSymbol, currentPrompt: action.payload.currentPrompt}
    
    case SET_CURRENT_RATING:
      { const { newPosition, perfectZoneX } = action.payload;
        const rating = calculateRating(newPosition, perfectZoneX);
        return { ...state, currentRating: rating}; }

    default:
      return state;
  }
};

// Action creators
export const setGame = (song_duration: number) => ({
  type: SET_GAME,
  payload: song_duration,
});

export const addScore = (rating: string, difficulty: string) => ({
  type: ADD_SCORE,
  payload: { rating, difficulty },
});

export const reduceDuration = () => ({
  type: REDUCE_DURATION,
});

export const addHandEntry = ( currentSymbol: string, currentPrompt: string) => ({
  type: ADD_HAND_ENTRY,
  payload: { currentSymbol, currentPrompt}
});

export const setCurrentRating = ( newPosition: number, perfectZoneX: number ) => ({
  type: SET_CURRENT_RATING,
  payload: { newPosition, perfectZoneX }
});