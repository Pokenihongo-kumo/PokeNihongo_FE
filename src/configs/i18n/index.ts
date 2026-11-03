import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import vi from "../../locales/vi.json";
import en from "../../locales/en.json";
import ja from "../../locales/ja.json";

const resources = {
    vi: {
        translation: vi,
    },
    en: {
        translation: en,
    },
    ja: {
        translation: ja,
    },
};

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: "vi",
        debug: process.env.NODE_ENV === "development",

        interpolation: {
            escapeValue: false, // React already does escaping
        },

        // Same source as the Redux language slice and the Accept-Language header
        // (localStorage 'language', default vi), so pages without the
        // LanguageSwitcher (login) show the language the API answers in
        detection: {
            order: ["localStorage"],
            lookupLocalStorage: "language",
            caches: [],
        },
    });

export default i18n;
