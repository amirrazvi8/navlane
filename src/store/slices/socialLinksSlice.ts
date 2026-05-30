import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { SocialLinks } from "./types";

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
export interface SocialLinksState {
  socialLinks: SocialLinks;
}

const initialState: SocialLinksState = {
  socialLinks: { linkedin: "", github: "", portfolio: "", twitter: "" },
};

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------
const socialLinksSlice = createSlice({
  name: "socialLinks",
  initialState,
  reducers: {
    /** Set social links (used during hydration) */
    setSocialLinks(state, action: PayloadAction<SocialLinks>) {
      state.socialLinks = action.payload;
    },

    /** Update social links */
    updateSocialLinks(state, action: PayloadAction<SocialLinks>) {
      state.socialLinks = action.payload;
    },
  },
});

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------
export const { setSocialLinks, updateSocialLinks } = socialLinksSlice.actions;

// ---------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------
export const selectSocialLinks = (state: RootState) =>
  state.socialLinks.socialLinks;

export default socialLinksSlice.reducer;
