import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import shopService from "@services/shop";
import { IShopBannerSchema } from "@models/shop/entity";
import { IShopBannerAllPokemonResponseSchema, IShopItemRandomSchema } from "@models/shop/response";
import { ICreateShopBannerRequest, ICreateShopItemsRequest, IUpdateShopItemsRequest } from "@models/shop/request";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "@redux/features/language/selector";
import { PaginationResponseType } from "@models/common/response";

/**
 * Handle Shop Banner List
 * @param params
 * @returns
 */
export const useShopBannerList = (params: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    status?: string[];
}) => {
    const currentLanguage = useSelector(selectCurrentLanguage);
    return useQuery<{ data: PaginationResponseType<IShopBannerSchema> }>({
        queryKey: ["shopBanners", params, currentLanguage],
        queryFn: async () => {
            const response = await shopService.getAllShopBanners(params);
            return response.data;
        },
    });
};
//------------------------End------------------------//

/**
 * Handle Get Shop Item Random
 * @param shopBannerId
 * @param amount
 * @returns
 */
export const useShopItemRandom = (shopBannerId: number, amount: number) => {
    return useQuery<{ data: IShopItemRandomSchema[] }>({
        queryKey: ["shopItemRandom", shopBannerId, amount],
        queryFn: async () => {
            const response = await shopService.getShopItemRandom(shopBannerId, amount);
            return response.data;
        },
    });
};
//------------------------End------------------------//

/**
 * Handle Get Shop Banner All Pokemon By Shop Banner ID
 * @param shopBannerId
 * @param params
 * @returns
 */
export const useShopBannerAllPokemonByShopBannerId = (
    shopBannerId: number,
    params?: {
        page?: number;
        limit?: number;
        sort?: string;
        search?: string;
        rarity?: string;
        types?: string | number;
    },
) => {
    return useQuery<{ data: PaginationResponseType<IShopBannerAllPokemonResponseSchema> }>({
        queryKey: ["shopBannerAllPokemon", shopBannerId, params],
        queryFn: async () => {
            const response = await shopService.getShopBannerAllPokemonByShopBannerId(shopBannerId, params);
            return response.data;
        },
    });
};
//------------------------End------------------------//

/**
 * Handle Create Shop Banner
 * @returns useMutation to create shop banner
 */
export const useCreateShopBanner = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: async (data: ICreateShopBannerRequest) => {
            const response = await shopService.createShopBanner(data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["shopBanners"] });
            toast.success(t("configShop.createSuccess"));
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || t("configShop.createError"));
        },
    });
};
//-------------------End-------------------//

/**
 * Handle Get Shop Banner By ID
 * @param id
 * @returns
 */
export const useShopBannerById = (id: number | null) => {
    return useQuery<{ data: IShopBannerSchema }>({
        queryKey: ["shopBanner", id],
        queryFn: async () => {
            if (!id) throw new Error("Shop banner ID is required");
            const response = await shopService.getShopBannerById(id);
            return response.data;
        },
        enabled: !!id,
    });
};
//------------------------End------------------------//

/**
 * Handle Create Shop Items
 * @returns
 */
export const useCreateShopItems = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: async (data: ICreateShopItemsRequest) => {
            const response = await shopService.createShopItemWithRandom(data);
            return response.data;
        },
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ["shopBannerAllPokemon"] });
            queryClient.invalidateQueries({ queryKey: ["shopBanner"] });
            toast.success(data?.message || t("configShop.addPokemonSuccess"));
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || t("configShop.addPokemonError"));
        },
    });
};
//-------------------End-------------------//

/**
 * Handle Update Shop Item By Shop Item ID
 * @returns useMutation to update shop item by shop item id
 */
export const useUpdateShopItemByShopItemId = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: IUpdateShopItemsRequest }) => {
            const response = await shopService.updateShopItemByShopItemId(id, data);
            return response.data;
        },
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ["shopBannerAllPokemon"] });
            queryClient.invalidateQueries({ queryKey: ["shopBanner"] });
            toast.success(data?.message || t("configShop.updatePokemonSuccess"));
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || t("configShop.updatePokemonError"));
        },
    });
};
//-------------------End-------------------//

/**
 * Handle Update Shop Banner
 * @returns useMutation to update shop banner
 */
export const useUpdateShopBanner = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: ICreateShopBannerRequest }) => {
            const response = await shopService.updateShopBanner(id, data);
            return response.data;
        },
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ["shopBanners"] });
            queryClient.invalidateQueries({ queryKey: ["shopBanner"] });
            toast.success(data?.message || t("configShop.updateBannerSuccess"));
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || t("configShop.updateBannerError"));
        },
    });
};
//-------------------End-------------------//

/**
 * Handle Delete Shop Item
 * @returns useMutation to delete shop item
 */
export const useDeleteShopItem = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: async (id: number) => {
            const response = await shopService.deleteShopItem(id);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["shopBanner"] });
            // toast.success(data?.message || t('configShop.deletePokemonSuccess'));
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || t("configShop.deletePokemonError"));
        },
    });
};
//-------------------End-------------------//
