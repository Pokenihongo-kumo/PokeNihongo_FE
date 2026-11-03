import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@ui/Dialog";
import { Button } from "@ui/Button";
import { Input } from "@ui/Input";
import { Card, CardHeader } from "@ui/Card";
import { RarityBadge } from "@atoms/BadgeRarity";
import { useState, useEffect } from "react";
import { useUpdateShopItemByShopItemId } from "@hooks/useShop";
import { Loader2, Sparkles } from "lucide-react";

interface EditPriceDialogProps {
    isOpen: boolean;
    onClose: () => void;
    itemId: number;
    currentPrice: number;
    shopBannerId: number;
    pokemonId: number;
    purchaseLimit: number;
    isActive: boolean;
    pokemon: {
        id: number;
        nameTranslations: { en: string; ja: string; vi: string };
        imageUrl: string;
        pokedex_number: number;
        rarity: string;
    };
}

export default function EditPriceDialog({
    isOpen,
    onClose,
    itemId,
    currentPrice,
    shopBannerId,
    pokemonId,
    purchaseLimit,
    isActive,
    pokemon,
}: EditPriceDialogProps) {
    const { t } = useTranslation();
    const [price, setPrice] = useState<string>("");
    const [error, setError] = useState<string>("");

    const { mutate: updatePrice, isPending } = useUpdateShopItemByShopItemId();

    useEffect(() => {
        if (isOpen && currentPrice) {
            setPrice(currentPrice.toString());
            setError("");
        }
    }, [isOpen, currentPrice]);

    const handleSubmit = () => {
        setError("");

        const priceNum = parseFloat(price);
        if (!price || isNaN(priceNum)) {
            setError(t("configShop.priceRequired"));
            return;
        }

        if (priceNum < 0) {
            setError(t("configShop.priceMinError"));
            return;
        }

        if (priceNum > 1000000) {
            setError(t("configShop.priceMaxError"));
            return;
        }

        updatePrice({
            id: itemId,
            data: { shopBannerId, pokemonId, price: priceNum, purchaseLimit, isActive },
        });
    };

    const priceNum = price ? parseFloat(price) : currentPrice;
    const isValidPrice = price && !isNaN(priceNum) && priceNum >= 0 && priceNum <= 1000000;
    const newPrice = isValidPrice ? priceNum : currentPrice;
    const priceDiff = newPrice - currentPrice;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] bg-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">{t("configShop.editPrice")}</DialogTitle>
                    <DialogDescription>{t("configShop.editPriceDescription")}</DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Pokemon Card */}
                    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <img
                                    src={pokemon.imageUrl}
                                    alt={pokemon.nameTranslations.en}
                                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                                />
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-foreground">
                                        {pokemon.nameTranslations.en}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Pokedex: #{pokemon.pokedex_number}
                                    </p>
                                    <div className="mt-2">
                                        <RarityBadge level={pokemon.rarity as any} />
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Price Information */}
                    <div className="space-y-4">
                        <div className="bg-muted/50 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-muted-foreground">
                                    {t("configShop.currentPrice")}:
                                </span>
                                <div className="flex items-center gap-1">
                                    <span className="text-lg font-bold text-foreground">
                                        {currentPrice.toLocaleString()}
                                    </span>
                                    <Sparkles className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-muted-foreground">
                                    {t("configShop.newPrice")}:
                                </span>
                                <div className="flex items-center gap-1">
                                    <span className="text-lg font-bold text-primary">
                                        {newPrice.toLocaleString()} đ
                                    </span>
                                    <Sparkles className="w-4 h-4" />
                                </div>
                            </div>
                            {price && !isNaN(parseFloat(price)) && (
                                <div
                                    className={`mt-2 flex items-center gap-1 text-sm font-medium ${priceDiff !== 0 ? (priceDiff > 0 ? "text-green-500" : "text-red-500") : ""}`}
                                >
                                    {priceDiff > 0 && (
                                        <>
                                            <span>+{priceDiff.toLocaleString()}</span>
                                            <Sparkles className="w-4 h-4" />
                                        </>
                                    )}
                                    {priceDiff < 0 && (
                                        <>
                                            <span>{priceDiff.toLocaleString()}</span>
                                            <Sparkles className="w-4 h-4" />
                                        </>
                                    )}
                                    {priceDiff === 0 && t("configShop.noChange")}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="price" className="text-sm font-medium">
                                {t("configShop.enterNewPrice")}
                            </label>
                            <Input
                                id="price"
                                type="number"
                                value={price}
                                onChange={(e) => {
                                    setPrice(e.target.value);
                                    if (error) setError("");
                                }}
                                placeholder={t("configShop.enterPrice")}
                                disabled={isPending}
                                min="0"
                                max="1000000"
                                step="1000"
                                className="text-lg"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                {t("configShop.priceRange")}: 0 - 1.000.000 đ
                            </p>
                            {error && <p className="text-sm text-error">{error}</p>}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={onClose} disabled={isPending}>
                            {t("common.cancel")}
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isPending || !isValidPrice || price === currentPrice.toString()}
                            className="min-w-[100px]"
                        >
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t("common.save")}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
