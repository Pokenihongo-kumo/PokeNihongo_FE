import { IQueryRequest } from "@models/common/request";
import { useQuery } from "@tanstack/react-query";
import wordTypeService from "@services/wordType";

/**
 * hanlde Vocabulary List
 * @param params
 * @returns
 */
export const useWordTypeList = (params: IQueryRequest) => {
    const { page, limit, sortBy, sortOrder } = params;

    const { data, isLoading, error } = useQuery({
        queryKey: ["word-type-list", page, limit, sortBy, sortOrder],
        queryFn: () => wordTypeService.getAllWordTypes(params),
    });

    return { data: data?.data, isLoading, error };
};
