// ---------------------------------------------------------------------------
// Barrel export — import everything from "@/store/slices"
// ---------------------------------------------------------------------------

// Types
export type {
  Skill,
  Education,
  Experience,
  Project,
  SocialLinks,
  CareerGoal,
  FullUserProfile,
} from "./types";

// Personal Info
export {
  default as personalInfoReducer,
  setPersonalInfo,
  updatePersonalInfo,
  updateProfileImage,
  selectPersonalInfo,
  selectLocationPreference,
  selectIsHydrated,
} from "./personalInfoSlice";
export type { PersonalInfoState } from "./personalInfoSlice";

// Career Goal
export {
  default as careerGoalReducer,
  setCareerGoal,
  updateCareerGoal,
  selectCareerGoal,
  selectCareerGoalObj,
} from "./careerGoalSlice";
export type { CareerGoalState } from "./careerGoalSlice";

// Skills
export {
  default as skillsReducer,
  setSkills,
  updateSkills,
  selectSkills,
} from "./skillsSlice";
export type { SkillsState } from "./skillsSlice";

// Portfolio (Education, Experience, Projects)
export {
  default as portfolioReducer,
  setPortfolio,
  updateEducation,
  updateExperience,
  updateProjects,
  selectEducationHistory,
  selectExperience,
  selectProjects,
} from "./portfolioSlice";
export type { PortfolioState } from "./portfolioSlice";

// Social Links
export {
  default as socialLinksReducer,
  setSocialLinks,
  updateSocialLinks,
  selectSocialLinks,
} from "./socialLinksSlice";
export type { SocialLinksState } from "./socialLinksSlice";
