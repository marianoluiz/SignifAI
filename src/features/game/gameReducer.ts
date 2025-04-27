import { GameState, GameAction, SET_GAME, ADD_SCORE, REDUCE_DURATION, ADD_HAND_ENTRY } from "./gameTypes";

// Helper function to calculate score
const calculateScore = (rating: string, difficulty: string) => {
  let points = 0;

  // Add points based on rating
  if (rating === "PERFECT") points += 100;
  else if (rating === "GOOD") points += 75;
  else if (rating === "OK") points += 50;
  else if (rating === "MISS") return points;

    // Add points based on difficulty
  if (difficulty === "Easy") points += 5;
  else if (difficulty === "Medium") points += 10;
  else if (difficulty === "Hard") points += 15;

  return points;
};

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
      return { ...state, currentHandDuration: action.payload.currentHandDuration, currentSymbol: action.payload.currentSymbol, currentPrompt: action.payload.currentPrompt}
    
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

export const addHandEntry = ( currentHandDuration: number, currentSymbol: string, currentPrompt: string) => ({
  type: ADD_HAND_ENTRY,
  payload: { currentHandDuration, currentSymbol, currentPrompt}
});