import { useExercisesByLessonId } from "@hooks/useExercise";

export const useLessonExercises = (lessonId: number | null) => {
    // Use the real API hook directly
    const { data: apiData, isLoading, error } = useExercisesByLessonId(lessonId || 0);

    // Normalize API response to always be an array
    const raw = apiData?.data as any;
    const exercisesList = Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw?.results)
          ? raw.results
          : Array.isArray(raw)
            ? raw
            : [];

    // Return the data directly from API without transformation
    return {
        exercises: exercisesList,
        isLoading,
        error: error ? "Failed to fetch lesson exercises" : null,
        createExercise: async () => {
            // TODO: Implement create exercise API
            throw new Error("Create exercise not implemented yet");
        },
        updateExercise: async () => {
            // TODO: Implement update exercise API
            throw new Error("Update exercise not implemented yet");
        },
        deleteExercise: async () => {
            // TODO: Implement delete exercise API
            throw new Error("Delete exercise not implemented yet");
        },
    };
};
