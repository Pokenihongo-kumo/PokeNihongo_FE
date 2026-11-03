import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Button } from "@ui/Button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@ui/DropdownMenu";
import { Globe } from "lucide-react";
import { setLanguage } from "@redux/features/language/slice";
import { selectCurrentLanguage } from "@redux/features/language/selector";
import { AppDispatch } from "@redux/store/store";

const LanguageSwitcher: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const currentLanguage = useSelector(selectCurrentLanguage);
    const { t, i18n } = useTranslation();

    // Sync i18n with Redux state
    useEffect(() => {
        i18n.changeLanguage(currentLanguage);
    }, [currentLanguage, i18n]);

    const handleLanguageChange = (language: "vi" | "en" | "ja") => {
        dispatch(setLanguage(language));
    };

    const languages = [
        { code: "vi" as const, name: t("language.vi"), flag: "🇻🇳" },
        { code: "en" as const, name: t("language.en"), flag: "🇺🇸" },
        { code: "ja" as const, name: t("language.ja"), flag: "🇯🇵" },
    ];

    const currentLang = languages.find((lang) => lang.code === currentLanguage);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Globe className="h-4 w-4" />
                    {currentLang?.flag} {currentLang?.name}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {languages.map((language) => (
                    <DropdownMenuItem
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className={`cursor-pointer ${currentLanguage === language.code ? "bg-accent" : ""}`}
                    >
                        <span className="mr-2">{language.flag}</span>
                        {language.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default LanguageSwitcher;
