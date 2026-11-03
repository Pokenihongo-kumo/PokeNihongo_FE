import { useEffect, useState } from "react";
import { Button } from "@ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@ui/Dialog";
import { Input } from "@ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";
import { Switch } from "@ui/Switch";
import { Separator } from "@ui/Separator";
import { Card } from "@ui/Card";
import MultilingualInput from "@ui/MultilingualInput";
import CustomDatePicker from "@ui/DatePicker";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { GACHA } from "@constants/gacha";
import { IGachaBannerEntity } from "@models/gacha/entity";
import { createCreateGachaSchema, ICreateGachaRequest } from "@models/gacha/request";
import { useUpdateGachaBanner } from "@hooks/useGacha";

interface EditGachaDialogProps {
    isOpen: boolean;
    onClose: () => void;
    bannerData: IGachaBannerEntity;
}

const EditGachaDialog = ({ isOpen, onClose, bannerData }: EditGachaDialogProps) => {
    /**
     * Define variables
     */
    const { t } = useTranslation();
    //------------------------End------------------------//

    /**
     * Handle Form
     * @returns useForm to handle form
     */
    const {
        control,
        handleSubmit,
        register,
        formState: { errors },
        reset,
        setValue,
        watch,
        clearErrors,
    } = useForm<ICreateGachaRequest>({
        resolver: zodResolver(createCreateGachaSchema(t)),
        defaultValues: {
            startDate: "",
            endDate: "",
            status: GACHA.GachaBannerStatus.PREVIEW,
            enablePrecreate: true,
            precreateBeforeEndDays: 2,
            isRandomItemAgain: true,
            hardPity5Star: 90,
            costRoll: 160,
            amount5Star: 1,
            amount4Star: 3,
            amount3Star: 6,
            amount2Star: 8,
            amount1Star: 10,
            nameTranslations: [
                { key: "en", value: "" },
                { key: "ja", value: "" },
                { key: "vi", value: "" },
            ],
        },
    });

    const { fields: nameFields } = useFieldArray({ control, name: "nameTranslations" });
    //------------------------End------------------------//

    /**
     * Handle Date Picker
     * Handle Reset Form
     */
    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

    const toIsoDateString = (date: Date | null) => (date ? new Date(date).toISOString() : "");

    useEffect(() => {
        if (isOpen && bannerData) {
            const startDate = new Date(bannerData.startDate);
            const endDate = new Date(bannerData.endDate);

            setSelectedStartDate(startDate);
            setSelectedEndDate(endDate);

            // Map translations ensuring en, ja, vi order
            const translationMap: Record<string, string> = {};
            (bannerData.nameTranslations || []).forEach((tr) => {
                translationMap[tr.key] = tr.value;
            });

            reset({
                startDate: toIsoDateString(startDate),
                endDate: toIsoDateString(endDate),
                status: bannerData.status,
                enablePrecreate: bannerData.enablePrecreate,
                precreateBeforeEndDays: bannerData.precreateBeforeEndDays,
                isRandomItemAgain: bannerData.isRandomItemAgain,
                hardPity5Star: bannerData.hardPity5Star,
                costRoll: bannerData.costRoll,
                amount5Star: bannerData.amount5Star,
                amount4Star: bannerData.amount4Star,
                amount3Star: bannerData.amount3Star,
                amount2Star: bannerData.amount2Star,
                amount1Star: bannerData.amount1Star,
                nameTranslations: [
                    { key: "en", value: translationMap["en"] || "" },
                    { key: "ja", value: translationMap["ja"] || "" },
                    { key: "vi", value: translationMap["vi"] || "" },
                ],
            });
        }
    }, [isOpen, bannerData, reset]);
    //------------------------End------------------------//

    /**
     * Handle Update Gacha Banner
     */
    const updateGachaBannerMutation = useUpdateGachaBanner();

    const handleFormSubmit = async (data: ICreateGachaRequest) => {
        try {
            await updateGachaBannerMutation.mutateAsync({ id: bannerData.id, data });
            onClose();
        } catch (error) {
            // handled in hook
        }
    };
    //------------------------End------------------------//

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >
            <DialogContent className="bg-white border-border max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-foreground">{t("configGacha.editBannerTitle")}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-4" noValidate>
                    {/* Multilingual Input */}
                    <MultilingualInput
                        label={t("configGacha.bannerName")}
                        fields={nameFields.map((field) => ({
                            id: field.id,
                            key: field.key,
                        }))}
                        register={register}
                        errors={errors.nameTranslations}
                        placeholderKey="configGacha.bannerNamePlaceholder"
                        requiredKey="configGacha.nameRequiredVi"
                        fieldName="name"
                    />

                    {/* Date Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label htmlFor="startDate" className="text-sm font-medium text-foreground">
                                {t("configGacha.startDate")}
                            </label>
                            <div>
                                <CustomDatePicker
                                    value={selectedStartDate}
                                    onChange={(date) => {
                                        setSelectedStartDate(date);
                                        if (date) {
                                            setValue("startDate", toIsoDateString(date));
                                            clearErrors("startDate");

                                            const endDate = new Date(date);
                                            endDate.setDate(endDate.getDate() + 7);
                                            if (!selectedEndDate || endDate > selectedEndDate) {
                                                setSelectedEndDate(endDate);
                                                setValue("endDate", toIsoDateString(endDate));
                                                clearErrors("endDate");
                                            }
                                        }
                                    }}
                                    placeholder={t("configGacha.startDate")}
                                    hasError={!!errors.startDate}
                                    dayPickerProps={{
                                        disabled: { before: new Date() },
                                    }}
                                />
                            </div>
                            <input type="hidden" {...register("startDate")} />
                            {errors.startDate && (
                                <p className={`text-xs mt-1 ${errors.startDate ? "text-error" : "text-foreground"}`}>
                                    {errors.startDate.message as string}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="endDate" className="text-sm font-medium text-foreground">
                                {t("configGacha.endDate")}
                            </label>
                            <div>
                                <CustomDatePicker
                                    value={selectedEndDate}
                                    onChange={(date) => {
                                        setSelectedEndDate(date);
                                        if (date) {
                                            setValue("endDate", toIsoDateString(date));
                                            clearErrors("endDate");
                                        }
                                    }}
                                    placeholder={t("configGacha.endDate")}
                                    hasError={!!errors.endDate}
                                    dayPickerProps={{
                                        disabled: selectedStartDate
                                            ? { before: selectedStartDate }
                                            : { before: new Date() },
                                    }}
                                />
                            </div>
                            <input type="hidden" {...register("endDate")} />
                            {errors.endDate && (
                                <p className={`text-xs mt-1 ${errors.endDate ? "text-error" : "text-foreground"}`}>
                                    {errors.endDate.message as string}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Core Configs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label htmlFor="costRoll" className="text-sm font-medium text-foreground">
                                {t("configGacha.costRoll")}
                            </label>
                            <Controller
                                name="costRoll"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        id="costRoll"
                                        type="number"
                                        value={field.value}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                        variant={errors.costRoll ? "destructive" : "default"}
                                        min={1}
                                        max={1_000_000}
                                    />
                                )}
                            />
                            {errors.costRoll && (
                                <p className={`text-xs mt-1 ${errors.costRoll ? "text-error" : "text-foreground"}`}>
                                    {errors.costRoll.message as string}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="hardPity5Star" className="text-sm font-medium text-foreground">
                                {t("configGacha.hardPity")}
                            </label>
                            <Controller
                                name="hardPity5Star"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        id="hardPity5Star"
                                        type="number"
                                        value={field.value}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                        variant={errors.hardPity5Star ? "destructive" : "default"}
                                        min={1}
                                        max={300}
                                    />
                                )}
                            />
                            {errors.hardPity5Star && (
                                <p
                                    className={`text-xs mt-1 ${errors.hardPity5Star ? "text-error" : "text-foreground"}`}
                                >
                                    {errors.hardPity5Star.message as string}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Amounts */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <label htmlFor="amount5Star" className="text-sm font-medium text-foreground">
                                {t("configGacha.amount5Star")}
                            </label>
                            <Controller
                                name="amount5Star"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        id="amount5Star"
                                        type="number"
                                        value={field.value}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                )}
                            />
                            {errors.amount5Star && (
                                <p className={`text-xs mt-1 ${errors.amount5Star ? "text-error" : "text-foreground"}`}>
                                    {errors.amount5Star.message as string}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="amount4Star" className="text-sm font-medium text-foreground">
                                {t("configGacha.amount4Star")}
                            </label>
                            <Controller
                                name="amount4Star"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        id="amount4Star"
                                        type="number"
                                        value={field.value}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                )}
                            />
                            {errors.amount4Star && (
                                <p className={`text-xs mt-1 ${errors.amount4Star ? "text-error" : "text-foreground"}`}>
                                    {errors.amount4Star.message as string}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="amount3Star" className="text-sm font-medium text-foreground">
                                {t("configGacha.amount3Star")}
                            </label>
                            <Controller
                                name="amount3Star"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        id="amount3Star"
                                        type="number"
                                        value={field.value}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                )}
                            />
                            {errors.amount3Star && (
                                <p className={`text-xs mt-1 ${errors.amount3Star ? "text-error" : "text-foreground"}`}>
                                    {errors.amount3Star.message as string}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="amount2Star" className="text-sm font-medium text-foreground">
                                {t("configGacha.amount2Star")}
                            </label>
                            <Controller
                                name="amount2Star"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        id="amount2Star"
                                        type="number"
                                        value={field.value}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                )}
                            />
                            {errors.amount2Star && (
                                <p className={`text-xs mt-1 ${errors.amount2Star ? "text-error" : "text-foreground"}`}>
                                    {errors.amount2Star.message as string}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="amount1Star" className="text-sm font-medium text-foreground">
                                {t("configGacha.amount1Star")}
                            </label>
                            <Controller
                                name="amount1Star"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        id="amount1Star"
                                        type="number"
                                        value={field.value}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                )}
                            />
                            {errors.amount1Star && (
                                <p className={`text-xs mt-1 ${errors.amount1Star ? "text-error" : "text-foreground"}`}>
                                    {errors.amount1Star.message as string}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-1.5">
                        <label htmlFor="status" className="text-sm font-medium text-foreground">
                            {t("configGacha.status")}
                        </label>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="bg-background border-input">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border">
                                        <SelectItem value={GACHA.GachaBannerStatus.PREVIEW}>
                                            {t("configGacha.preview")}
                                        </SelectItem>
                                        <SelectItem value={GACHA.GachaBannerStatus.ACTIVE}>
                                            {t("common.active")}
                                        </SelectItem>
                                        <SelectItem value={GACHA.GachaBannerStatus.INACTIVE}>
                                            {t("common.inactive")}
                                        </SelectItem>
                                        <SelectItem value={GACHA.GachaBannerStatus.EXPIRED}>
                                            {t("configGacha.expired")}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    {/* Separator */}
                    <Separator className="my-6" />

                    {/* Auto Pre-create Settings Section */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-semibold text-foreground mb-1">
                                {t("configGacha.autoPrecreateSettings")}
                            </h3>
                            <p className="text-xs text-muted-foreground italic">
                                {t("configGacha.autoPrecreateSettingsDescription")}
                            </p>
                        </div>

                        <Card className="bg-muted/30 p-4 space-y-4">
                            {/* Enable Precreate */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <label htmlFor="enablePrecreate" className="text-sm font-medium text-foreground">
                                        {t("configGacha.enablePrecreate")}
                                    </label>
                                    <p className="text-xs text-muted-foreground mt-0.5 italic">
                                        {t("configGacha.enablePrecreateDescription")}
                                    </p>
                                </div>
                                <Controller
                                    name="enablePrecreate"
                                    control={control}
                                    render={({ field }) => (
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    )}
                                />
                            </div>

                            {/* Precreate Before End Days */}
                            {watch("enablePrecreate") && (
                                <div className="space-y-1.5 pt-2 border-t border-border">
                                    <label
                                        htmlFor="precreateBeforeEndDays"
                                        className="text-sm font-medium text-foreground"
                                    >
                                        {t("configGacha.precreateBeforeEndDays")}
                                    </label>
                                    <Controller
                                        name="precreateBeforeEndDays"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <Input
                                                    id="precreateBeforeEndDays"
                                                    type="number"
                                                    value={field.value}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                    variant={errors.precreateBeforeEndDays ? "destructive" : "default"}
                                                    min={1}
                                                    max={90}
                                                />
                                                {errors.precreateBeforeEndDays && (
                                                    <p
                                                        className={`text-xs mt-1 ${errors.precreateBeforeEndDays ? "text-error" : "text-foreground"}`}
                                                    >
                                                        {errors.precreateBeforeEndDays.message as string}
                                                    </p>
                                                )}
                                                <p className="text-xs text-muted-foreground italic">
                                                    {t("configGacha.precreateBeforeEndDaysDescription")}
                                                </p>
                                            </>
                                        )}
                                    />
                                </div>
                            )}

                            {/* Is Random Item Again */}
                            {watch("enablePrecreate") && (
                                <div className="flex items-center justify-between pt-2 border-t border-border">
                                    <div>
                                        <label
                                            htmlFor="isRandomItemAgain"
                                            className="text-sm font-medium text-foreground"
                                        >
                                            {t("configGacha.isRandomItemAgain")}
                                        </label>
                                        <p className="text-xs text-muted-foreground mt-0.5 italic">
                                            {t("configGacha.isRandomItemAgainDescription")}
                                        </p>
                                    </div>
                                    <Controller
                                        name="isRandomItemAgain"
                                        control={control}
                                        render={({ field }) => (
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        )}
                                    />
                                </div>
                            )}
                        </Card>
                    </div>

                    <DialogFooter className="mt-6 pt-4 border-t border-border">
                        <Button type="button" variant="outline" onClick={onClose}>
                            {t("common.cancel")}
                        </Button>
                        <Button
                            type="submit"
                            disabled={updateGachaBannerMutation.isPending}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            {updateGachaBannerMutation.isPending ? t("common.saving") : t("common.save")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditGachaDialog;
