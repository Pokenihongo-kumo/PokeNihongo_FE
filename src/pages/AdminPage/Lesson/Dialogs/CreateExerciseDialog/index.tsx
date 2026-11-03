import { DialogContent, DialogHeader, DialogTitle } from "@ui/Dialog";
import { Input } from "@ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";
import { Button } from "@ui/Button";
import { Switch } from "@ui/Switch";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card";
import { Badge } from "@ui/Badge";
import { Separator } from "@ui/Separator";
import { Textarea } from "@ui/Textarea";
import { useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { validateCreateExercise, useFormValidation, commonValidationRules } from "@utils/validation";
import { Target, Clock, Hash, Save, Send, X, BookOpen, BarChart3 } from "lucide-react";

interface CreateExerciseDialogProps {
    setIsAddDialogOpen: (value: boolean) => void;
    lessonId?: number;
    lessonTitle?: string;
    availableLessons?: Array<{
        id: number;
        title: string;
        level: number;
        slug: string;
    }>;
}

const CreateExerciseDialog = ({
    setIsAddDialogOpen,
    lessonId,
    lessonTitle,
    availableLessons = [],
}: CreateExerciseDialogProps) => {
    const { t } = useTranslation();

    // Mock lessons data - replace with actual API call
    const lessons =
        availableLessons.length > 0
            ? availableLessons
            : [
                  { id: 1, title: "Basic Hiragana", level: 5, slug: "basic-hiragana" },
                  { id: 2, title: "Basic Kanji", level: 4, slug: "basic-kanji" },
                  { id: 3, title: "Greetings", level: 5, slug: "greetings" },
                  { id: 4, title: "Numbers", level: 5, slug: "numbers" },
                  { id: 5, title: "Family", level: 4, slug: "family" },
              ];

    const [formData, setFormData] = useState({
        title: "",
        type: "multiple_choice" as "multiple_choice" | "fill_blank" | "listening" | "speaking",
        difficulty: "easy" as "easy" | "medium" | "hard",
        description: "",
        questionCount: 10,
        estimatedTime: 15,
        isActive: true,
        lessonId: lessonId || lessons[0]?.id || 1,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Initialize validation rules
    const validationRules = {
        title: commonValidationRules.title,
        description: commonValidationRules.description,
        type: commonValidationRules.type,
        difficulty: commonValidationRules.difficulty,
        questionCount: commonValidationRules.questionCount,
        estimatedTime: commonValidationRules.estimatedTime,
        lessonId: commonValidationRules.lessonId,
    };

    const { validate, validateField } = useFormValidation(validationRules);

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Mark field as touched
        setTouched((prev) => ({ ...prev, [field]: true }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        }
    };

    // Real-time validation on blur
    const handleBlur = (field: string) => {
        setTouched((prev) => ({ ...prev, [field]: true }));

        const error = validateField(field, formData[field]);
        if (error) {
            setErrors((prev) => ({ ...prev, [field]: error }));
        } else {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors = validateCreateExercise(formData);
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
            console.log("Creating exercise:", { ...formData, isActive: isPublish });
            toast.success(isPublish ? "Exercise published successfully!" : "Exercise saved as draft!");
            setIsAddDialogOpen(false);
        } catch (error) {
            toast.error("Failed to create exercise");
        }
    };

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
        return difficulties[difficulty as keyof typeof difficulties] || { label: difficulty, color: "bg-gray-500" };
    };

    const typeInfo = getTypeBadge(formData.type);
    const difficultyInfo = getDifficultyBadge(formData.difficulty);

    return (
        <>
            <DialogContent className="bg-gradient-to-br from-white to-gray-50 border-border max-w-4xl max-h-[95vh] overflow-hidden">
                <DialogHeader className="pb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Target className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold text-foreground">Add Exercise</DialogTitle>
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
                                    <Target className="h-5 w-5 text-primary" />
                                    Exercise Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Title */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Title *</label>
                                    <Input
                                        placeholder="Enter exercise title"
                                        className="bg-background border-border text-foreground h-11 text-base"
                                        value={formData.title}
                                        onChange={(e) => handleInputChange("title", e.target.value)}
                                        onBlur={() => handleBlur("title")}
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                            <X className="h-3 w-3" />
                                            {errors.title}
                                        </p>
                                    )}
                                </div>

                                {/* Lesson Selection */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                        <BookOpen className="h-4 w-4 text-primary" />
                                        Select Lesson *
                                    </label>
                                    <Select
                                        value={formData.lessonId.toString()}
                                        onValueChange={(value) => handleInputChange("lessonId", parseInt(value))}
                                    >
                                        <SelectTrigger
                                            className="bg-background border-border text-foreground h-11"
                                            onBlur={() => handleBlur("lessonId")}
                                        >
                                            <SelectValue placeholder="Select a lesson" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-card border-border">
                                            {lessons.map((lesson) => (
                                                <SelectItem key={lesson.id} value={lesson.id.toString()}>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium">{lesson.title}</span>
                                                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                                                            JLPT N{lesson.level}
                                                        </Badge>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Description *</label>
                                    <Textarea
                                        placeholder="Enter exercise description"
                                        className="bg-background border-border text-foreground min-h-[100px]"
                                        value={formData.description}
                                        onChange={(e) => handleInputChange("description", e.target.value)}
                                        onBlur={() => handleBlur("description")}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                            <X className="h-3 w-3" />
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Exercise Type */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">Exercise Type *</label>
                                        <Select
                                            value={formData.type}
                                            onValueChange={(value) => handleInputChange("type", value)}
                                        >
                                            <SelectTrigger
                                                className="bg-background border-border text-foreground h-11"
                                                onBlur={() => handleBlur("type")}
                                            >
                                                <SelectValue placeholder="Select exercise type" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-card border-border">
                                                <SelectItem value="multiple_choice">
                                                    <div className="flex items-center gap-2">
                                                        <Badge className="bg-blue-500 text-white text-xs">MC</Badge>
                                                        <span>Multiple Choice</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="fill_blank">
                                                    <div className="flex items-center gap-2">
                                                        <Badge className="bg-green-500 text-white text-xs">FB</Badge>
                                                        <span>Fill in Blank</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="listening">
                                                    <div className="flex items-center gap-2">
                                                        <Badge className="bg-purple-500 text-white text-xs">L</Badge>
                                                        <span>Listening</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="speaking">
                                                    <div className="flex items-center gap-2">
                                                        <Badge className="bg-orange-500 text-white text-xs">S</Badge>
                                                        <span>Speaking</span>
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Difficulty */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">Difficulty *</label>
                                        <Select
                                            value={formData.difficulty}
                                            onValueChange={(value) => handleInputChange("difficulty", value)}
                                        >
                                            <SelectTrigger
                                                className="bg-background border-border text-foreground h-11"
                                                onBlur={() => handleBlur("difficulty")}
                                            >
                                                <SelectValue placeholder="Select difficulty" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-card border-border">
                                                <SelectItem value="easy">
                                                    <div className="flex items-center gap-2">
                                                        <Badge className="bg-green-500 text-white text-xs">Easy</Badge>
                                                        <span>Easy</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="medium">
                                                    <div className="flex items-center gap-2">
                                                        <Badge className="bg-yellow-500 text-white text-xs">
                                                            Medium
                                                        </Badge>
                                                        <span>Medium</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="hard">
                                                    <div className="flex items-center gap-2">
                                                        <Badge className="bg-red-500 text-white text-xs">Hard</Badge>
                                                        <span>Hard</span>
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
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
                                            onBlur={() => handleBlur("questionCount")}
                                        />
                                        {errors.questionCount && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <X className="h-3 w-3" />
                                                {errors.questionCount}
                                            </p>
                                        )}
                                    </div>

                                    {/* Estimated Time */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-primary" />
                                            Estimated Time (minutes) *
                                        </label>
                                        <Input
                                            type="number"
                                            placeholder="15"
                                            className="bg-background border-border text-foreground h-11"
                                            value={formData.estimatedTime}
                                            onChange={(e) =>
                                                handleInputChange("estimatedTime", parseInt(e.target.value) || 0)
                                            }
                                            onBlur={() => handleBlur("estimatedTime")}
                                        />
                                        {errors.estimatedTime && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <X className="h-3 w-3" />
                                                {errors.estimatedTime}
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
                                                Activate Exercise
                                            </label>
                                            <p className="text-xs text-muted-foreground">
                                                Exercise will be available for students
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

export default CreateExerciseDialog;
