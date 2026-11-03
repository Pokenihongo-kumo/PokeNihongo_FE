import { useState, useEffect } from "react";

interface QuestionItem {
    id: number;
    question: string;
    questionSetId: number;
    questionSetTitle: string;
    exerciseId: number;
    exerciseTitle: string;
    lessonId: number;
    lessonTitle: string;
    lessonLevel: number;
    type: "multiple_choice" | "fill_blank" | "listening" | "speaking";
    difficulty: "easy" | "medium" | "hard";
    points: number;
    isActive: boolean;
    createdAt: string;
    options?: string[];
    correctAnswer?: string;
    explanation?: string;
}

export const useLessonQuestions = (lessonId: number | null) => {
    const [questions, setQuestions] = useState<QuestionItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!lessonId) {
            setQuestions([]);
            return;
        }

        const fetchQuestions = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // TODO: Replace with actual API call
                // const response = await lessonQuestionsApi.getByLessonId(lessonId)

                // Mock data for now
                const mockQuestions: QuestionItem[] = [
                    {
                        id: 1,
                        question: "What is the correct Hiragana for 'a'?",
                        questionSetId: 1,
                        questionSetTitle: "Basic Hiragana Set 1",
                        exerciseId: 1,
                        exerciseTitle: "Hiragana Recognition Quiz",
                        lessonId: lessonId,
                        lessonTitle: "Basic Hiragana",
                        lessonLevel: 5,
                        type: "multiple_choice",
                        difficulty: "easy",
                        points: 10,
                        isActive: true,
                        createdAt: "2024-01-15",
                        options: ["あ", "い", "う", "え"],
                        correctAnswer: "あ",
                        explanation: 'あ is the Hiragana character for the sound "a"',
                    },
                    {
                        id: 2,
                        question: "Fill in the blank: こんにちは (Hello) starts with the character ___",
                        questionSetId: 1,
                        questionSetTitle: "Basic Hiragana Set 1",
                        exerciseId: 1,
                        exerciseTitle: "Hiragana Recognition Quiz",
                        lessonId: lessonId,
                        lessonTitle: "Basic Hiragana",
                        lessonLevel: 5,
                        type: "fill_blank",
                        difficulty: "medium",
                        points: 15,
                        isActive: true,
                        createdAt: "2024-01-15",
                        correctAnswer: "こ",
                        explanation: "こ is the first character in こんにちは",
                    },
                    {
                        id: 3,
                        question: "Listen to the audio and identify the Hiragana character",
                        questionSetId: 2,
                        questionSetTitle: "Basic Hiragana Set 2",
                        exerciseId: 1,
                        exerciseTitle: "Hiragana Recognition Quiz",
                        lessonId: lessonId,
                        lessonTitle: "Basic Hiragana",
                        lessonLevel: 5,
                        type: "listening",
                        difficulty: "hard",
                        points: 20,
                        isActive: true,
                        createdAt: "2024-01-16",
                        options: ["さ", "し", "す", "せ"],
                        correctAnswer: "し",
                        explanation: "The audio pronounced the character し (shi)",
                    },
                ];

                setQuestions(mockQuestions);
            } catch (err) {
                setError("Failed to fetch lesson questions");
                console.error("Error fetching lesson questions:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuestions();
    }, [lessonId]);

    const createQuestion = async (questionData: Omit<QuestionItem, "id" | "createdAt">) => {
        try {
            // TODO: Implement API call
            const newQuestion: QuestionItem = {
                ...questionData,
                id: Date.now(), // Temporary ID
                createdAt: new Date().toISOString().split("T")[0],
            };
            setQuestions((prev) => [...prev, newQuestion]);
            return newQuestion;
        } catch (error) {
            throw new Error("Failed to create question");
        }
    };

    const updateQuestion = async (id: number, questionData: Partial<QuestionItem>) => {
        try {
            // TODO: Implement API call
            setQuestions((prev) =>
                prev.map((question) => (question.id === id ? { ...question, ...questionData } : question)),
            );
        } catch (error) {
            throw new Error("Failed to update question");
        }
    };

    const deleteQuestion = async (id: number) => {
        try {
            // TODO: Implement API call
            setQuestions((prev) => prev.filter((question) => question.id !== id));
        } catch (error) {
            throw new Error("Failed to delete question");
        }
    };

    return {
        questions,
        isLoading,
        error,
        createQuestion,
        updateQuestion,
        deleteQuestion,
    };
};
