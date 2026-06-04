import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { CareerGoal } from "./types";

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
export interface CareerGoalState {
  careerGoal: CareerGoal;
}

const initialState: CareerGoalState = {
  careerGoal: { role: "" },
};

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------
const careerGoalSlice = createSlice({
  name: "careerGoal",
  initialState,
  reducers: {
    /** Set career goal (used during hydration) */
    setCareerGoal(state, action: PayloadAction<CareerGoal>) {
      state.careerGoal = action.payload;
    },

    /** Update career goal role */
    updateCareerGoal(state, action: PayloadAction<{ role: string }>) {
      state.careerGoal = action.payload;
    },
  },
});

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------
export const { setCareerGoal, updateCareerGoal } = careerGoalSlice.actions;

// ---------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------
export const selectCareerGoal = (state: RootState) =>
  state.careerGoal.careerGoal.role;
export const selectCareerGoalObj = (state: RootState) =>
  state.careerGoal.careerGoal;

export default careerGoalSlice.reducer;
