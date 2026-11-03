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
import { HelpCircle, Hash, Save, Send, X, BookOpen, BarChart3, Plus, Trash2 } from "lucide-react";

interface CreateQuestionDialogProps {
    setIsAddDialogOpen: (value: boolean) => void;
    lessonId?: number;
    lessonTitle?: string;
    availableQuestionSets?: Array<{
        id: number;
        title: string;
        exerciseTitle: string;
    }>;
}

const CreateQuestionDialog = ({
    setIsAddDialogOpen,
    lessonId,
    lessonTitle,
    availableQuestionSets = [],
}: CreateQuestionDialogProps) => {
    const { t } = useTranslation();

    // Mock question sets data - replace with actual API call
    const questionSets =
        availableQuestionSets.length > 0
            ? availableQuestionSets
            : [
                  { id: 1, title: "Basic Hiragana Set 1", exerciseTitle: "Hiragana Recognition Quiz" },
                  { id: 2, title: "Basic Hiragana Set 2", exerciseTitle: "Hiragana Recognition Quiz" },
                  { id: 3, title: "Hiragana Writing Set 1", exerciseTitle: "Hiragana Writing Practice" },
              ];

    const [formData, setFormData] = useState({
        question: "",
        questionSetId: questionSets[0]?.id || 1,
        type: "multiple_choice" as "multiple_choice" | "fill_blank" | "listening" | "speaking",
        difficulty: "easy" as "easy" | "medium" | "hard",
        points: 10,
        isActive: true,
        options: ["", "", "", ""],
        correctAnswer: "",
        explanation: "",
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

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData((prev) => ({
            ...prev,
            options: newOptions,
        }));
    };

    const addOption = () => {
        setFormData((prev) => ({
            ...prev,
            options: [...prev.options, ""],
        }));
    };

    const removeOption = (index: number) => {
        if (formData.options.length > 2) {
            const newOptions = formData.options.filter((_, i) => i !== index);
            setFormData((prev) => ({
                ...prev,
                options: newOptions,
            }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.question.trim()) {
            newErrors.question = "Question is required";
        }
        if (formData.type === "multiple_choice" && formData.options.filter((opt) => opt.trim()).length < 2) {
            newErrors.options = "At least 2 options are required for multiple choice";
        }
        if (formData.type === "multiple_choice" && !formData.correctAnswer.trim()) {
            newErrors.correctAnswer = "Correct answer is required";
        }
        if (formData.points < 1) {
            newErrors.points = "Points must be at least 1";
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
            console.log("Creating question:", { ...formData, isActive: isPublish });
            toast.success(isPublish ? "Question published successfully!" : "Question saved as draft!");
            setIsAddDialogOpen(false);
        } catch (error) {
            toast.error("Failed to create question");
        }
    };

    const getTypeBadge = (type: string) => {
        const types = {
            multiple_choice: { label: "MC", color: "bg-blue-500" },
            fill_blank: { label: "FB", color: "bg-green-500" },
            listening: { label: "L", color: "bg-purple-500" },
            speaking: { label: "S", color: "bg-orange-500" },
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
                            <HelpCircle className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold text-foreground">Add Question</DialogTitle>
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
                                    <HelpCircle className="h-5 w-5 text-primary" />
                                    Question Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Question */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Question *</label>
                                    <Textarea
                                        placeholder="Enter your question here..."
                                        className="bg-background border-border text-foreground min-h-[100px]"
                                        value={formData.question}
                                        onChange={(e) => handleInputChange("question", e.target.value)}
                                    />
                                    {errors.question && (
                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                            <X className="h-3 w-3" />
                                            {errors.question}
                                        </p>
                                    )}
                                </div>

                                {/* Question Set Selection */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                        <BookOpen className="h-4 w-4 text-primary" />
                                        Select Question Set *
                                    </label>
                                    <Select
                                        value={formData.questionSetId.toString()}
                                        onValueChange={(value) => handleInputChange("questionSetId", parseInt(value))}
                                    >
                                        <SelectTrigger className="bg-background border-border text-foreground h-11">
                                            <SelectValue placeholder="Select a question set" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-card border-border">
                                            {questionSets.map((questionSet) => (
                                                <SelectItem key={questionSet.id} value={questionSet.id.toString()}>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium">{questionSet.title}</span>
                                                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                                                            {questionSet.exerciseTitle}
                                                        </Badge>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Question Type */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">Question Type *</label>
                                        <Select
                                            value={formData.type}
                                            onValueChange={(value) => handleInputChange("type", value)}
                                        >
                                            <SelectTrigger className="bg-background border-border text-foreground h-11">
                                                <SelectValue placeholder="Select question type" />
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
                                            <SelectTrigger className="bg-background border-border text-foreground h-11">
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

                                    {/* Points */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                            <Hash className="h-4 w-4 text-primary" />
                                            Points *
                                        </label>
                                        <Input
                                            type="number"
                                            placeholder="10"
                                            className="bg-background border-border text-foreground h-11"
                                            value={formData.points}
                                            onChange={(e) => handleInputChange("points", parseInt(e.target.value) || 0)}
                                        />
                                        {errors.points && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <X className="h-3 w-3" />
                                                {errors.points}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Multiple Choice Options */}
                                {formData.type === "multiple_choice" && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-semibold text-foreground">
                                                Answer Options *
                                            </label>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={addOption}
                                                className="border-border text-foreground hover:bg-muted"
                                            >
                                                <Plus className="h-4 w-4 mr-1" />
                                                Add Option
                                            </Button>
                                        </div>
                                        {formData.options.map((option, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <Input
                                                    placeholder={`Option ${index + 1}`}
                                                    className="bg-background border-border text-foreground"
                                                    value={option}
                                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                                />
                                                {formData.options.length > 2 && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => removeOption(index)}
                                                        className="border-destructive text-destructive hover:bg-destructive/10"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                        {errors.options && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <X className="h-3 w-3" />
                                                {errors.options}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Correct Answer */}
                                {formData.type === "multiple_choice" && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">
                                            Correct Answer *
                                        </label>
                                        <Input
                                            placeholder="Enter correct answer"
                                            className="bg-background border-border text-foreground h-11"
                                            value={formData.correctAnswer}
                                            onChange={(e) => handleInputChange("correctAnswer", e.target.value)}
                                        />
                                        {errors.correctAnswer && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <X className="h-3 w-3" />
                                                {errors.correctAnswer}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Explanation */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Explanation</label>
                                    <Textarea
                                        placeholder="Enter explanation for the answer..."
                                        className="bg-background border-border text-foreground min-h-[80px]"
                                        value={formData.explanation}
                                        onChange={(e) => handleInputChange("explanation", e.target.value)}
                                    />
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
                                                Activate Question
                                            </label>
                                            <p className="text-xs text-muted-foreground">
                                                Question will be available for students
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

export default CreateQuestionDialog;
