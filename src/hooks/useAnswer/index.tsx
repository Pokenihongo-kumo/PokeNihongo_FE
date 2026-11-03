import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import answerService from "@services/answer";
import { ICreateAnswerRequest } from "@models/answer/request";
import { getApiErrorMessage } from "@utils/api-error";

/**
 * Hook for updating a single answer
 * @returns mutation object with updateAnswer function
 */
export const useUpdateAnswer = () => {
    const queryClient = useQueryClient();

    const updateAnswerMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<ICreateAnswerRequest> }) =>
            answerService.updateAnswer(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["question-bank-list"] });
            queryClient.invalidateQueries({ queryKey: ["answer-list"] });
            toast.success("Cập nhật đáp án thành công!");
        },
        onError: (error: unknown) => {
            console.error("Error updating answer:", error);
            toast.error(getApiErrorMessage(error, "Có lỗi xảy ra khi cập nhật đáp án"));
        },
    });

    return updateAnswerMutation;
};

/**
 * Hook for creating a single answer
 * @returns mutation object with createAnswer function
 */
export const useCreateAnswer = () => {
    const queryClient = useQueryClient();

    const createAnswerMutation = useMutation({
        mutationFn: ({ questionBankId, answer }: { questionBankId: number; answer: ICreateAnswerRequest }) =>
            answerService.createMultipleAnswers({ questionBankId, answers: [answer] }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["question-bank-list"] });
            queryClient.invalidateQueries({ queryKey: ["answer-list"] });
            toast.success("Tạo đáp án thành công!");
        },
        onError: (error: unknown) => {
            console.error("Error creating answer:", error);
            toast.error(getApiErrorMessage(error, "Có lỗi xảy ra khi tạo đáp án"));
        },
    });

    return createAnswerMutation;
};

/**
 * Hook for deleting a single answer
 * @returns mutation object with deleteAnswer function
 */
export const useDeleteAnswer = () => {
    const queryClient = useQueryClient();

    const deleteAnswerMutation = useMutation({
        mutationFn: (id: number) => answerService.deleteAnswer(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["question-bank-list"] });
            queryClient.invalidateQueries({ queryKey: ["answer-list"] });
            toast.success("Xóa đáp án thành công!");
        },
        onError: (error: unknown) => {
            console.error("Error deleting answer:", error);
            toast.error(getApiErrorMessage(error, "Có lỗi xảy ra khi xóa đáp án"));
        },
    });

    return deleteAnswerMutation;
};
