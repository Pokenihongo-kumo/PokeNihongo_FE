import { useState, useEffect } from "react";

interface QuestionSetItem {
    id: number;
    title: string;
    exerciseId: number;
    exerciseTitle: string;
    exerciseSlug: string;
    lessonId: number;
    lessonTitle: string;
    lessonLevel: number;
    questionCount: number;
    timeLimit: number;
    isActive: boolean;
    createdAt: string;
    description?: string;
}

export const useLessonQuestionSets = (lessonId: number | null) => {
    const [questionSets, setQuestionSets] = useState<QuestionSetItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!lessonId) {
            setQuestionSets([]);
            return;
        }

        const fetchQuestionSets = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // TODO: Replace with actual API call
                // const response = await lessonQuestionSetsApi.getByLessonId(lessonId)

                // Mock data for now
                const mockQuestionSets: QuestionSetItem[] = [
                    {
                        id: 1,
                        title: "Basic Hiragana Set 1",
                        exerciseId: 1,
                        exerciseTitle: "Hiragana Recognition Quiz",
                        exerciseSlug: "hiragana-recognition",
                        lessonId: lessonId,
                        lessonTitle: "Basic Hiragana",
                        lessonLevel: 5,
                        questionCount: 10,
                        timeLimit: 15,
                        isActive: true,
                        createdAt: "2024-01-15",
                        description: "First set of Hiragana recognition questions",
                    },
                    {
                        id: 2,
                        title: "Basic Hiragana Set 2",
                        exerciseId: 1,
                        exerciseTitle: "Hiragana Recognition Quiz",
                        exerciseSlug: "hiragana-recognition",
                        lessonId: lessonId,
                        lessonTitle: "Basic Hiragana",
                        lessonLevel: 5,
                        questionCount: 15,
                        timeLimit: 20,
                        isActive: true,
                        createdAt: "2024-01-16",
                        description: "Advanced Hiragana recognition questions",
                    },
                    {
                        id: 3,
                        title: "Hiragana Writing Set 1",
                        exerciseId: 2,
                        exerciseTitle: "Hiragana Writing Practice",
                        exerciseSlug: "hiragana-writing",
                        lessonId: lessonId,
                        lessonTitle: "Basic Hiragana",
                        lessonLevel: 5,
                        questionCount: 20,
                        timeLimit: 25,
                        isActive: false,
                        createdAt: "2024-01-17",
                        description: "Practice writing Hiragana characters",
                    },
                ];

                setQuestionSets(mockQuestionSets);
            } catch (err) {
                setError("Failed to fetch lesson question sets");
                console.error("Error fetching lesson question sets:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuestionSets();
    }, [lessonId]);

    const createQuestionSet = async (questionSetData: Omit<QuestionSetItem, "id" | "createdAt">) => {
        try {
            // TODO: Implement API call
            const newQuestionSet: QuestionSetItem = {
                ...questionSetData,
                id: Date.now(), // Temporary ID
                createdAt: new Date().toISOString().split("T")[0],
            };
            setQuestionSets((prev) => [...prev, newQuestionSet]);
            return newQuestionSet;
        } catch (error) {
            throw new Error("Failed to create question set");
        }
    };

    const updateQuestionSet = async (id: number, questionSetData: Partial<QuestionSetItem>) => {
        try {
            // TODO: Implement API call
            setQuestionSets((prev) =>
                prev.map((questionSet) =>
                    questionSet.id === id ? { ...questionSet, ...questionSetData } : questionSet,
                ),
            );
        } catch (error) {
            throw new Error("Failed to update question set");
        }
    };

    const deleteQuestionSet = async (id: number) => {
        try {
            // TODO: Implement API call
            setQuestionSets((prev) => prev.filter((questionSet) => questionSet.id !== id));
        } catch (error) {
            throw new Error("Failed to delete question set");
        }
    };

    return {
        questionSets,
        isLoading,
        error,
        createQuestionSet,
        updateQuestionSet,
        deleteQuestionSet,
    };
};
