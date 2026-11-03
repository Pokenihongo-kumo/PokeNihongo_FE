import { DialogContent, DialogHeader, DialogTitle } from "@ui/Dialog";
import { Input } from "@ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";
import { Button } from "@ui/Button";
import { Switch } from "@ui/Switch";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card";
import { Badge } from "@ui/Badge";
import { Separator } from "@ui/Separator";
import { useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { ClipboardList, Clock, Hash, Save, Send, X, BookOpen, BarChart3 } from "lucide-react";

interface CreateQuestionSetDialogProps {
    setIsAddDialogOpen: (value: boolean) => void;
    lessonId?: number;
    lessonTitle?: string;
    availableExercises?: Array<{
        id: number;
        title: string;
        type: string;
    }>;
}

const CreateQuestionSetDialog = ({
    setIsAddDialogOpen,
    lessonId,
    lessonTitle,
    availableExercises = [],
}: CreateQuestionSetDialogProps) => {
    const { t } = useTranslation();

    // Mock exercises data - replace with actual API call
    const exercises =
        availableExercises.length > 0
            ? availableExercises
            : [
                  { id: 1, title: "Hiragana Recognition Quiz", type: "multiple_choice" },
                  { id: 2, title: "Hiragana Writing Practice", type: "fill_blank" },
                  { id: 3, title: "Hiragana Listening Test", type: "listening" },
              ];

    const [formData, setFormData] = useState({
        title: "",
        exerciseId: exercises[0]?.id || 1,
        questionCount: 10,
        timeLimit: 15,
        isActive: true,
        lessonId: lessonId || 1,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = "Title is required";
        }
        if (formData.questionCount < 1) {
            newErrors.questionCount = "Question count must be at least 1";
        }
        if (formData.timeLimit < 1) {
            newErrors.timeLimit = "Time limit must be at least 1 minute";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (isPublish: boolean = false) => {
        if (!validateForm()) {
            toast.error("Please check your information");
            return;
        }

        try {
            // TODO: Implement API call
            console.log("Creating question set:", { ...formData, isActive: isPublish });
            toast.success(isPublish ? "Question set published successfully!" : "Question set saved as draft!");
            setIsAddDialogOpen(false);
        } catch (error) {
            toast.error("Failed to create question set");
        }
    };

    return (
        <>
            <DialogContent className="bg-gradient-to-br from-white to-gray-50 border-border max-w-4xl max-h-[95vh] overflow-hidden">
                <DialogHeader className="pb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <ClipboardList className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold text-foreground">Add Question Set</DialogTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                {lessonTitle && `For lesson: ${lessonTitle}`}
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="overflow-y-auto max-h-[calc(95vh-200px)] pr-2">
                    <div className="space-y-6">
                        {/* Basic Information */}
                        <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <ClipboardList className="h-5 w-5 text-primary" />
                                    Question Set Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Title */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Title *</label>
                                    <Input
                                        placeholder="Enter question set title"
                                        className="bg-background border-border text-foreground h-11 text-base"
                                        value={formData.title}
                                        onChange={(e) => handleInputChange("title", e.target.value)}
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                            <X className="h-3 w-3" />
                                            {errors.title}
                                        </p>
                                    )}
                                </div>

                                {/* Exercise Selection */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                        <BookOpen className="h-4 w-4 text-primary" />
                                        Select Exercise *
                                    </label>
                                    <Select
                                        value={formData.exerciseId.toString()}
                                        onValueChange={(value) => handleInputChange("exerciseId", parseInt(value))}
                                    >
                                        <SelectTrigger className="bg-background border-border text-foreground h-11">
                                            <SelectValue placeholder="Select an exercise" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-card border-border">
                                            {exercises.map((exercise) => (
                                                <SelectItem key={exercise.id} value={exercise.id.toString()}>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium">{exercise.title}</span>
                                                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                                                            {exercise.type}
                                                        </Badge>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Question Count */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                            <Hash className="h-4 w-4 text-primary" />
                                            Question Count *
                                        </label>
                                        <Input
                                            type="number"
                                            placeholder="10"
                                            className="bg-background border-border text-foreground h-11"
                                            value={formData.questionCount}
                                            onChange={(e) =>
                                                handleInputChange("questionCount", parseInt(e.target.value) || 0)
                                            }
                                        />
                                        {errors.questionCount && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <X className="h-3 w-3" />
                                                {errors.questionCount}
                                            </p>
                                        )}
                                    </div>

                                    {/* Time Limit */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-primary" />
                                            Time Limit (minutes) *
                                        </label>
                                        <Input
                                            type="number"
                                            placeholder="15"
                                            className="bg-background border-border text-foreground h-11"
                                            value={formData.timeLimit}
                                            onChange={(e) =>
                                                handleInputChange("timeLimit", parseInt(e.target.value) || 0)
                                            }
                                        />
                                        {errors.timeLimit && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <X className="h-3 w-3" />
                                                {errors.timeLimit}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Status */}
                        <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <BarChart3 className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="isActive"
                                                className="text-sm font-semibold text-foreground cursor-pointer"
                                            >
                                                Activate Question Set
                                            </label>
                                            <p className="text-xs text-muted-foreground">
                                                Question set will be available for students
                                            </p>
                                        </div>
                                    </div>
                                    <Switch
                                        id="isActive"
                                        checked={formData.isActive}
                                        onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                                        className="data-[state=checked]:bg-blue-600"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between items-center pt-4">
                    <div className="text-xs text-muted-foreground">* Required fields</div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setIsAddDialogOpen(false)}
                            className="border-border text-foreground hover:bg-gray-50 h-10 px-6"
                        >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </Button>
                        <Button
                            variant="outline"
                            className="border-border text-foreground bg-transparent hover:bg-gray-50 h-10 px-6"
                            onClick={() => handleSubmit(false)}
                        >
                            <Save className="h-4 w-4 mr-2" />
                            Save Draft
                        </Button>
                        <Button
                            className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 h-10 px-6 shadow-lg"
                            onClick={() => handleSubmit(true)}
                        >
                            <Send className="h-4 w-4 mr-2" />
                            Publish
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </>
    );
};

export default CreateQuestionSetDialog;
