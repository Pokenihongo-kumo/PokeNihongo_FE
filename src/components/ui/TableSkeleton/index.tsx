import { Skeleton } from "@ui/Skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@ui/Table";

interface TableSkeletonProps {
    rows?: number;
    columns?: number;
    showHeader?: boolean;
}

const TableSkeleton = ({ rows = 5, columns = 6, showHeader = true }: TableSkeletonProps) => {
    return (
        <Table>
            {showHeader && (
                <TableHeader>
                    <TableRow className="border-border hover:bg-muted/50">
                        {Array.from({ length: columns }).map((_, index) => (
                            <TableHead key={`header-${index}`} className="text-muted-foreground">
                                <Skeleton className="h-4 w-16" />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
            )}
            <TableBody>
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <TableRow key={`skeleton-row-${rowIndex}`} className="border-border hover:bg-muted/50">
                        {Array.from({ length: columns }).map((_, colIndex) => (
                            <TableCell key={`skeleton-cell-${rowIndex}-${colIndex}`}>
                                {colIndex === columns - 1 ? (
                                    // Last column (actions) - circular skeleton
                                    <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                                ) : colIndex === columns - 2 ? (
                                    // Second last column (status) - badge skeleton
                                    <Skeleton className="h-6 w-16 rounded-full" />
                                ) : (
                                    // Regular columns
                                    <Skeleton className="h-5 w-24" />
                                )}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default TableSkeleton;
