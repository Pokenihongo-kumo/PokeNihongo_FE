import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Language = "vi" | "en" | "ja";

interface LanguageState {
    currentLanguage: Language;
}

const initialState: LanguageState = {
    currentLanguage: (localStorage.getItem("language") as Language) || "vi",
};

const languageSlice = createSlice({
    name: "language",
    initialState,
    reducers: {
        setLanguage: (state, action: PayloadAction<Language>) => {
            state.currentLanguage = action.payload;
            localStorage.setItem("language", action.payload);
        },
    },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
