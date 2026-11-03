import { Button } from "@ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@ui/Dialog";
import { Input } from "@ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";
import { Switch } from "@ui/Switch";
import MultilingualInput from "@ui/MultilingualInput";
import { useEffect } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { cn } from "@utils/CN";
import { useTranslation } from "react-i18next";
import { useCreateDailyRequest } from "@hooks/useDailyRequest";
import { ICreateDailyRequestRequest } from "@models/dailyRequest/request";
import { toast } from "react-toastify";
import { DAILY_REQUEST } from "@constants/dailyRequest";
import { useGetRewardList } from "@hooks/useReward";
import { IRewardEntityType } from "@models/reward/entity";

interface CreateDailyQuestDialogProps {
    isOpen: boolean;
    onClose: () => void;
    mockRewards: Array<{ id: number; name: string }>;
    editingQuest?: any | null;
}

const CreateDailyQuestDialog = ({ isOpen, onClose, mockRewards, editingQuest }: CreateDailyQuestDialogProps) => {
    const { t } = useTranslation();

    /**
     * Create daily request
     */
    const createDailyRequestMutation = useCreateDailyRequest();
    //------------------------End------------------------//

    /**
     * Get reward list
     */
    const { data: rewardList } = useGetRewardList();
    const rewards = rewardList?.results || [];
    //------------------------End------------------------//

    /**
     * Form hook
     */
    const {
        control,
        handleSubmit,
        register,
        formState: { errors },
        watch,
        reset,
    } = useForm<ICreateDailyRequestRequest>({
        defaultValues: {
            dailyRequestType: "DAILY_LOGIN",
            conditionValue: 1,
            rewardId: mockRewards.length > 0 ? mockRewards[0].id : 1,
            isActive: true,
            isStreak: false,
            nameTranslations: [
                { key: "en" as const, value: "" },
                { key: "ja" as const, value: "" },
                { key: "vi" as const, value: "" },
            ],
            descriptionTranslations: [
                { key: "en" as const, value: "" },
                { key: "ja" as const, value: "" },
                { key: "vi" as const, value: "" },
            ],
        },
    });
    //------------------------End------------------------//

    /**
     * Field arrays
     */
    const { fields: nameFields } = useFieldArray({ control, name: "nameTranslations" });
    const { fields: descriptionFields } = useFieldArray({ control, name: "descriptionTranslations" });
    //------------------------End------------------------//

    /**
     * Watch form
     */
    const isActive = watch("isActive");

    /**
     * Reset form when editingQuest changes
     */
    useEffect(() => {
        if (isOpen) {
            if (editingQuest) {
                reset({
                    dailyRequestType: editingQuest.dailyRequestType || "DAILY_LOGIN",
                    conditionValue: editingQuest.conditionValue || 1,
                    rewardId: editingQuest.rewardId || (mockRewards.length > 0 ? mockRewards[0].id : 1),
                    isActive: editingQuest.isActive ?? true,
                    isStreak: editingQuest.isStreak ?? false,
                    nameTranslations: [
                        {
                            key: "en" as const,
                            value: editingQuest.nameTranslations?.find((t: any) => t.key === "en")?.value || "",
                        },
                        {
                            key: "ja" as const,
                            value: editingQuest.nameTranslations?.find((t: any) => t.key === "ja")?.value || "",
                        },
                        {
                            key: "vi" as const,
                            value: editingQuest.nameTranslations?.find((t: any) => t.key === "vi")?.value || "",
                        },
                    ],
                    descriptionTranslations: [
                        {
                            key: "en" as const,
                            value: editingQuest.descriptionTranslations?.find((t: any) => t.key === "en")?.value || "",
                        },
                        {
                            key: "ja" as const,
                            value: editingQuest.descriptionTranslations?.find((t: any) => t.key === "ja")?.value || "",
                        },
                        {
                            key: "vi" as const,
                            value: editingQuest.descriptionTranslations?.find((t: any) => t.key === "vi")?.value || "",
                        },
                    ],
                });
            } else {
                reset({
                    dailyRequestType: "DAILY_LOGIN",
                    conditionValue: 1,
                    rewardId: mockRewards.length > 0 ? mockRewards[0].id : 1,
                    isActive: true,
                    isStreak: false,
                    nameTranslations: [
                        { key: "en" as const, value: "" },
                        { key: "ja" as const, value: "" },
                        { key: "vi" as const, value: "" },
                    ],
                    descriptionTranslations: [
                        { key: "en" as const, value: "" },
                        { key: "ja" as const, value: "" },
                        { key: "vi" as const, value: "" },
                    ],
                });
            }
        }
    }, [isOpen, editingQuest, mockRewards, reset]);
    //------------------------End------------------------//

    /**
     * Handle form submit
     * @param data ICreateDailyRequestRequest
     */
    const handleFormSubmit = async (data: ICreateDailyRequestRequest) => {
        try {
            const response = await createDailyRequestMutation.mutateAsync(data);
            toast.success(response.data?.message || t("dailyQuest.createSuccess"));
            onClose();
        } catch (error: any) {
            console.error("Error creating daily quest:", error);
            toast.error(error.response?.data?.message || t("dailyQuest.createError"));
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
            <DialogContent className="bg-white border-border max-w-2xl sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-foreground">
                        {editingQuest ? t("dailyQuest.editTitle") : t("dailyQuest.addTitle")}
                    </DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(handleFormSubmit)}
                    className="space-y-4 py-4 max-h-[65vh] overflow-y-auto px-1 sm:px-6"
                    noValidate
                >
                    {/* Loại điều kiện & Giá trị */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Select Loại điều kiện */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="dailyRequestType"
                                className={cn(
                                    "text-sm font-medium text-foreground",
                                    errors.dailyRequestType && "text-destructive",
                                )}
                            >
                                {t("dailyQuest.conditionTypeLabel")}
                            </label>
                            <Controller
                                name="dailyRequestType"
                                control={control}
                                rules={{ required: t("dailyQuest.conditionRequired") }}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger
                                            id="dailyRequestType"
                                            className={cn(
                                                "w-full bg-background border-input text-foreground",
                                                errors.dailyRequestType &&
                                                    "border-destructive focus-visible:ring-destructive",
                                            )}
                                        >
                                            <SelectValue placeholder={t("dailyQuest.selectCondition")} />
                                        </SelectTrigger>
                                        <SelectContent className="bg-card border-border">
                                            {Object.values(DAILY_REQUEST.DAILY_REQUEST_TYPE).map((conditionType) => (
                                                <SelectItem key={conditionType.value} value={conditionType.value}>
                                                    {conditionType.label} ({conditionType.value})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.dailyRequestType && (
                                <p className="text-xs text-destructive mt-1">{errors.dailyRequestType.message}</p>
                            )}
                        </div>
                        {/* Giá trị điều kiện */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="conditionValue"
                                className={cn(
                                    "text-sm font-medium text-foreground",
                                    errors.conditionValue && "text-destructive",
                                )}
                            >
                                {t("dailyQuest.conditionValueLabel")}
                            </label>
                            <Input
                                id="conditionValue"
                                type="number"
                                placeholder={t("dailyQuest.conditionValuePlaceholder")}
                                className={cn(
                                    "bg-background border-input",
                                    errors.conditionValue && "border-destructive focus-visible:ring-destructive",
                                )}
                                {...register("conditionValue", {
                                    required: t("dailyQuest.valueRequired"),
                                    valueAsNumber: true,
                                    min: { value: 1, message: t("dailyQuest.valueMin") },
                                })}
                            />
                            {errors.conditionValue && (
                                <p className="text-xs text-destructive mt-1">{errors.conditionValue.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Phần thưởng */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="rewardId"
                            className={cn("text-sm font-medium text-foreground", errors.rewardId && "text-destructive")}
                        >
                            {t("dailyQuest.rewardLabel")}
                        </label>
                        <Controller
                            name="rewardId"
                            control={control}
                            rules={{ required: t("dailyQuest.rewardRequired") }}
                            render={({ field }) => (
                                <Select
                                    onValueChange={(value) => field.onChange(Number(value))}
                                    value={field.value?.toString()}
                                >
                                    <SelectTrigger
                                        id="rewardId"
                                        className={cn(
                                            "bg-background border-input",
                                            errors.rewardId && "border-error focus-visible:ring-error",
                                        )}
                                    >
                                        <SelectValue placeholder={t("dailyQuest.selectReward")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {rewards.map((reward: IRewardEntityType) => (
                                            <SelectItem key={reward.id} value={reward.id.toString()}>
                                                {reward.nameTranslation}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.rewardId && <p className="text-xs text-destructive mt-1">{errors.rewardId.message}</p>}
                    </div>

                    {/* Tên nhiệm vụ */}
                    <MultilingualInput
                        label={t("dailyQuest.nameLabel")}
                        fields={nameFields}
                        register={register}
                        errors={errors.nameTranslations as Record<string, string>}
                        placeholderKey="dailyQuest.taskNamePlaceholder"
                        requiredKey="dailyQuest.nameRequiredVi"
                        fieldName="name"
                    />

                    {/* Mô tả nhiệm vụ */}
                    <MultilingualInput
                        label={t("dailyQuest.descriptionLabel")}
                        fields={descriptionFields}
                        register={register}
                        errors={errors.descriptionTranslations}
                        placeholderKey="dailyQuest.descriptionPlaceholder"
                        requiredKey="dailyQuest.descriptionRequiredVi"
                        isTextarea={true}
                        fieldName="description"
                    />

                    {/* Kích hoạt & Streak */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                            <Controller
                                name="isActive"
                                control={control}
                                render={({ field }) => (
                                    <Switch id="form-isActive" checked={field.value} onCheckedChange={field.onChange} />
                                )}
                            />
                            <label
                                htmlFor="form-isActive"
                                className="text-sm font-medium text-foreground cursor-pointer"
                            >
                                {t("dailyQuest.isActive")} (
                                {isActive ? t("dailyQuest.isActiveOn") : t("dailyQuest.isActiveOff")})
                            </label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Controller
                                name="isStreak"
                                control={control}
                                render={({ field }) => (
                                    <Switch id="form-isStreak" checked={field.value} onCheckedChange={field.onChange} />
                                )}
                            />
                            <label
                                htmlFor="form-isStreak"
                                className="text-sm font-medium text-foreground cursor-pointer"
                            >
                                {t("dailyQuest.isStreak")}
                            </label>
                        </div>
                    </div>

                    {/* Nút Submit/Cancel */}
                    <DialogFooter className="mt-6 pt-4 border-t border-border">
                        <Button type="button" variant="outline" onClick={onClose}>
                            {t("common.cancel")}
                        </Button>
                        <Button
                            type="submit"
                            disabled={createDailyRequestMutation.isPending}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            {createDailyRequestMutation.isPending ? t("common.loading") : t("common.add")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateDailyQuestDialog;
