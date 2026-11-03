import z from "zod";
import { TranslationRequest } from "@models/common/request";
import { GACHA } from "@constants/gacha";

//-------------------------------------------Gacha Banner Request-------------------------------------------//
/**
 * Create Gacha Request Schema (i18n)
 */
export const createCreateGachaSchema = (t: (key: string, opts?: any) => string) =>
    z.object({
        startDate: z.string().min(1, t("configGacha.startDateRequired")),
        endDate: z.string().min(1, t("configGacha.endDateRequired")),
        status: z.enum(["PREVIEW", "EXPIRED", "INACTIVE", "ACTIVE"]),
        hardPity5Star: z
            .number()
            .min(50, t("configGacha.hardPity5StarMin", { min: 50 } as any))
            .max(300, t("configGacha.hardPity5StarMax", { max: 300 } as any)),
        enablePrecreate: z.boolean(),
        precreateBeforeEndDays: z
            .number()
            .min(1, t("configGacha.precreateBeforeEndDaysRequired"))
            .max(90, t("configGacha.precreateBeforeEndDaysMax", { max: 90 } as any)),
        isRandomItemAgain: z.boolean(),
        costRoll: z
            .number()
            .min(1, t("configGacha.costRollRequired"))
            .max(1_000_000, t("configGacha.costRollMax", { max: "1,000,000" } as any)),
        amount5Star: z
            .number()
            .min(0, t("configGacha.amount5StarMin", { min: 0 } as any))
            .max(5, t("configGacha.amount5StarMax", { max: 5 } as any)),
        amount4Star: z
            .number()
            .min(1, t("configGacha.amount4StarMin", { min: 1 } as any))
            .max(20, t("configGacha.amount4StarMax", { max: 20 } as any)),
        amount3Star: z
            .number()
            .min(1, t("configGacha.amount3StarMin", { min: 1 } as any))
            .max(400, t("configGacha.amount3StarMax", { max: 400 } as any)),
        amount2Star: z
            .number()
            .min(1, t("configGacha.amount2StarMin", { min: 1 } as any))
            .max(500, t("configGacha.amount2StarMax", { max: 500 } as any)),
        amount1Star: z
            .number()
            .min(1, t("configGacha.amount1StarMin", { min: 1 } as any))
            .max(200, t("configGacha.amount1StarMax", { max: 200 } as any)),
        nameTranslations: z.array(TranslationRequest).superRefine((translations, ctx) => {
            translations.forEach((translation, index) => {
                if (!translation.value || translation.value.trim().length === 0) {
                    const key = translation.key;
                    const errorKey =
                        key === "vi"
                            ? "configGacha.nameRequiredVi"
                            : key === "en"
                              ? "configGacha.nameRequiredEn"
                              : "configGacha.nameRequiredJa";
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: t(errorKey),
                        path: [index, "value"],
                    });
                }
            });
        }),
    });
export type ICreateGachaRequest = z.infer<ReturnType<typeof createCreateGachaSchema>>;
//-------------------------------------------End-------------------------------------------//

//-------------------------------------------Gacha Item Request-------------------------------------------//
/**
 * Create Gacha Item Request Schema
 */
export const createCreateGachaItemListRequest = (t: (key: string, opts?: any) => string) =>
    z.object({
        bannerId: z.number().min(1, t("configGacha.gachaBannerIdRequired", { min: 1 } as any)),
        items: z.array(
            z.object({
                starType: z.enum(GACHA.GachaItemRateStarType),
                pokemons: z.array(z.number()),
            }),
        ),
    });
export type ICreateGachaItemListRequest = z.infer<ReturnType<typeof createCreateGachaItemListRequest>>;
//-------------------------------------------End-------------------------------------------//
