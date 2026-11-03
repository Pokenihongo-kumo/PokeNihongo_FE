import { axiosPrivate } from "@configs/axios";
import { ICreateDailyRequestRequest } from "@models/dailyRequest/request";
import { IQueryRequest } from "@models/common/request";

const dailyRequestService = {
    getDailyRequestList: async (
        params?: IQueryRequest & {
            nameTranslation?: string;
            isStreak?: boolean;
            isActive?: boolean;
            rewardId?: number;
            dailyRequestType?: string;
        },
    ) => {
        const queryParams = new URLSearchParams();
        const qsParts: string[] = [];

        // Sort
        if (params?.sortBy) {
            const sortDirection = params.sort === "desc" ? "-" : "";
            qsParts.push(`sort:${sortDirection}${params.sortBy}`);
        }

        // Filters
        if (params?.nameTranslation) {
            qsParts.push(`nameTranslation:like=${params.nameTranslation}`);
        }

        if (params?.isStreak !== undefined) {
            qsParts.push(`isStreak=${params.isStreak}`);
        }

        if (params?.isActive !== undefined) {
            qsParts.push(`isActive=${params.isActive}`);
        }

        if (params?.rewardId) {
            qsParts.push(`rewardId=${params.rewardId}`);
        }

        if (params?.dailyRequestType) {
            qsParts.push(`dailyRequestType=${params.dailyRequestType}`);
        }

        // Add qs parameter if we have any filters
        if (qsParts.length > 0) {
            queryParams.append("qs", qsParts.join(","));
        }

        // Pagination
        if (params?.page) {
            queryParams.append("currentPage", params.page.toString());
        }

        if (params?.limit) {
            queryParams.append("pageSize", params.limit.toString());
        }

        const queryString = queryParams.toString();
        return axiosPrivate.get(`/daily-request${queryString ? `?${queryString}` : ""}`);
    },
    createDailyRequest: async (data: ICreateDailyRequestRequest) => {
        return axiosPrivate.post("/daily-request", data);
    },
    //TODO: Update daily request sau khi Pilu thêm cái get by daily request id cho admin
    updateDailyRequest: async (dailyRequestId: number, data: ICreateDailyRequestRequest) => {
        return axiosPrivate.put(`/daily-request/${dailyRequestId}`, data);
    },
    deleteDailyRequest: async (dailyRequestId: number) => {
        return axiosPrivate.delete(`/daily-request/${dailyRequestId}`);
    },
};

export default dailyRequestService;
