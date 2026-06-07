export {
  updatePersonalInfo,
  updateProfileImage,
  selectLocationPreference,
  selectIsHydrated,
  updateCareerGoal,
  selectCareerGoal,
  updateSkills,
  selectSkills,
  updateEducation,
  updateExperience,
  updateProjects,
  updateSocialLinks,
} from './slices';

export type { FullUserProfile } from './slices';
import type { AppDispatch } from './store';
import { setPersonalInfo } from './slices/personalInfoSlice';
import { setCareerGoal } from './slices/careerGoalSlice';
import { setSkills } from './slices/skillsSlice';
import { setPortfolio } from './slices/portfolioSlice';
import { setSocialLinks } from './slices/socialLinksSlice';
import type { FullUserProfile } from './slices/types';

export const setUserProfile =
  (data: FullUserProfile) => (dispatch: AppDispatch) => {
    dispatch(
      setPersonalInfo({
        name: data.name,
        email: data.email,
        bio: data.bio,
        location: data.location,
        locationPreference: data.locationPreference,
        phone: data.phone,
        profileImage: data.profileImage,
      }),
    );
    dispatch(setCareerGoal(data.careerGoal));
    dispatch(setSkills(data.skills));
    dispatch(
      setPortfolio({
        educationHistory: data.educationHistory,
        experience: data.experience,
        projects: data.projects,
      }),
    );
    dispatch(setSocialLinks(data.socialLinks));
  };
