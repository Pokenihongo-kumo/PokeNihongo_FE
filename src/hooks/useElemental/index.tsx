import { useQuery } from "@tanstack/react-query";
import elementService from "@services/element";
import { IQueryRequest } from "@models/common/request";

/**
 * hanlde Elemental Type List
 * @param params
 * @returns
 */
export const useElementalTypeList = (params: IQueryRequest) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["elemental-type-list", params],
        queryFn: () => elementService.getAllElementalType(params?.qstype, params?.qs, params?.page, params?.limit),
        enabled: !!params.page && !!params.limit,
    });

    return { data: data?.data?.data, isLoading, error };
};
//------------------------End------------------------//
