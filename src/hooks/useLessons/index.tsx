import { useState, useEffect } from "react";

interface Lesson {
    id: number;
    title: string;
    level: number;
    slug: string;
    isPublished: boolean;
}

export const useLessons = () => {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // TODO: Replace with actual API call
        const fetchLessons = async () => {
            setIsLoading(true);
            try {
                // Mock data - replace with actual API call
                const mockLessons: Lesson[] = [
                    { id: 1, title: "Basic Hiragana", level: 5, slug: "basic-hiragana", isPublished: true },
                    { id: 2, title: "Basic Kanji", level: 4, slug: "basic-kanji", isPublished: true },
                    { id: 3, title: "Greetings", level: 5, slug: "greetings", isPublished: true },
                    { id: 4, title: "Numbers", level: 5, slug: "numbers", isPublished: true },
                    { id: 5, title: "Family", level: 4, slug: "family", isPublished: true },
                    { id: 6, title: "Colors", level: 5, slug: "colors", isPublished: false },
                    { id: 7, title: "Food", level: 4, slug: "food", isPublished: true },
                    { id: 8, title: "Time", level: 3, slug: "time", isPublished: true },
                ];

                setLessons(mockLessons);
            } catch (error) {
                console.error("Failed to fetch lessons:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLessons();
    }, []);

    const getPublishedLessons = () => lessons.filter((lesson) => lesson.isPublished);

    const getLessonsByLevel = (level: number) => lessons.filter((lesson) => lesson.level === level);

    const getLessonById = (id: number) => lessons.find((lesson) => lesson.id === id);

    return {
        lessons,
        isLoading,
        getPublishedLessons,
        getLessonsByLevel,
        getLessonById,
    };
};
