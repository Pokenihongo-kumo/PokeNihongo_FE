import { useEffect, useState, useCallback, useRef } from "react";
import { Button } from "@ui/Button";
import { Input } from "@ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";
import { usePreparePokemonList } from "@hooks/useGacha";
import { RarityBadge } from "@atoms/BadgeRarity";
import { Loader2 } from "lucide-react";
import { IPokemonLiteEntity } from "@models/pokemon/entity";
import { useTranslation } from "react-i18next";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    gachaBannerId: number;
}

export default function AddGachaPokemonSidebar({ isOpen, onClose, gachaBannerId }: Props) {
    const { t } = useTranslation();

    /**
     * UsePreparePokemonList Hook
     */
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [search, setSearch] = useState<string>("");
    const [debouncedSearch, setDebouncedSearch] = useState<string>("");
    const [rarity, setRarity] = useState<"ALL" | "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY">("ALL");
    const {
        data: preparePokemonList,
        isLoading: isPreparePokemonListLoading,
        refetch,
    } = usePreparePokemonList(
        gachaBannerId,
        {
            rarity: rarity === "ALL" ? undefined : [rarity],
            nameEn: debouncedSearch || undefined,
            currentPage,
            pageSize: 15,
        },
        isOpen,
    );
    //------------------------End------------------------//

    /**
     * Refetch when sidebar opens
     */
    useEffect(() => {
        if (isOpen && gachaBannerId) {
            refetch();
        }
    }, [isOpen, gachaBannerId, refetch]);
    //------------------------End------------------------//

    /**
     * Handle Accumulated Results
     */
    const [accumulatedResults, setAccumulatedResults] = useState<IPokemonLiteEntity[]>([]);
    useEffect(() => {
        const results = preparePokemonList?.data?.results as any[] | undefined;
        if (results && Array.isArray(results) && results.length > 0) {
            if (currentPage === 1) {
                setAccumulatedResults(results as unknown as IPokemonLiteEntity[]);
            } else {
                setAccumulatedResults((prev) => {
                    const existingIds = new Set(prev.map((p) => p.id));
                    const newResults = results.filter((p: any) => !existingIds.has(p.id));
                    return [...prev, ...newResults];
                });
            }
        } else if (!isPreparePokemonListLoading && currentPage === 1) {
            setAccumulatedResults([]);
        }
    }, [preparePokemonList, currentPage, isPreparePokemonListLoading]);
    //------------------------End------------------------//

    /**
     * Handle Intersection Observer
     */
    const observerRef = useRef<IntersectionObserver | null>(null);
    const lastPokemonElementRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (observerRef.current) observerRef.current.disconnect();
            observerRef.current = new IntersectionObserver((entries) => {
                if (
                    entries[0].isIntersecting &&
                    preparePokemonList?.data?.pagination?.current &&
                    preparePokemonList?.data?.pagination?.totalPage &&
                    preparePokemonList?.data?.pagination?.current < preparePokemonList?.data?.pagination?.totalPage &&
                    !isPreparePokemonListLoading
                ) {
                    setCurrentPage((prev) => prev + 1);
                }
            });
            if (node) observerRef.current.observe(node);
        },
        [preparePokemonList?.data?.pagination, isPreparePokemonListLoading],
    );
    //------------------------End------------------------//

    /**
     * Handle Reset Page and Accumulated Results
     */
    useEffect(() => {
        setCurrentPage(1);
        setAccumulatedResults([]);
    }, [debouncedSearch, rarity]);
    //------------------------End------------------------//

    /**
     * Handle Selected Pokemon
     */
    const [selected, setSelected] = useState<Record<number, boolean>>({});
    useEffect(() => {
        if (isOpen) {
            setSelected({});
        }
    }, [isOpen]);

    // Check if all visible Pokémon are selected
    const allSelected = accumulatedResults.length > 0 && accumulatedResults.every((p) => selected[p.id]);

    // Handle Select All / Deselect All
    const handleSelectAll = () => {
        if (allSelected) {
            // Deselect all
            setSelected({});
        } else {
            // Select all visible Pokémon
            const newSelected: Record<number, boolean> = {};
            accumulatedResults.forEach((p) => {
                newSelected[p.id] = true;
            });
            setSelected(newSelected);
        }
    };
    //------------------------End------------------------//

    /**
     * Handle Debounce Search
     */
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 300);
        return () => clearTimeout(t);
    }, [search]);
    //------------------------End------------------------//

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" onClick={onClose} onDragEnter={onClose} />
            <div className="absolute right-0 top-0 h-full w-full sm:w-[460px] bg-white shadow-2xl border-l border-border overflow-hidden">
                <div className="h-full grid grid-rows-[auto_1fr_auto]">
                    <div className="px-5 py-4 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-semibold tracking-tight">
                                {t("configGacha.addPokemonToGacha")}
                            </h3>
                            <Button variant="outline" onClick={onClose}>
                                {t("common.close")}
                            </Button>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-muted-foreground">
                                {t("configGacha.dragPokemonDropDescription")}
                            </p>
                            {Object.keys(selected).filter((id) => selected[Number(id)]).length > 0 && (
                                <span className="text-xs font-medium text-primary">
                                    {Object.keys(selected).filter((id) => selected[Number(id)]).length}{" "}
                                    {t("configGacha.selected")}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="p-4 overflow-y-auto">
                        <div className="mb-3 grid grid-cols-1 gap-2">
                            <Input
                                placeholder={t("configGacha.searchByName")}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                isSearch
                            />
                            <Select value={rarity} onValueChange={(v) => setRarity(v as any)}>
                                <SelectTrigger className="bg-background border-input">
                                    <SelectValue placeholder={t("configGacha.rarity")} />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-border">
                                    <SelectItem value="ALL">{t("configGacha.allRarities")}</SelectItem>
                                    <SelectItem value="COMMON">COMMON</SelectItem>
                                    <SelectItem value="UNCOMMON">UNCOMMON</SelectItem>
                                    <SelectItem value="RARE">RARE</SelectItem>
                                    <SelectItem value="EPIC">EPIC</SelectItem>
                                    <SelectItem value="LEGENDARY">LEGENDARY</SelectItem>
                                </SelectContent>
                            </Select>
                            {accumulatedResults.length > 0 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleSelectAll}
                                    className="w-full"
                                >
                                    {allSelected ? t("configGacha.deselectAll") : t("configGacha.selectAll")}
                                </Button>
                            )}
                        </div>
                        {isPreparePokemonListLoading && currentPage === 1 && accumulatedResults.length === 0 ? (
                            <div className="text-sm text-muted-foreground">{t("common.loading")}</div>
                        ) : accumulatedResults.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3">
                                {accumulatedResults.map((p, index) => {
                                    const isSelected = !!selected[p.id];
                                    return (
                                        <div
                                            key={p.id}
                                            ref={index === accumulatedResults.length - 1 ? lastPokemonElementRef : null}
                                            className={`flex items-center gap-3 p-2 rounded-lg border transition-colors cursor-grab select-none ${isSelected ? "border-primary bg-primary/10" : "border-border bg-muted/30 hover:bg-muted/40"}`}
                                            draggable
                                            onClick={(e) => {
                                                // toggle selection (avoid starting drag on click)
                                                e.stopPropagation();
                                                setSelected((prev) => ({ ...prev, [p.id]: !prev[p.id] }));
                                            }}
                                            onDragStart={(e) => {
                                                // Build payload: if multiple selected, send all selected; else single
                                                const selectedList = Object.keys(selected)
                                                    .filter((id) => selected[Number(id)])
                                                    .map((id) => Number(id));
                                                const payload =
                                                    selectedList.length > 0
                                                        ? accumulatedResults.filter((x) => selectedList.includes(x.id))
                                                        : [p];
                                                if (payload.length > 1) {
                                                    e.dataTransfer.setData(
                                                        "application/pokemon-list",
                                                        JSON.stringify(payload),
                                                    );
                                                }
                                                // also set single for compatibility
                                                e.dataTransfer.setData("application/pokemon", JSON.stringify(p));
                                                e.dataTransfer.effectAllowed = "move";
                                            }}
                                        >
                                            <img
                                                src={p.imageUrl}
                                                alt={p.nameTranslations.en}
                                                className="w-12 h-12 rounded-md shadow-sm"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <div className="text-sm font-medium truncate">
                                                    {p.nameTranslations.en}
                                                </div>
                                                <div className="text-[11px] text-muted-foreground truncate mb-1">
                                                    #{p.pokedex_number}
                                                </div>
                                                <RarityBadge level={p.rarity} />
                                            </div>
                                        </div>
                                    );
                                })}
                                {/* Loading indicator when loading more pages */}
                                {isPreparePokemonListLoading && currentPage > 1 && (
                                    <div className="col-span-2 flex items-center justify-center py-4">
                                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mr-2" />
                                        <span className="text-sm text-muted-foreground">
                                            {t("configGacha.loadingMore")}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-sm text-muted-foreground text-center py-8">
                                {t("configGacha.noPokemonFound")}
                            </div>
                        )}
                    </div>
                    <div className="px-5 py-3 border-t border-border bg-muted/20 text-[11px] text-muted-foreground">
                        {t("configGacha.dragTip")}
                    </div>
                </div>
            </div>
        </div>
    );
}
