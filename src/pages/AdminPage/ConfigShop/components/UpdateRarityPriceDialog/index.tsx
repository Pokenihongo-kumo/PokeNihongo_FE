import { useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@ui/Dialog";
import { Input } from "@ui/Input";
import { Checkbox } from "@ui/Checkbox";
import { Separator } from "@ui/Separator";
import { Skeleton } from "@ui/Skeleton";
import { useShopRarityPrice, useUpdateShopRarityPrice } from "@hooks/useShopRarityPrice";
import { useTranslation } from "react-i18next";
import { IShopRarityPriceEntityType } from "@models/shopRarityPrice/entity";
import { RarityBadge } from "@atoms/BadgeRarity";
import { AlertCircle, Sparkles } from "lucide-react";
import { IUpdateShopRarityPriceRequest, UpdateShopRarityPriceRequestSchema } from "@models/shopRarityPrice/request";

interface UpdateRarityPriceDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const UpdateRarityPriceDialog = ({ isOpen, onClose }: UpdateRarityPriceDialogProps) => {
    const { t } = useTranslation();
    const { data: rarityPrices, isLoading } = useShopRarityPrice();
    const updateMutation = useUpdateShopRarityPrice();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<IUpdateShopRarityPriceRequest>({
        resolver: zodResolver(UpdateShopRarityPriceRequestSchema),
        defaultValues: {
            rarity: "COMMON",
            price: 0,
            isChangeAllShopPreview: false,
        },
    });

    const formValues = useWatch({ control });

    // Initialize form with data
    useEffect(() => {
        if (rarityPrices?.results && isOpen) {
            const defaultValues: any = {
                isChangeAllShopPreview: false,
            };
            rarityPrices.results.forEach((item: IShopRarityPriceEntityType) => {
                defaultValues[item.rarity] = item.price.toString();
            });
            reset(defaultValues);
        }
    }, [rarityPrices, isOpen, reset, t]);

    // Handle numeric input only
    const handleNumericChange = (onChange: any, value: string) => {
        const numericValue = value === "" ? "" : value.replace(/[^\d]/g, "");
        onChange(numericValue);
    };

    const onSubmit = async (data: IUpdateShopRarityPriceRequest) => {
        if (!rarityPrices?.results) return;

        try {
            // Update each rarity price
            const updatePromises = rarityPrices.results.map((item: IShopRarityPriceEntityType) => {
                const newPrice = parseInt(data[item.rarity as keyof IUpdateShopRarityPriceRequest] as string);
                const originalPrice = item.price;

                if (newPrice !== originalPrice) {
                    return updateMutation.mutateAsync({
                        id: item.id,
                        data: {
                            rarity: item.rarity as "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY",
                            price: newPrice,
                            isChangeAllShopPreview: data.isChangeAllShopPreview,
                        },
                    });
                }
                return Promise.resolve();
            });

            await Promise.all(updatePromises);
            onClose();
        } catch (error) {
            console.error("Error updating rarity prices:", error);
        }
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >
            <DialogContent className="bg-white border-border max-w-3xl max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="text-foreground">{t("configShop.updateRarityPriceTitle")}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4 overflow-y-auto h-[calc(100vh-200px)] pb-16">
                    <div>
                        <p className="text-sm text-muted-foreground">{t("configShop.updateRarityPriceDescription")}</p>
                    </div>

                    {isLoading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <div
                                    key={`skeleton-${index}`}
                                    className="flex items-center justify-between p-4 border rounded-lg"
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        <Skeleton className="h-8 w-32" />
                                        <Skeleton className="h-6 w-24" />
                                    </div>
                                    <Skeleton className="h-10 w-40" />
                                </div>
                            ))}
                        </div>
                    ) : rarityPrices?.results && rarityPrices.results.length > 0 ? (
                        <div className="border rounded-lg overflow-hidden">
                            {/* Header */}
                            <div className="bg-muted/50 grid grid-cols-12 gap-4 p-4 border-b font-semibold text-sm text-foreground">
                                <div className="col-span-4">{t("configShop.rarity")}</div>
                                <div className="col-span-4">{t("configShop.currentPrice")}</div>
                                <div className="col-span-4">{t("configShop.newPrice")}</div>
                            </div>

                            {/* Rows */}
                            <div className="divide-y">
                                {rarityPrices.results.map((item: IShopRarityPriceEntityType) => {
                                    const fieldName = item.rarity as keyof IUpdateShopRarityPriceRequest;
                                    const error = (errors as any)[fieldName];
                                    const hasChanged = (formValues as any)[fieldName] !== item.price.toString();

                                    return (
                                        <div
                                            key={item.id}
                                            className={`grid grid-cols-12 gap-4 p-4 hover:bg-muted/30 transition-colors ${
                                                hasChanged ? "bg-primary/5 border-l-4 border-l-primary" : ""
                                            }`}
                                        >
                                            <div className="col-span-4 flex items-center">
                                                <RarityBadge level={item.rarity as any} />
                                            </div>

                                            <div className="col-span-4 flex items-center text-sm text-muted-foreground">
                                                <span className="font-medium mr-1">{item.price.toLocaleString()}</span>
                                                <Sparkles className="w-4 h-4" />
                                            </div>

                                            <div className="col-span-4">
                                                <Controller
                                                    name={fieldName as any}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <div className="relative">
                                                            <Input
                                                                type="text"
                                                                inputMode="numeric"
                                                                value={field.value as string}
                                                                onChange={(e) =>
                                                                    handleNumericChange(field.onChange, e.target.value)
                                                                }
                                                                onBlur={field.onBlur}
                                                                name={field.name}
                                                                placeholder={item.price.toString()}
                                                                className={`w-full ${
                                                                    error
                                                                        ? "border-destructive focus:border-destructive"
                                                                        : ""
                                                                }`}
                                                            />
                                                            {error && (
                                                                <div className="absolute flex items-center gap-1 mt-1 text-xs text-destructive">
                                                                    <AlertCircle className="h-3 w-3" />
                                                                    <span>{error.message as string}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-12">
                            {t("configShop.noRarityPricesFound")}
                        </div>
                    )}

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex gap-2">
                            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="space-y-1 text-sm text-blue-900">
                                <p className="font-medium">{t("configShop.priceValidationInfo")}</p>
                                <p className="text-blue-700">
                                    {t("configShop.priceRangeInfo", { min: 1, max: 10000000 })}
                                </p>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="bg-muted/30 rounded-lg p-4 border">
                        <Controller
                            name="isChangeAllShopPreview"
                            control={control}
                            render={({ field }) => (
                                <div className="flex items-start space-x-3">
                                    <Checkbox
                                        id="changeAllShopPreview"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                    <div className="flex-1 space-y-1">
                                        <label
                                            htmlFor="changeAllShopPreview"
                                            className="text-sm font-medium text-foreground cursor-pointer"
                                        >
                                            {t("configShop.changeAllShopPreview")}
                                        </label>
                                        <p className="text-xs text-muted-foreground">
                                            {t("configShop.changeAllShopPreviewDescription")}
                                        </p>
                                    </div>
                                </div>
                            )}
                        />
                    </div>

                    <DialogFooter className="fixed bottom-0 left-0 right-0 bg-white  p-4 border-t border-border">
                        <Button type="button" variant="outline" onClick={onClose}>
                            {t("common.cancel")}
                        </Button>
                        <Button
                            type="button"
                            onClick={() => handleSubmit(onSubmit)()}
                            disabled={updateMutation.isPending || !isDirty}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            {updateMutation.isPending ? t("common.loading") : t("common.update")}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateRarityPriceDialog;
