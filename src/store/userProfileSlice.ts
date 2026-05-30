// ---------------------------------------------------------------------------
// BACKWARD COMPATIBILITY RE-EXPORTS
// ---------------------------------------------------------------------------
// This file re-exports everything from the new modular slices so that
// existing imports like `from "@/store/userProfileSlice"` continue to work.
//
// New code should import directly from "@/store/slices" instead.
// ---------------------------------------------------------------------------

export {
  // Personal Info
  updatePersonalInfo,
  updateProfileImage,
  selectLocationPreference,
  selectIsHydrated,

  // Career Goal
  updateCareerGoal,
  selectCareerGoal,

  // Skills
  updateSkills,
  selectSkills,

  // Portfolio
  updateEducation,
  updateExperience,
  updateProjects,

  // Social Links
  updateSocialLinks,
} from "./slices";

export type { FullUserProfile } from "./slices";

// ---------------------------------------------------------------------------
// Composite hydration action creator
// ---------------------------------------------------------------------------
// ProfilePageClient dispatches `setUserProfile(...)` to hydrate ALL slices
// at once from server-fetched data. We provide this as a thunk-like helper.
// ---------------------------------------------------------------------------
import type { AppDispatch } from "./store";
import { setPersonalInfo } from "./slices/personalInfoSlice";
import { setCareerGoal } from "./slices/careerGoalSlice";
import { setSkills } from "./slices/skillsSlice";
import { setPortfolio } from "./slices/portfolioSlice";
import { setSocialLinks } from "./slices/socialLinksSlice";
import type { FullUserProfile } from "./slices/types";

/**
 * Hydrates all Redux slices from server-fetched user data.
 * Call this once when the profile page mounts.
 */
export const setUserProfile = (data: FullUserProfile) => (dispatch: AppDispatch) => {
  dispatch(
    setPersonalInfo({
      name: data.name,
      email: data.email,
      bio: data.bio,
      location: data.location,
      locationPreference: data.locationPreference,
      phone: data.phone,
      profileImage: data.profileImage,
    })
  );
  dispatch(setCareerGoal(data.careerGoal));
  dispatch(setSkills(data.skills));
  dispatch(
    setPortfolio({
      educationHistory: data.educationHistory,
      experience: data.experience,
      projects: data.projects,
    })
  );
  dispatch(setSocialLinks(data.socialLinks));
};
