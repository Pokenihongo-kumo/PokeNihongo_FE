import { useState } from "react";
import { Button } from "@ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@ui/Dialog";
import { Input } from "@ui/Input";
import { useCreateShopItems, useShopBannerById, useShopItemRandom } from "@hooks/useShop";
import { IShopItemRandomSchema } from "@models/shop/response";
import { cn } from "@utils/CN";
import { Loader2, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { RarityBadge } from "@atoms/BadgeRarity";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@ui/Tooltip";
import { Info } from "lucide-react";

interface AddRandomPokemonDialogProps {
    isOpen: boolean;
    onClose: () => void;
    bannerId: number;
}

const AddRandomPokemonDialog = ({ isOpen, onClose, bannerId }: AddRandomPokemonDialogProps) => {
    /**
     * Define Variables
     */
    const { t } = useTranslation();
    const [amount, setAmount] = useState<number>(8);
    const [selectedPokemonIds, setSelectedPokemonIds] = useState<number[]>([]);
    //------------------------End------------------------//

    const { data: bannerDetail } = useShopBannerById(bannerId);
    /**
     * Handle Get Random Pokemon
     */
    const { data: randomPokemonData, isLoading: isLoadingRandom, refetch } = useShopItemRandom(bannerId, amount);
    const randomPokemon = randomPokemonData?.data ?? [];
    const eligibleCount = selectedPokemonIds.length
        ? randomPokemon.filter((i: IShopItemRandomSchema) => selectedPokemonIds.includes(i.pokemonId) && !i.isHas)
              .length
        : randomPokemon.filter((i: IShopItemRandomSchema) => !i.isHas).length;

    const handleGetRandom = async () => {
        await refetch();
    };
    const toggleSelectId = (id: number) => {
        setSelectedPokemonIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const clearSelection = () => setSelectedPokemonIds([]);

    //------------------------End------------------------//

    /**
     * Handle Create Shop Items
     * @returns useMutation to create shop items
     */
    const createShopItemsMutation = useCreateShopItems();
    const handleSubmit = async () => {
        const source = selectedPokemonIds.length
            ? randomPokemon.filter((i: IShopItemRandomSchema) => selectedPokemonIds.includes(i.pokemonId) && !i.isHas)
            : randomPokemon.filter((i: IShopItemRandomSchema) => !i.isHas);

        const items = source.map((item: IShopItemRandomSchema) => ({
            shopBannerId: item.shopBannerId,
            pokemonId: item.pokemonId,
            price: item.price,
            purchaseLimit: item.purchaseLimit,
            isActive: item.isActive,
        }));

        try {
            await createShopItemsMutation.mutateAsync({ items });
            onClose();
        } catch (error: any) {
            console.error("Error creating shop items:", error);
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
            <DialogContent className="bg-white border-border max-w-4xl sm:max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-foreground">{t("configShop.addRandomPokemonTitle")}</DialogTitle>
                </DialogHeader>

                <TooltipProvider delayDuration={0}>
                    <div className="space-y-4 py-4">
                        {/* Amount input */}
                        <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium text-foreground mb-2 block">
                                        {t("configShop.randomPokemonAmount")}
                                    </label>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info className="h-4 w-4 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="text-sm">
                                                {t("pokemon.selectOptionalHelp") ||
                                                    "If none selected, all random Pokemon will be included."}
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                <Input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    className="bg-background border-input"
                                    min={1}
                                    max={bannerDetail?.data?.max || 8}
                                />
                            </div>
                            <Button
                                type="button"
                                onClick={handleGetRandom}
                                disabled={isLoadingRandom}
                                className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                {isLoadingRandom ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        {t("configShop.loading")}
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-4 w-4 mr-2" />
                                        {t("configShop.randomPokemonButton")}
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Random Pokemon Controls & List */}
                        {randomPokemon.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-medium text-foreground mb-3">
                                        {t("configShop.randomPokemonList")} ({randomPokemon.length})
                                    </h3>
                                    {!!selectedPokemonIds.length && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="h-7 px-2 text-xs"
                                            onClick={clearSelection}
                                        >
                                            {t("common.clearAll") || "Clear all"}
                                        </Button>
                                    )}
                                </div>
                                <div className="grid gap-3 md:grid-cols-2 max-h-[400px] overflow-y-auto p-2 pb-16">
                                    {randomPokemon.map((item: IShopItemRandomSchema, index: number) => {
                                        const selected = selectedPokemonIds.includes(item.pokemonId);
                                        const disabled = Boolean((item as any)?.isHas);
                                        return (
                                            <div
                                                key={index}
                                                className={cn(
                                                    "relative border rounded-lg p-4 bg-muted/30 border-border select-none",
                                                    "transition-colors",
                                                    selected &&
                                                        !disabled &&
                                                        "border-primary ring-2 ring-primary/30 bg-primary/5",
                                                    disabled
                                                        ? "opacity-60 pointer-events-none saturate-0 contrast-75"
                                                        : "hover:border-primary/50 cursor-pointer",
                                                )}
                                                onClick={() => {
                                                    if (!disabled) toggleSelectId(item.pokemonId);
                                                }}
                                            >
                                                {disabled && (
                                                    <div className="absolute inset-0 rounded-lg bg-white/50" />
                                                )}
                                                {disabled && (
                                                    <div className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-muted border border-border text-foreground/70">
                                                        {t("configShop.alreadyExist")}
                                                    </div>
                                                )}
                                                {selected && !disabled && (
                                                    <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground grid place-items-center text-[10px]">
                                                        ✓
                                                    </div>
                                                )}
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <img
                                                                src={item.pokemon.imageUrl}
                                                                alt={
                                                                    (item.pokemon.nameTranslations as any).en ||
                                                                    item.pokemon.nameJp
                                                                }
                                                                className="w-16 h-16 rounded-lg bg-gray-200 object-contain"
                                                            />
                                                            <div>
                                                                <p className="font-semibold text-foreground">
                                                                    {(item.pokemon.nameTranslations as any).en ||
                                                                        item.pokemon.nameJp}
                                                                </p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {item.pokemon.nameJp}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="flex items-center justify-between text-sm">
                                                                <span className="text-muted-foreground">
                                                                    {t("configShop.price")}:
                                                                </span>
                                                                <span className="font-medium text-foreground flex items-center gap-1">
                                                                    {item.price.toLocaleString()}{" "}
                                                                    <Sparkles className="w-4 h-4" />
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center justify-between text-sm">
                                                                <span className="text-muted-foreground">
                                                                    {t("configShop.purchaseLimit")}:
                                                                </span>
                                                                <span className="font-medium text-foreground">
                                                                    {item.purchaseLimit}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                                                    <RarityBadge level={item.pokemon.rarity as any} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {randomPokemon.length === 0 && !isLoadingRandom && (
                            <div className="text-center text-muted-foreground py-12">
                                {t("configShop.getRandomFirst")}
                            </div>
                        )}
                    </div>
                </TooltipProvider>

                <DialogFooter className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-border">
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            {t("common.cancel")}
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSubmit}
                            disabled={createShopItemsMutation.isPending || eligibleCount === 0}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            {createShopItemsMutation.isPending ? t("configShop.adding") : t("configShop.addToShop")}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddRandomPokemonDialog;
