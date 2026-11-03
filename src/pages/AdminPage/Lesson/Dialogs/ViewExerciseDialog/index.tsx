import { DialogContent, DialogHeader, DialogTitle } from "@ui/Dialog";
import { Button } from "@ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card";
import { Badge } from "@ui/Badge";
import { Separator } from "@ui/Separator";
import { Target, Clock, BarChart3, Calendar, Edit, X } from "lucide-react";

interface ExerciseItem {
    id: number;
    title: string;
    lessonId: number;
    lessonTitle: string;
    lessonSlug: string;
    lessonLevel: number;
    type: "multiple_choice" | "fill_blank" | "listening" | "speaking";
    difficulty: "easy" | "medium" | "hard";
    questionCount: number;
    estimatedTime: number;
    isActive: boolean;
    createdAt: string;
    description?: string;
}

interface ViewExerciseDialogProps {
    exercise: ExerciseItem | null;
    onClose: () => void;
    onEdit?: (exercise: ExerciseItem) => void;
    onDelete?: (exerciseId: number) => void;
}

const ViewExerciseDialog = ({ exercise, onClose, onEdit, onDelete }: ViewExerciseDialogProps) => {
    if (!exercise) return null;

    const getTypeBadge = (type: string) => {
        const types = {
            multiple_choice: { label: "Multiple Choice", color: "bg-blue-500" },
            fill_blank: { label: "Fill in Blank", color: "bg-green-500" },
            listening: { label: "Listening", color: "bg-purple-500" },
            speaking: { label: "Speaking", color: "bg-orange-500" },
        };
        return types[type as keyof typeof types] || { label: type, color: "bg-gray-500" };
    };

    const getDifficultyBadge = (difficulty: string) => {
        const difficulties = {
            easy: { label: "Easy", color: "bg-green-500" },
            medium: { label: "Medium", color: "bg-yellow-500" },
            hard: { label: "Hard", color: "bg-red-500" },
        };
        return (
            difficulties[difficulty as keyof typeof difficulties] || {
                label: difficulty,
                color: "bg-gray-500",
            }
        );
    };

    const typeInfo = getTypeBadge(exercise.type);
    const difficultyInfo = getDifficultyBadge(exercise.difficulty);

    return (
        <DialogContent className="bg-gradient-to-br from-white to-gray-50 border-border max-w-4xl max-h-[95vh] overflow-hidden">
            <DialogHeader className="pb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Target className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                        <DialogTitle className="text-2xl font-bold text-foreground">{exercise.title}</DialogTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            {exercise.lessonTitle} • JLPT N{exercise.lessonLevel}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Badge className={`${typeInfo.color} text-white`}>{typeInfo.label}</Badge>
                        <Badge className={`${difficultyInfo.color} text-white`}>{difficultyInfo.label}</Badge>
                        <Badge className={exercise.isActive ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}>
                            {exercise.isActive ? "Active" : "Inactive"}
                        </Badge>
                    </div>
                </div>
            </DialogHeader>

            <div className="overflow-y-auto max-h-[calc(95vh-200px)] pr-2">
                <div className="space-y-6">
                    {/* Exercise Details */}
                    <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Target className="h-5 w-5 text-primary" />
                                Exercise Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Title</label>
                                    <p className="text-sm text-muted-foreground">{exercise.title}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Type</label>
                                    <div className="flex items-center gap-2">
                                        <Badge className={`${typeInfo.color} text-white`}>{typeInfo.label}</Badge>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Lesson</label>
                                    <p className="text-sm text-muted-foreground">{exercise.lessonTitle}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">JLPT Level</label>
                                    <Badge className="bg-blue-100 text-blue-800">JLPT N{exercise.lessonLevel}</Badge>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Difficulty</label>
                                    <Badge className={`${difficultyInfo.color} text-white`}>
                                        {difficultyInfo.label}
                                    </Badge>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Status</label>
                                    <Badge
                                        className={
                                            exercise.isActive ? "bg-green-500 text-white" : "bg-yellow-500 text-white"
                                        }
                                    >
                                        {exercise.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Questions</label>
                                    <div className="flex items-center gap-2">
                                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            {exercise.questionCount} questions
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Estimated Time</label>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            {exercise.estimatedTime} minutes
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Created</label>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">{exercise.createdAt}</span>
                                    </div>
                                </div>
                            </div>

                            {exercise.description && (
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Description</label>
                                    <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg">
                                        {exercise.description}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between items-center pt-4">
                <div className="text-xs text-muted-foreground">Exercise ID: {exercise.id}</div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="border-border text-foreground hover:bg-gray-50 h-10 px-6"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Close
                    </Button>
                    {onEdit && (
                        <Button
                            variant="outline"
                            onClick={() => onEdit(exercise)}
                            className="border-border text-foreground bg-transparent hover:bg-gray-50 h-10 px-6"
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                    )}
                    {onDelete && (
                        <Button variant="destructive" onClick={() => onDelete(exercise.id)} className="h-10 px-6">
                            Delete
                        </Button>
                    )}
                </div>
            </div>
        </DialogContent>
    );
};

export default ViewExerciseDialog;
