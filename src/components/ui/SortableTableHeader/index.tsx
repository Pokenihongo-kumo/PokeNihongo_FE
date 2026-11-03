import { ChevronUp, ChevronDown, ChevronsUpDown, Minus } from "lucide-react";
import { TableHead } from "@ui/Table";

interface SortableTableHeaderProps {
    title: string;
    sortKey?: string;
    currentSortBy?: string;
    currentSort?: "asc" | "desc";
    onSort?: (sortKey: string) => void;
    sortable?: boolean;
    className?: string;
}

const SortableTableHeader = ({
    title,
    sortKey,
    currentSortBy,
    currentSort,
    onSort,
    sortable = true,
    className = "text-muted-foreground",
}: SortableTableHeaderProps) => {
    const isActive = currentSortBy === sortKey;
    const isAsc = currentSort === "asc";

    const handleClick = () => {
        if (sortable && sortKey && onSort) {
            onSort(sortKey);
        }
    };

    const renderSortIcon = () => {
        if (!sortable) {
            return <Minus className="w-4 h-4 text-gray-300" />;
        }

        if (isActive) {
            return isAsc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
        }

        return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
    };

    if (sortable && sortKey) {
        return (
            <TableHead className={`${className} select-none`}>
                <button
                    className="inline-flex items-center gap-1 hover:bg-gray-200 hover:font-bold p-2 rounded-md transition-colors cursor-pointer"
                    onClick={handleClick}
                >
                    {title}
                    <span className="inline-block w-4 h-4">{renderSortIcon()}</span>
                </button>
            </TableHead>
        );
    }

    return (
        <TableHead className={className}>
            <span className="inline-flex items-center gap-1">
                {title}
                <span className="inline-block w-4 h-4">{renderSortIcon()}</span>
            </span>
        </TableHead>
    );
};

export default SortableTableHeader;
