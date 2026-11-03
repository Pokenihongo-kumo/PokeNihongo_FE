import { useState } from "react";
import { Card, CardContent } from "@ui/Card";
import { Button } from "@ui/Button";
import { Input } from "@ui/Input";
import { Badge } from "@ui/Badge";
import { Dialog, DialogTrigger } from "@ui/Dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";
import { Search, Plus, Edit, Trash2, Eye, HelpCircle, Clock, Hash, CheckCircle, Loader2 } from "lucide-react";
import { useLessonQuestions } from "@hooks/useLessonQuestions";
import { useTranslation } from "react-i18next";

interface LessonItem {
    id: number;
    titleKey: string;
    levelJlpt: number;
    isPublished: boolean;
}

interface LessonQuestionsStepProps {
    lesson: LessonItem;
    onComplete: () => void;
    onBack: () => void;
}

const LessonQuestionsStep = ({ lesson, onComplete, onBack }: LessonQuestionsStepProps) => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
    const [activeTypeTab, setActiveTypeTab] = useState<string>("all");
    const [activeDifficultyTab, setActiveDifficultyTab] = useState<string>("all");

    // Use hook to fetch questions for this lesson
    const { questions, isLoading, error, createQuestion, updateQuestion, deleteQuestion } = useLessonQuestions(
        lesson.id,
    );

    const getTypeBadge = (type: string) => {
        const types = {
            multiple_choice: { label: t("workflow.questions.multipleChoice"), color: "bg-blue-500" },
            fill_blank: { label: t("workflow.questions.fillBlank"), color: "bg-green-500" },
            listening: { label: t("workflow.questions.listening"), color: "bg-purple-500" },
            speaking: { label: t("workflow.questions.speaking"), color: "bg-orange-500" },
        };
        return types[type as keyof typeof types] || { label: type, color: "bg-gray-500" };
    };

    const getDifficultyBadge = (difficulty: string) => {
        const difficulties = {
            easy: { label: t("workflow.questions.easy"), color: "bg-green-500" },
            medium: { label: t("workflow.questions.medium"), color: "bg-yellow-500" },
            hard: { label: t("workflow.questions.hard"), color: "bg-red-500" },
        };
        return (
            difficulties[difficulty as keyof typeof difficulties] || {
                label: difficulty,
                color: "bg-gray-500",
            }
        );
    };

    const handleViewQuestion = (question: any) => {
        // TODO: Implement view functionality
        console.log("View question:", question);
    };

    const handleEditQuestion = (question: any) => {
        // TODO: Implement edit functionality
        console.log("Edit question:", question);
    };

    const handleDeleteQuestion = async (questionId: number) => {
        try {
            await deleteQuestion(questionId);
        } catch (error) {
            console.error("Failed to delete question:", error);
        }
    };

    const filteredQuestions = questions.filter((question) => {
        const matchesSearch = question.question.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = activeTypeTab === "all" || question.type === activeTypeTab;
        const matchesDifficulty = activeDifficultyTab === "all" || question.difficulty === activeDifficultyTab;

        return matchesSearch && matchesType && matchesDifficulty;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-foreground">{t("workflow.questions.title")}</h3>
                    <p className="text-muted-foreground">
                        {t("workflow.questions.manageForLesson")} {lesson.titleKey}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={onBack} className="border-border text-foreground hover:bg-muted">
                        {t("workflow.questions.backQuestionSets")}
                    </Button>
                    <Button onClick={onComplete} className="bg-green-600 text-white">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {t("workflow.questions.completeSetup")}
                    </Button>
                </div>
            </div>

            {/* Search and Filters */}
            <Card className="bg-card border-border">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder={t("workflow.questions.searchPlaceholder")}
                                    className="pl-10 bg-background border-border text-foreground"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Select value={activeTypeTab} onValueChange={setActiveTypeTab}>
                                <SelectTrigger className="w-32 bg-background border-border text-foreground">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t("workflow.questions.allTypes")}</SelectItem>
                                    <SelectItem value="multiple_choice">
                                        {t("workflow.questions.multipleChoice")}
                                    </SelectItem>
                                    <SelectItem value="fill_blank">{t("workflow.questions.fillBlank")}</SelectItem>
                                    <SelectItem value="listening">{t("workflow.questions.listening")}</SelectItem>
                                    <SelectItem value="speaking">{t("workflow.questions.speaking")}</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={activeDifficultyTab} onValueChange={setActiveDifficultyTab}>
                                <SelectTrigger className="w-32 bg-background border-border text-foreground">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t("workflow.questions.allDifficulty")}</SelectItem>
                                    <SelectItem value="easy">{t("workflow.questions.easy")}</SelectItem>
                                    <SelectItem value="medium">{t("workflow.questions.medium")}</SelectItem>
                                    <SelectItem value="hard">{t("workflow.questions.hard")}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Add Question Button */}
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-lg font-semibold text-foreground">
                            {t("workflow.questions.questionItems")} ({filteredQuestions.length})
                        </h4>
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-primary text-white hover:bg-primary/90">
                                    <Plus className="h-4 w-4 mr-2" />
                                    {t("workflow.questions.addQuestion")}
                                </Button>
                            </DialogTrigger>
                            {/* TODO: Create CreateQuestionDialog */}
                            <div>Create Question Dialog - TODO</div>
                        </Dialog>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <span className="ml-2 text-muted-foreground">{t("workflow.questions.loading")}</span>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="text-center py-12">
                            <div className="text-red-500 mb-4">{error}</div>
                            <Button onClick={() => window.location.reload()} variant="outline">
                                {t("common.retry")}
                            </Button>
                        </div>
                    )}

                    {/* Questions List */}
                    {!isLoading && !error && filteredQuestions.length === 0 ? (
                        <div className="text-center py-12">
                            <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                {t("workflow.questions.noQuestion")}
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                {t("workflow.questions.noQuestionDescription")}
                            </p>
                            <Button onClick={() => setIsAddDialogOpen(true)} className="bg-primary text-white">
                                <Plus className="h-4 w-4 mr-2" />
                                {t("workflow.questions.addFirstQuestion")}
                            </Button>
                        </div>
                    ) : !isLoading && !error ? (
                        <div className="grid gap-4">
                            {filteredQuestions.map((question) => {
                                const typeInfo = getTypeBadge(question.type);
                                const difficultyInfo = getDifficultyBadge(question.difficulty);

                                return (
                                    <Card
                                        key={question.id}
                                        className="bg-card border-border hover:shadow-md transition-shadow"
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-4 flex-1">
                                                    <div className="p-2 bg-primary/10 rounded-lg">
                                                        <HelpCircle className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h4 className="font-semibold text-foreground">
                                                                {question.question}
                                                            </h4>
                                                            <Badge className={`${typeInfo.color} text-white text-xs`}>
                                                                {typeInfo.label}
                                                            </Badge>
                                                            <Badge
                                                                className={`${difficultyInfo.color} text-white text-xs`}
                                                            >
                                                                {difficultyInfo.label}
                                                            </Badge>
                                                            <Badge
                                                                className={
                                                                    question.isActive
                                                                        ? "bg-green-500 text-white"
                                                                        : "bg-yellow-500 text-white"
                                                                }
                                                            >
                                                                {question.isActive
                                                                    ? t("workflow.questions.active")
                                                                    : t("workflow.questions.inactive")}
                                                            </Badge>
                                                        </div>
                                                        <div className="text-sm text-muted-foreground space-y-1">
                                                            <div className="flex items-center gap-4">
                                                                <div className="flex items-center gap-1">
                                                                    <Hash className="h-4 w-4" />
                                                                    <span>
                                                                        {question.points}{" "}
                                                                        {t("workflow.questions.points")}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    {t("workflow.questions.setTitle")}{" "}
                                                                    {question.questionSetTitle}
                                                                </div>
                                                                <div>
                                                                    {t("workflow.questions.exerciseTitle")}{" "}
                                                                    {question.exerciseTitle}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                {t("workflow.questions.created")} {question.createdAt}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleViewQuestion(question)}
                                                        className="border-border text-foreground hover:bg-muted"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEditQuestion(question)}
                                                        className="border-border text-foreground hover:bg-muted"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDeleteQuestion(question.id)}
                                                        className="border-destructive text-destructive hover:bg-destructive/10"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : null}
                </CardContent>
            </Card>
        </div>
    );
};

export default LessonQuestionsStep;
