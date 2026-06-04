import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
export interface PersonalInfoState {
  name: string;
  email: string;
  bio: string;
  location: string;
  locationPreference: string;
  phone: string;
  profileImage: string;
  isHydrated: boolean;
}

const initialState: PersonalInfoState = {
  name: "",
  email: "",
  bio: "",
  location: "",
  locationPreference: "",
  phone: "",
  profileImage: "",
  isHydrated: false,
};

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------
const personalInfoSlice = createSlice({
  name: "personalInfo",
  initialState,
  reducers: {
    /** Hydrate all personal info fields from server data */
    setPersonalInfo(state, action: PayloadAction<Omit<PersonalInfoState, "isHydrated">>) {
      return { ...action.payload, isHydrated: true };
    },

    /** Partial update of personal info fields */
    updatePersonalInfo(
      state,
      action: PayloadAction<{
        name?: string;
        bio?: string;
        location?: string;
        phone?: string;
        locationPreference?: string;
      }>
    ) {
      const { name, bio, location, phone, locationPreference } = action.payload;
      if (name !== undefined) state.name = name;
      if (bio !== undefined) state.bio = bio;
      if (location !== undefined) state.location = location;
      if (phone !== undefined) state.phone = phone;
      if (locationPreference !== undefined) state.locationPreference = locationPreference;
    },

    /** Update profile image */
    updateProfileImage(state, action: PayloadAction<string>) {
      state.profileImage = action.payload;
    },
  },
});

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------
export const { setPersonalInfo, updatePersonalInfo, updateProfileImage } =
  personalInfoSlice.actions;

// ---------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------
export const selectPersonalInfo = (state: RootState) => state.personalInfo;
export const selectLocationPreference = (state: RootState) =>
  state.personalInfo.locationPreference;
export const selectIsHydrated = (state: RootState) =>
  state.personalInfo.isHydrated;

export default personalInfoSlice.reducer;
