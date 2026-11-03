import { IUpdateShopRarityPriceRequest } from "@models/shopRarityPrice/request";
import shopRarityPriceService from "@services/shopRarityPrice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

/**
 * Handle Shop Rarity Price List
 * @returns
 */
export const useShopRarityPrice = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["shop-rarity-price"],
        queryFn: () => shopRarityPriceService.getShopRarityPriceList(),
    });
    return { data: data?.data?.data, isLoading, error };
};
//----------------------End----------------------//

/**
 * Handle Update Shop Rarity Price
 * @returns useMutation to update shop rarity price
 */
export const useUpdateShopRarityPrice = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: IUpdateShopRarityPriceRequest }) => {
            const response = await shopRarityPriceService.updateShopRarityPrice(id, data);
            return response.data;
        },
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ["shop-rarity-price"] });
            toast.success(data?.message || t("configShop.updateRarityPriceSuccess"));
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || t("configShop.updateRarityPriceError"));
        },
    });
};
//----------------------End----------------------//
