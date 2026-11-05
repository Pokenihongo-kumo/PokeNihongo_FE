import { axiosPrivate } from "@configs/axios";
import { ICreateVocabularyFullMultipartType, IUpdateVocabularyPayload } from "@models/vocabulary/request";
import { IQueryRequest } from "@models/common/request";
import {
    CreateVocabularyFullResultSchema,
    VocabularyListSchema,
    VocabularySchema,
    VocabularyStatisticsSchema,
} from "@models/vocabulary";
import { toApiResult } from "@utils/api-response";

const vocabularyService = {
    createVocabulary: async (payload: ICreateVocabularyFullMultipartType) => {
        // Build FormData for multipart submission, including optional files
        const formData = new FormData();
        formData.append("word_jp", String(payload.word_jp));
        formData.append("reading", String(payload.reading));
        if (payload.level_n !== undefined && payload.level_n !== null) {
            formData.append("level_n", String(payload.level_n));
        }
        if (payload.word_type_id !== undefined && payload.word_type_id !== null) {
            formData.append("word_type_id", String(payload.word_type_id));
        }
        // Translations: ensure JSON string
        const translationsValue =
            typeof payload.translations === "string" ? payload.translations : JSON.stringify(payload.translations);
        formData.append("translations", translationsValue);

        // Optional media files
        if (payload.imageFile) {
            formData.append("imageFile", payload.imageFile as File);
        }
        if (payload.audioFile) {
            formData.append("audioFile", payload.audioFile as File);
        }

        const response = await axiosPrivate.post("/vocabulary/full", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return toApiResult(response, CreateVocabularyFullResultSchema);
    },
    getAllVocabularies: async (data: IQueryRequest) => {
        const queryParams = new URLSearchParams();
        if (data.page) queryParams.append("currentPage", data.page.toString());
        if (data.limit) queryParams.append("pageSize", data.limit.toString());
        if (data.search) queryParams.append("search", data.search);
        if (data.levelN) queryParams.append("levelN", data.levelN);
        if (data.sortBy) queryParams.append("sortBy", data.sortBy);
        if (data.sort) queryParams.append("sort", data.sort);
        if (data.lessonId) queryParams.append("lessonId", data.lessonId.toString());

        const response = await axiosPrivate.get(`/vocabulary?${queryParams.toString()}`);
        return toApiResult(response, VocabularyListSchema);
    },
    getStatistics: async () => {
        const response = await axiosPrivate.get("/vocabulary/statistics");
        return toApiResult(response, VocabularyStatisticsSchema);
    },
    putVocabulary: async (wordJp: string, payload: IUpdateVocabularyPayload, regenerateAudio: boolean = false) => {
        const formData = new FormData();
        formData.append("wordJp", wordJp);

        if (payload.reading !== undefined) {
            formData.append("reading", String(payload.reading));
        }

        if (payload.level_n !== undefined && payload.level_n !== null) {
            formData.append("level_n", String(payload.level_n));
        }

        if (payload.word_type_id !== undefined && payload.word_type_id !== null) {
            formData.append("word_type_id", String(payload.word_type_id));
        }

        if (payload.translations) {
            const translationsValue =
                typeof payload.translations === "string" ? payload.translations : JSON.stringify(payload.translations);
            formData.append("translations", translationsValue);
        }

        if (payload.imageUrl) {
            formData.append("imageUrl", payload.imageUrl);
        }

        if (payload.audioUrl) {
            formData.append("audioUrl", payload.audioUrl);
        }

        const response = await axiosPrivate.put(
            `/vocabulary/by-word/${encodeURIComponent(wordJp)}?regenerateAudio=${Boolean(regenerateAudio)}`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            },
        );
        return toApiResult(response, VocabularySchema);
    },
    deleteVocabulary: async (id: number) => {
        const response = await axiosPrivate.delete(`/vocabulary/${id}`);
        return toApiResult(response, VocabularySchema);
    },
};

export default vocabularyService;
