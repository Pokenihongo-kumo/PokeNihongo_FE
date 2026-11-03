import { ChevronDown, Filter, ChevronUp, ChevronsUpDown, Minus } from "lucide-react";
import { TableHead } from "@ui/Table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";
import { Input } from "@ui/Input";

interface FilterOption {
    value: string;
    label: string;
}

interface FilterableTableHeaderProps {
    title: string;
    filterType?: "select" | "input" | "none";
    filterOptions?: FilterOption[];
    filterValue?: string;
    onFilterChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
    // Sort props
    sortable?: boolean;
    sortKey?: string;
    currentSortBy?: string;
    currentSort?: "asc" | "desc";
    onSort?: (sortKey: string) => void;
}

const FilterableTableHeader = ({
    title,
    filterType = "none",
    filterOptions = [],
    filterValue = "",
    onFilterChange,
    placeholder,
    className = "text-muted-foreground",
    sortable = false,
    sortKey,
    currentSortBy,
    currentSort,
    onSort,
}: FilterableTableHeaderProps) => {
    const renderSortIcon = () => {
        if (!sortable) {
            return <Minus className="w-4 h-4 text-gray-300" />;
        }

        const isActive = currentSortBy === sortKey;
        const isAsc = currentSort === "asc";

        if (isActive) {
            return isAsc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
        }

        return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
    };

    const handleSortClick = () => {
        if (sortable && sortKey && onSort) {
            onSort(sortKey);
        }
    };

    const renderFilter = () => {
        if (filterType === "select" && filterOptions.length > 0) {
            return (
                <Select value={filterValue} onValueChange={onFilterChange}>
                    <SelectTrigger className="w-full h-8 bg-background border-border text-foreground text-xs">
                        <Filter className="h-3 w-3 mr-1" />
                        <SelectValue placeholder={placeholder} />
                        <ChevronDown className="h-3 w-3" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                        {filterOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="text-xs">
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );
        }

        if (filterType === "input") {
            return (
                <Input
                    value={filterValue}
                    onChange={(e) => onFilterChange?.(e.target.value)}
                    placeholder={placeholder}
                    className="h-8 text-xs bg-background border-border text-foreground"
                />
            );
        }

        return null;
    };

    return (
        <TableHead className={className}>
            <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                    {sortable && sortKey ? (
                        <button
                            className="inline-flex items-center gap-1 hover:text-foreground transition-colors text-sm font-medium"
                            onClick={handleSortClick}
                        >
                            {title}
                            <span className="inline-block w-4 h-4">{renderSortIcon()}</span>
                        </button>
                    ) : (
                        <span className="text-sm font-medium">{title}</span>
                    )}
                </div>
                {filterType !== "none" && <div className="w-full">{renderFilter()}</div>}
            </div>
        </TableHead>
    );
};

export default FilterableTableHeader;
