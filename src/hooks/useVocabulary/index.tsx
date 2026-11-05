import { IQueryRequest } from "@models/common/request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import vocabularyService from "@services/vocabulary";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { ICreateVocabularyFullMultipartType, IUpdateVocabularyPayload } from "@models/vocabulary/request";
import { getApiErrorMessage } from "@utils/api-error";

/**
 * Query keys of the vocabulary feature; mutations invalidate `all`
 */
export const vocabularyKeys = {
    all: ["vocabulary"] as const,
    list: (params: unknown) => ["vocabulary", "list", params] as const,
    statistics: () => ["vocabulary", "statistics"] as const,
};

/**
 * Invalidates every vocabulary query (lists, admin and lesson dialogs, statistics)
 */
const useInvalidateVocabulary = () => {
    const queryClient = useQueryClient();
    return () => queryClient.invalidateQueries({ queryKey: vocabularyKeys.all });
};

/**
 * hanlde Vocabulary List
 * @param params
 * @returns
 */
export const useVocabularyList = (params: IQueryRequest & { enabled?: boolean; dialogKey?: number }) => {
    const { page, limit, search, levelN, sortBy, sort, enabled = true, dialogKey, lessonId } = params;

    const { data, isLoading, isError, error } = useQuery({
        queryKey: vocabularyKeys.list({ page, limit, search, levelN, sortBy, sort, dialogKey, lessonId }),
        queryFn: () => vocabularyService.getAllVocabularies(params),
        enabled,
    });

    return { data: data?.data, isLoading, isError, error };
};

/**
 * hanlde Vocabulary Statistics
 * @returns
 */
export const useVocabularyStatistics = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: vocabularyKeys.statistics(),
        queryFn: () => vocabularyService.getStatistics(),
    });
    return { data: data?.data, isLoading, error };
};
//--------------------------------End--------------------------------//

/**
 * Handle Create Vocabulary (POST /vocabulary/full). The backend adds a meaning
 * instead when the word already exists (isNew: false).
 * Success toasts stay translated on the client: backend vocabulary messages are Vietnamese only.
 * @returns useMutation to create vocabulary
 */
export const useCreateVocabulary = () => {
    const invalidate = useInvalidateVocabulary();
    const { t } = useTranslation();
    return useMutation({
        mutationFn: (payload: ICreateVocabularyFullMultipartType) => vocabularyService.createVocabulary(payload),
        onSuccess: (result) => {
            invalidate();
            toast.success(
                t(
                    result.data.isNew
                        ? "vocabulary.createVocabulary.createSuccess"
                        : "vocabulary.createVocabulary.meaningAdded",
                ),
            );
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error, t("vocabulary.createVocabulary.generalError")));
        },
    });
};
//--------------------------------End--------------------------------//

/**
 * Handle Delete Vocabulary
 * @returns useMutation to delete vocabulary
 */
export const useDeleteVocabulary = () => {
    const invalidate = useInvalidateVocabulary();
    const { t } = useTranslation();
    return useMutation({
        mutationFn: (id: number) => vocabularyService.deleteVocabulary(id),
        onSuccess: () => {
            invalidate();
            toast.success(t("vocabulary.deleteSuccess"));
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error, t("vocabulary.deleteError")));
        },
    });
};
//--------------------------------End--------------------------------//

/**
 * Handle Update Vocabulary
 * @returns useMutation to update vocabulary
 */
export const useUpdateVocabulary = () => {
    const invalidate = useInvalidateVocabulary();
    const { t } = useTranslation();
    return useMutation({
        mutationFn: ({
            wordJp,
            regenerateAudio = false,
            payload,
        }: {
            wordJp: string;
            regenerateAudio?: boolean;
            payload: IUpdateVocabularyPayload;
        }) => vocabularyService.putVocabulary(wordJp, payload, regenerateAudio),
        onSuccess: () => {
            invalidate();
            toast.success(t("vocabulary.updateSuccess"));
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error, t("vocabulary.updateError")));
        },
    });
};
//--------------------------------End--------------------------------//
