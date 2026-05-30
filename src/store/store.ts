import { configureStore } from "@reduxjs/toolkit";
import {
  personalInfoReducer,
  careerGoalReducer,
  skillsReducer,
  portfolioReducer,
  socialLinksReducer,
} from "./slices";

export const store = configureStore({
  reducer: {
    personalInfo: personalInfoReducer,
    careerGoal: careerGoalReducer,
    skills: skillsReducer,
    portfolio: portfolioReducer,
    socialLinks: socialLinksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
