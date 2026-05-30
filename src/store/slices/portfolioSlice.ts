import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { Education, Experience, Project } from "./types";

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
export interface PortfolioState {
  educationHistory: Education[];
  experience: Experience[];
  projects: Project[];
}

const initialState: PortfolioState = {
  educationHistory: [],
  experience: [],
  projects: [],
};

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------
const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    /** Set all portfolio data (used during hydration) */
    setPortfolio(state, action: PayloadAction<PortfolioState>) {
      state.educationHistory = action.payload.educationHistory;
      state.experience = action.payload.experience;
      state.projects = action.payload.projects;
    },

    /** Replace the entire education history array */
    updateEducation(state, action: PayloadAction<Education[]>) {
      state.educationHistory = action.payload;
    },

    /** Replace the entire experience array */
    updateExperience(state, action: PayloadAction<Experience[]>) {
      state.experience = action.payload;
    },

    /** Replace the entire projects array */
    updateProjects(state, action: PayloadAction<Project[]>) {
      state.projects = action.payload;
    },
  },
});

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------
export const { setPortfolio, updateEducation, updateExperience, updateProjects } =
  portfolioSlice.actions;

// ---------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------
export const selectEducationHistory = (state: RootState) =>
  state.portfolio.educationHistory;
export const selectExperience = (state: RootState) =>
  state.portfolio.experience;
export const selectProjects = (state: RootState) =>
  state.portfolio.projects;

export default portfolioSlice.reducer;
