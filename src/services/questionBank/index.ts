import { axiosPrivate } from "@configs/axios";
import {
    ICreateQuestionRequest,
    IQueryQuestionRequest,
    IBulkCreateQuestionRequest,
    IBulkDeleteQuestionRequest,
    IBulkUpdateQuestionRequest,
} from "@models/questionBank/request";
import { QuestionResponseType } from "@models/questionBank/response";
import { QuestionEntityType } from "@models/questionBank/entity";
import { JLPT_LEVEL, QUESTION_TYPE_LABELS, JLPT_LEVEL_LABELS, QUESTION_STATUS_LABELS } from "@constants/questionBank";

const questionBankService = {
    getQuestionList: async (params?: IQueryQuestionRequest): Promise<QuestionResponseType> => {
        const queryParams = new URLSearchParams();

        // Pagination
        if (params?.page) {
            queryParams.append("currentPage", params.page.toString());
        }

        if (params?.limit) {
            queryParams.append("pageSize", params.limit.toString());
        }

        // Filters
        if (params?.levelN) {
            queryParams.append("levelN", params.levelN.toString());
        }

        if (params?.questionType) {
            queryParams.append("questionType", params.questionType);
        }

        if (params?.status) {
            queryParams.append("status", params.status);
        }

        if (params?.search) {
            queryParams.append("search", params.search);
        }

        // Sort
        if (params?.sortBy) {
            queryParams.append("sortBy", params.sortBy);
        }

        if (params?.sort) {
            queryParams.append("sort", params.sort);
        }

        if (params?.noTestSet) {
            queryParams.append("noTestSet", params.noTestSet.toString());
        }

        if (params?.testSetId) {
            queryParams.append("testSetId", params.testSetId.toString());
        }

        const queryString = queryParams.toString();
        return axiosPrivate.get(`/question-bank${queryString ? `?${queryString}` : ""}`);
    },

    getQuestionById: async (id: number): Promise<{ data: QuestionEntityType }> => {
        return axiosPrivate.get(`/question-bank/${id}`);
    },

    createQuestion: async (data: ICreateQuestionRequest): Promise<{ data: QuestionEntityType }> => {
        return axiosPrivate.post("/question-bank/with-answers", data);
    },

    updateQuestion: async (
        id: number,
        data: Partial<ICreateQuestionRequest>,
    ): Promise<{ data: QuestionEntityType }> => {
        return axiosPrivate.put(`/question-bank/${id}`, data);
    },

    deleteQuestion: async (id: number): Promise<{ message: string }> => {
        return axiosPrivate.delete(`/question-bank/${id}`);
    },

    // Bulk operations
    createMultipleQuestions: async (data: IBulkCreateQuestionRequest): Promise<{ data: QuestionEntityType[] }> => {
        return axiosPrivate.post("/question-bank/bulk", data);
    },

    deleteMultipleQuestions: async (data: IBulkDeleteQuestionRequest): Promise<{ message: string }> => {
        return axiosPrivate.delete("/question-bank/bulk", { data });
    },

    updateMultipleQuestions: async (data: IBulkUpdateQuestionRequest): Promise<{ data: QuestionEntityType[] }> => {
        return axiosPrivate.put("/question-bank/bulk", data);
    },

    // Get question types for dropdown/select
    getQuestionTypes: async (): Promise<{
        data: Array<{ value: string; label: string }>;
    }> => {
        return Promise.resolve({
            data: Object.entries(QUESTION_TYPE_LABELS).map(([value, label]) => ({
                value,
                label: typeof label === "string" ? label : (Object.values(label)[0] as string),
            })),
        });
    },

    // Get JLPT levels
    getJLPTLevels: async (): Promise<{
        data: Array<{ value: number; label: string }>;
    }> => {
        return Promise.resolve({
            data: Object.entries(JLPT_LEVEL_LABELS).map(([key, label]) => ({
                value: JLPT_LEVEL[key as keyof typeof JLPT_LEVEL],
                label: typeof label === "string" ? label : (Object.values(label)[0] as string),
            })),
        });
    },

    // Get question statuses
    getQuestionStatuses: async (): Promise<{
        data: Array<{ value: string; label: string }>;
    }> => {
        return Promise.resolve({
            data: Object.entries(QUESTION_STATUS_LABELS).map(([value, label]) => ({
                value,
                label: typeof label === "string" ? label : (Object.values(label)[0] as string),
            })),
        });
    },
};

export default questionBankService;
