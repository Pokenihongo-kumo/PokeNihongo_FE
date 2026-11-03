import { Search, Filter, X } from "lucide-react";
import { Input } from "@ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";
import { Button } from "@ui/Button";
import { Badge } from "@ui/Badge";

interface FilterOption {
    value: string;
    label: string;
}

interface FilterConfig {
    key: string;
    value: string;
    onChange: (value: string) => void;
    options: FilterOption[];
    placeholder: string;
    label?: string;
}

interface FilterPanelProps {
    // Search
    searchValue: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;
    showSearch?: boolean;

    // Dynamic Filters
    filters: FilterConfig[];

    // Actions
    onClearAll?: () => void;
    showClearButton?: boolean;
    className?: string;
}

const FilterPanel = ({
    searchValue,
    onSearchChange,
    searchPlaceholder = "Tìm kiếm...",
    showSearch = true,
    filters,
    onClearAll,
    showClearButton = true,
    className = "",
}: FilterPanelProps) => {
    const hasActiveFilters = searchValue || filters.some((filter) => filter.value !== "all");

    return (
        <div className={`px-6 py-4 border-b border-border bg-muted/20 ${className}`}>
            <div className="space-y-4">
                {/* Search */}
                {showSearch && (
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10 bg-background border-border text-foreground"
                        />
                    </div>
                )}

                {/* Dynamic Filters Grid */}
                <div
                    className={`grid gap-3 ${
                        filters.length === 1
                            ? "grid-cols-1"
                            : filters.length === 2
                              ? "grid-cols-1 sm:grid-cols-2"
                              : filters.length === 3
                                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                    }`}
                >
                    {filters.map((filter) => (
                        <Select key={filter.key} value={filter.value} onValueChange={filter.onChange}>
                            <SelectTrigger className="w-full bg-background border-border text-foreground">
                                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                                <SelectValue placeholder={filter.placeholder} />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border">
                                {filter.options.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ))}
                </div>

                {/* Active Filters & Clear Button */}
                {hasActiveFilters && showClearButton && (
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-muted-foreground">Bộ lọc đang hoạt động:</span>
                            {searchValue && (
                                <Badge variant="secondary" className="text-xs">
                                    Tìm kiếm: "{searchValue}"
                                </Badge>
                            )}
                            {filters.map((filter) => {
                                if (filter.value !== "all") {
                                    const optionLabel = filter.options.find((opt) => opt.value === filter.value)?.label;
                                    return (
                                        <Badge key={filter.key} variant="secondary" className="text-xs">
                                            {filter.label || filter.key}: {optionLabel}
                                        </Badge>
                                    );
                                }
                                return null;
                            })}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onClearAll}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4 mr-1" />
                            Xóa tất cả
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilterPanel;
