import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { SocialLinks } from "./types";

export interface SocialLinksState {
  socialLinks: SocialLinks;
}

const initialState: SocialLinksState = {
  socialLinks: { linkedin: "", github: "", portfolio: "", twitter: "", instagram: "", },
};


const socialLinksSlice = createSlice({
  name: "socialLinks",
  initialState,
  reducers: {
    setSocialLinks(state, action: PayloadAction<SocialLinks>) {
      state.socialLinks = action.payload;
    },

    updateSocialLinks(state, action: PayloadAction<SocialLinks>) {
      state.socialLinks = action.payload;
    },
  },
});


export const { setSocialLinks, updateSocialLinks } = socialLinksSlice.actions;

export const selectSocialLinks = (state: RootState) =>
  state.socialLinks.socialLinks;

export default socialLinksSlice.reducer;
