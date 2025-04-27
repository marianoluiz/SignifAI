import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "./appTypes"

const initialState: AppState = {
  isLoading: true,
  isAppInitialized: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    // dispatching: dispatch(setLoading(true))
    // redux transform it to: { type: 'app/setLoading', payload: true }
    // the reducer receives it in this form:
    // setLoading(currentState, { type: 'app/setLoading', payload: true })
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAppInitialized: (state, action: PayloadAction<boolean>) => {
      state.isAppInitialized = action.payload;
    },
  }
})

export const { setLoading, setAppInitialized } = appSlice.actions;

export default appSlice.reducer