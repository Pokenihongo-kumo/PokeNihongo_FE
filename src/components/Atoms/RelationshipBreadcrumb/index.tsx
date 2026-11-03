import { ChevronRight, BookOpen, Target, HelpCircle } from "lucide-react";

interface RelationshipBreadcrumbProps {
    lessonTitle?: string;
    lessonLevel?: number;
    exerciseTitle?: string;
    className?: string;
}

const RelationshipBreadcrumb = ({
    lessonTitle,
    lessonLevel,
    exerciseTitle,
    className = "",
}: RelationshipBreadcrumbProps) => {
    return (
        <div className={`flex items-center space-x-1 text-xs text-muted-foreground ${className}`}>
            {lessonTitle && (
                <div className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    <span className="font-medium text-blue-600">{lessonTitle}</span>
                    {lessonLevel && (
                        <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full text-xs">
                            JLPT N{lessonLevel}
                        </span>
                    )}
                </div>
            )}

            {exerciseTitle && lessonTitle && (
                <>
                    <ChevronRight className="h-3 w-3" />
                    <div className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        <span className="font-medium text-green-600">{exerciseTitle}</span>
                    </div>
                </>
            )}
        </div>
    );
};

export default RelationshipBreadcrumb;
