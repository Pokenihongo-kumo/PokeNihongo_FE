import { ICreateDailyRequestRequest } from "@models/dailyRequest/request";
import dailyRequestService from "@services/dailyRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IQueryRequest } from "@models/common/request";
import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "@redux/features/language/selector";

/**
 * Handle Get Daily Request List
 * @returns { getDailyRequestListQuery }
 */
export const useGetDailyRequestList = (params?: IQueryRequest) => {
    const currentLanguage = useSelector(selectCurrentLanguage);

    const getDailyRequestListQuery = useQuery({
        queryKey: ["daily-request-list", params, currentLanguage],
        queryFn: () => dailyRequestService.getDailyRequestList(params),
    });
    return {
        data: getDailyRequestListQuery.data?.data?.data,
        isLoading: getDailyRequestListQuery.isLoading,
        error: getDailyRequestListQuery.error,
    };
};
//------------------------End------------------------//

/**
 * Handle Create Daily Request
 * @returns { createDailyRequestMutation }
 */
export const useCreateDailyRequest = () => {
    const queryClient = useQueryClient();
    const createDailyRequestMutation = useMutation({
        mutationFn: (data: ICreateDailyRequestRequest) => dailyRequestService.createDailyRequest(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["daily-request-list"] });
        },
    });
    return createDailyRequestMutation;
};
//------------------------End------------------------//
