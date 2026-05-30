import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { Skill } from "./types";

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
export interface SkillsState {
  skills: Skill[];
}

const initialState: SkillsState = {
  skills: [],
};

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------
const skillsSlice = createSlice({
  name: "skills",
  initialState,
  reducers: {
    /** Set skills array (used during hydration) */
    setSkills(state, action: PayloadAction<Skill[]>) {
      state.skills = action.payload;
    },

    /** Replace the entire skills array */
    updateSkills(state, action: PayloadAction<Skill[]>) {
      state.skills = action.payload;
    },
  },
});

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------
export const { setSkills, updateSkills } = skillsSlice.actions;

// ---------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------
export const selectSkills = (state: RootState) => state.skills.skills;

export default skillsSlice.reducer;
