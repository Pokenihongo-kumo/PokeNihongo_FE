import { RootState } from "@redux/store/store";

export const selectCurrentLanguage = (state: RootState) => state.language.currentLanguage;
