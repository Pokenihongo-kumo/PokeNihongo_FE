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
import { useUpdateShopBanner } from "@hooks/useShop";
import { createCreateShopBannerSchema, ICreateShopBannerRequest } from "@models/shop/request";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { SHOP } from "@constants/shop";
import { IShopBannerSchema } from "@models/shop/entity";

interface EditShopBannerDialogProps {
    isOpen: boolean;
    onClose: () => void;
    bannerData: IShopBannerSchema;
}

const EditShopBannerDialog = ({ isOpen, onClose, bannerData }: EditShopBannerDialogProps) => {
    const { t } = useTranslation();
    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

    const updateShopBannerMutation = useUpdateShopBanner();
    const {
        control,
        handleSubmit,
        register,
        formState: { errors },
        reset,
        setValue,
        watch,
        clearErrors,
    } = useForm<ICreateShopBannerRequest>({
        resolver: zodResolver(createCreateShopBannerSchema(t)),
        defaultValues: {
            startDate: "",
            endDate: "",
            min: 4,
            max: 8,
            status: SHOP.ShopBannerStatus.PREVIEW,
            enablePrecreate: true,
            precreateBeforeEndDays: 2,
            isRandomItemAgain: true,
            nameTranslations: [
                { key: "en" as const, value: "" },
                { key: "ja" as const, value: "" },
                { key: "vi" as const, value: "" },
            ],
        },
    });

    const { fields: nameFields } = useFieldArray({ control, name: "nameTranslations" });

    const formatDateForForm = (date: Date | null) => {
        if (!date) return "";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        if (isOpen && bannerData) {
            const startDate = new Date(bannerData.startDate);
            const endDate = new Date(bannerData.endDate);

            setSelectedStartDate(startDate);
            setSelectedEndDate(endDate);

            reset({
                startDate: formatDateForForm(startDate),
                endDate: formatDateForForm(endDate),
                min: bannerData.min,
                max: bannerData.max,
                status: bannerData.status,
                enablePrecreate: bannerData.enablePrecreate,
                precreateBeforeEndDays: bannerData.precreateBeforeEndDays,
                isRandomItemAgain: bannerData.isRandomItemAgain,
                nameTranslations: bannerData.nameTranslations.map((t) => ({
                    key: t.key as "en" | "ja" | "vi",
                    value: t.value,
                })),
            });
        }
    }, [isOpen, bannerData, reset]);

    const handleFormSubmit = async (data: ICreateShopBannerRequest) => {
        try {
            await updateShopBannerMutation.mutateAsync({ id: bannerData.id, data });
            onClose();
        } catch (error) {
            console.error("Error updating shop banner:", error);
        }
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >
            <DialogContent className="bg-white border-border max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-foreground">{t("configShop.editBannerTitle")}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-4" noValidate>
                    {/* Multilingual Input */}
                    <MultilingualInput
                        label={t("configShop.bannerName")}
                        fields={nameFields.map((field) => ({
                            id: field.id,
                            key: field.key,
                        }))}
                        register={register}
                        errors={errors.nameTranslations}
                        placeholderKey="configShop.bannerNamePlaceholder"
                        requiredKey="configShop.nameRequiredVi"
                        fieldName="name"
                    />

                    {/* Date Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label htmlFor="startDate" className="text-sm font-medium text-foreground">
                                {t("configShop.startDate")}
                            </label>
                            <div>
                                <CustomDatePicker
                                    value={selectedStartDate}
                                    onChange={(date) => {
                                        setSelectedStartDate(date);
                                        if (date) {
                                            const formattedDate = formatDateForForm(date);
                                            setValue("startDate", formattedDate);
                                            clearErrors("startDate");

                                            const endDate = new Date(date);
                                            endDate.setDate(endDate.getDate() + 7);
                                            if (!selectedEndDate || endDate > selectedEndDate) {
                                                setSelectedEndDate(endDate);
                                                setValue("endDate", formatDateForForm(endDate));
                                                clearErrors("endDate");
                                            }
                                        }
                                    }}
                                    placeholder={t("configShop.startDate")}
                                    hasError={!!errors.startDate}
                                    dayPickerProps={{
                                        disabled: { before: new Date() },
                                    }}
                                />
                            </div>
                            <input type="hidden" {...register("startDate")} />
                            {errors.startDate && (
                                <p className="text-xs mt-1" style={{ color: "var(--color-error)" }}>
                                    {errors.startDate.message as string}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="endDate" className="text-sm font-medium text-foreground">
                                {t("configShop.endDate")}
                            </label>
                            <div>
                                <CustomDatePicker
                                    value={selectedEndDate}
                                    onChange={(date) => {
                                        setSelectedEndDate(date);
                                        if (date) {
                                            setValue("endDate", formatDateForForm(date));
                                            clearErrors("endDate");
                                        }
                                    }}
                                    placeholder={t("configShop.endDate")}
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
                                <p className="text-xs mt-1" style={{ color: "var(--color-error)" }}>
                                    {errors.endDate.message as string}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Min Max */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label htmlFor="min" className="text-sm font-medium text-foreground">
                                {t("configShop.minQuantity")}
                            </label>
                            <Controller
                                name="min"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Input
                                            id="min"
                                            type="number"
                                            value={field.value}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            variant={errors.min ? "destructive" : "default"}
                                            min={4}
                                            max={7}
                                        />
                                        {errors.min && (
                                            <p className="text-xs mt-1" style={{ color: "var(--color-error)" }}>
                                                {errors.min.message as string}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="max" className="text-sm font-medium text-foreground">
                                {t("configShop.maxQuantity")}
                            </label>
                            <Controller
                                name="max"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Input
                                            id="max"
                                            type="number"
                                            value={field.value}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            variant={errors.max ? "destructive" : "default"}
                                            min={5}
                                            max={8}
                                        />
                                        {errors.max && (
                                            <p className="text-xs mt-1" style={{ color: "var(--color-error)" }}>
                                                {errors.max.message as string}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-1.5">
                        <label htmlFor="status" className="text-sm font-medium text-foreground">
                            {t("configShop.status")}
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
                                        <SelectItem value={SHOP.ShopBannerStatus.PREVIEW}>
                                            {t("configShop.preview")}
                                        </SelectItem>
                                        <SelectItem value={SHOP.ShopBannerStatus.ACTIVE}>
                                            {t("common.active")}
                                        </SelectItem>
                                        <SelectItem value={SHOP.ShopBannerStatus.INACTIVE}>
                                            {t("common.inactive")}
                                        </SelectItem>
                                        <SelectItem value={SHOP.ShopBannerStatus.EXPIRED}>
                                            {t("configShop.expired")}
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
                                {t("configShop.autoPrecreateSettings")}
                            </h3>
                            <p className="text-xs text-muted-foreground italic">
                                {t("configShop.autoPrecreateSettingsDescription")}
                            </p>
                        </div>

                        <Card className="bg-muted/30 p-4 space-y-4">
                            {/* Enable Precreate */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <label htmlFor="enablePrecreate" className="text-sm font-medium text-foreground">
                                        {t("configShop.enablePrecreate")}
                                    </label>
                                    <p className="text-xs text-muted-foreground mt-0.5 italic">
                                        {t("configShop.enablePrecreateDescription")}
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
                                        {t("configShop.precreateBeforeEndDays")}
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
                                                    max={7}
                                                />
                                                {errors.precreateBeforeEndDays && (
                                                    <p className="text-xs mt-1" style={{ color: "var(--color-error)" }}>
                                                        {errors.precreateBeforeEndDays.message as string}
                                                    </p>
                                                )}
                                                <p className="text-xs text-muted-foreground italic">
                                                    {t("configShop.precreateBeforeEndDaysDescription")}
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
                                            {t("configShop.isRandomItemAgain")}
                                        </label>
                                        <p className="text-xs text-muted-foreground mt-0.5 italic">
                                            {t("configShop.isRandomItemAgainDescription")}
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
                            disabled={updateShopBannerMutation.isPending}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            {updateShopBannerMutation.isPending ? t("common.saving") : t("common.save")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditShopBannerDialog;
