import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@ui/Dialog";
import { Input } from "@ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";
import { Skeleton } from "@ui/Skeleton";
import { useCreateShopItems, useShopBannerById, useShopBannerAllPokemonByShopBannerId } from "@hooks/useShop";
import { useElementalTypeList } from "@hooks/useElemental";
import { useDebounce } from "@hooks/useDebounce";
import { IShopBannerAllPokemonResponseSchema } from "@models/shop/response";
import { cn } from "@utils/CN";
import { Loader2, Plus, Search, Filter } from "lucide-react";
import { useTranslation } from "react-i18next";
import { RarityPokemon } from "@constants/pokemon";
import { RarityBadge } from "@atoms/BadgeRarity";

interface AddHandmadePokemonDialogProps {
    isOpen: boolean;
    onClose: () => void;
    bannerId: number;
}

const AddHandmadePokemonDialog = ({ isOpen, onClose, bannerId }: AddHandmadePokemonDialogProps) => {
    /**
     * Define Variables
     */
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedRarity, setSelectedRarity] = useState<string>("all");
    const [selectedType, setSelectedType] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedPokemon, setSelectedPokemon] = useState<Map<number, IShopBannerAllPokemonResponseSchema>>(new Map());
    const observerRef = useRef<IntersectionObserver | null>(null);

    /**
     * Debounce search input
     */
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    /**
     * Pokemon Skeleton Component
     */
    const PokemonCardSkeleton = () => (
        <div className="border rounded-lg p-4 bg-muted/30 border-border">
            <div className="flex items-start gap-3">
                <Skeleton className="w-20 h-20 rounded-lg" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <div className="flex gap-2 mt-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-4 w-12" />
                    </div>
                </div>
            </div>
        </div>
    );
    //------------------------End------------------------//

    const { data: bannerDetail } = useShopBannerById(bannerId);
    const { data: typesData } = useElementalTypeList({ page: 1, limit: 100 });

    /**
     * Handle Accumulated Pokemon Results
     */
    const [accumulatedResults, setAccumulatedResults] = useState<IShopBannerAllPokemonResponseSchema[]>([]);
    const [totalItem, setTotalItem] = useState<number>(0);

    /**
     * Handle Get All Pokemon
     */
    const { data: pokemonData, isLoading: isPokemonLoading } = useShopBannerAllPokemonByShopBannerId(bannerId, {
        page: currentPage,
        limit: 15,
        search: debouncedSearchQuery || undefined,
        rarity: selectedRarity !== "all" ? selectedRarity : undefined,
        types: selectedType !== "all" ? selectedType : undefined,
    });

    useEffect(() => {
        if (pokemonData?.data?.results && pokemonData.data.results.length > 0) {
            if (currentPage === 1) {
                setAccumulatedResults(pokemonData.data.results);
            } else {
                setAccumulatedResults((prev) => {
                    const existingIds = new Set(prev.map((p) => p.id));
                    const newResults = pokemonData.data.results.filter((p) => !existingIds.has(p.id));
                    return [...prev, ...newResults];
                });
            }
            setTotalItem(pokemonData.data.pagination.totalItem);
        }
    }, [pokemonData, currentPage, isPokemonLoading]);

    const lastPokemonElementRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (observerRef.current) observerRef.current.disconnect();
            observerRef.current = new IntersectionObserver((entries) => {
                if (
                    entries[0].isIntersecting &&
                    pokemonData?.data?.pagination?.current &&
                    pokemonData?.data?.pagination?.totalPage &&
                    pokemonData?.data?.pagination?.current < pokemonData?.data?.pagination?.totalPage &&
                    !isPokemonLoading
                ) {
                    setCurrentPage((prev) => prev + 1);
                }
            });
            if (node) observerRef.current.observe(node);
        },
        [pokemonData?.data?.pagination, isPokemonLoading],
    );

    useEffect(() => {
        setCurrentPage(1);
        setAccumulatedResults([]);
    }, [debouncedSearchQuery, selectedRarity, selectedType]);

    // Reset selectedPokemon when dialog opens
    useEffect(() => {
        if (isOpen) {
            setSelectedPokemon(new Map());
            setCurrentPage(1);
            setSearchQuery("");
            setSelectedRarity("all");
            setSelectedType("all");
        }
    }, [isOpen]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleTypeChange = (value: string) => {
        setSelectedType(value);
    };

    const handleRarityChange = (value: string) => {
        setSelectedRarity(value);
    };

    const handlePokemonToggle = (pokemon: IShopBannerAllPokemonResponseSchema) => {
        if (pokemon.isExist) return;

        setSelectedPokemon((prev) => {
            const newMap = new Map(prev);
            if (newMap.has(pokemon.id)) {
                newMap.delete(pokemon.id);
            } else {
                newMap.set(pokemon.id, pokemon);
            }
            return newMap;
        });
    };
    //------------------------End------------------------//

    /**
     * Handle Create Shop Items
     * @returns useMutation to create shop items
     */
    const createShopItemsMutation = useCreateShopItems();
    const handleSubmit = async () => {
        if (selectedPokemon.size === 0) return;

        const items = Array.from(selectedPokemon.values()).map((pokemon: IShopBannerAllPokemonResponseSchema) => ({
            shopBannerId: bannerId,
            pokemonId: pokemon.id,
            price: 1000,
            purchaseLimit: bannerDetail?.data?.max || 1,
            isActive: true,
        }));

        try {
            await createShopItemsMutation.mutateAsync({ items });
            setSelectedPokemon(new Map());
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
            <DialogContent className="bg-white border-border max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-foreground">{t("configShop.addPokemonNotRandom")}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Search and Filter Section */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder={t("common.search")}
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="bg-background border-input pl-10"
                            />
                        </div>

                        <Select value={selectedType} onValueChange={handleTypeChange}>
                            <SelectTrigger className="bg-background border-border text-foreground w-full md:w-48">
                                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                                <SelectValue placeholder="Filter by Type" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border">
                                <SelectItem value="all">All Types</SelectItem>
                                {typesData?.results?.map((type: any) => (
                                    <SelectItem key={type.id} value={type.id}>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-2 h-2 rounded-full"
                                                style={{ backgroundColor: type.color_hex }}
                                            />
                                            {type.display_name.vi}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedRarity} onValueChange={handleRarityChange}>
                            <SelectTrigger className="bg-background border-border text-foreground w-full md:w-48">
                                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                                <SelectValue placeholder="Filter by Rarity" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border">
                                <SelectItem value="all">All Rarities</SelectItem>
                                {Object.entries(RarityPokemon).map(([key, value]) => (
                                    <SelectItem key={key} value={value}>
                                        {value}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Pokemon List */}
                    {isPokemonLoading && currentPage === 1 && accumulatedResults.length === 0 && (
                        <div className="grid gap-3 md:grid-cols-2 max-h-[450px] overflow-y-auto p-2 pb-16">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <PokemonCardSkeleton key={index} />
                            ))}
                        </div>
                    )}

                    {accumulatedResults.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-medium text-foreground">
                                    Pokemon ({totalItem} total, {selectedPokemon.size} selected)
                                </h3>
                            </div>
                            <div className="grid gap-3 md:grid-cols-2 max-h-[450px] overflow-y-auto p-2 pb-16">
                                {accumulatedResults.map(
                                    (pokemon: IShopBannerAllPokemonResponseSchema, index: number) => {
                                        const isSelected = selectedPokemon.has(pokemon.id);
                                        const isDisabled = pokemon.isExist;

                                        return (
                                            <div
                                                key={pokemon.id}
                                                ref={
                                                    index === accumulatedResults.length - 1
                                                        ? lastPokemonElementRef
                                                        : null
                                                }
                                                onClick={() => handlePokemonToggle(pokemon)}
                                                className={cn(
                                                    "border rounded-lg p-4 transition-colors cursor-pointer relative",
                                                    isSelected && "border-primary bg-primary/5",
                                                    isDisabled && "opacity-50 cursor-not-allowed bg-gray-100",
                                                    !isDisabled && "hover:border-primary/50 bg-muted/30",
                                                )}
                                            >
                                                {isDisabled && (
                                                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                                                        {t("configShop.alreadyExist")}
                                                    </div>
                                                )}

                                                <div className="flex items-start gap-3">
                                                    <img
                                                        src={pokemon.imageUrl}
                                                        alt={pokemon.nameTranslations.en}
                                                        className="w-20 h-20 rounded-lg bg-gray-200 object-contain"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className="font-semibold text-foreground truncate">
                                                                {pokemon.nameTranslations.en}
                                                            </p>
                                                            {isSelected && (
                                                                <Plus className="h-4 w-4 text-primary flex-shrink-0" />
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground mb-2">
                                                            {pokemon.nameJp}
                                                        </p>
                                                        <div className="flex items-center gap-2">
                                                            <RarityBadge level={pokemon.rarity as any} />
                                                            <p className="text-xs text-muted-foreground">
                                                                #{pokemon.pokedex_number}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    },
                                )}
                                {/* Loading indicator when loading more pages */}
                                {isPokemonLoading && currentPage > 1 && (
                                    <div className="col-span-2 flex items-center justify-center py-4">
                                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mr-2" />
                                        <span className="text-sm text-muted-foreground">{t("common.loading")}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {!isPokemonLoading && accumulatedResults.length === 0 && (
                        <div className="text-center text-muted-foreground py-12">{t("configShop.noPokemonFound")}</div>
                    )}
                </div>

                <DialogFooter className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-border">
                    <div className="flex justify-between items-center w-full gap-4">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="text-sm text-muted-foreground whitespace-nowrap">
                                {selectedPokemon.size} {t("configShop.pokemonSelected")}
                            </div>
                            <div className="flex-1 overflow-x-auto">
                                <div className="flex items-center gap-2 pr-2">
                                    {Array.from(selectedPokemon.values()).map((p) => (
                                        <button
                                            key={p.id}
                                            type="button"
                                            onClick={() => handlePokemonToggle(p)}
                                            className="group flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-full border border-primary/30 bg-primary/10 hover:bg-primary/20 transition-colors flex-shrink-0"
                                            title={p.nameTranslations.en}
                                        >
                                            <img
                                                src={p.imageUrl}
                                                alt={p.nameTranslations.en}
                                                className="w-6 h-6 rounded-full bg-white object-contain ring-1 ring-primary/20"
                                            />
                                            <span className="text-xs text-foreground/90 max-w-[120px] truncate">
                                                {p.nameTranslations.en}
                                            </span>
                                            <span className="ml-0.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-destructive/80 text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                                                ×
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={onClose}>
                                {t("common.cancel")}
                            </Button>
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                disabled={createShopItemsMutation.isPending || selectedPokemon.size === 0}
                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                {createShopItemsMutation.isPending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        {t("configShop.adding")}
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-4 w-4 mr-2" />
                                        {t("configShop.addToShop")}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddHandmadePokemonDialog;
