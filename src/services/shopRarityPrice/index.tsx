import { axiosPrivate } from "@configs/axios";
import { IUpdateShopRarityPriceRequest } from "@models/shopRarityPrice/request";

const shopRarityPriceService = {
    getShopRarityPriceList: async () => {
        return axiosPrivate.get("/shop-rarity-price");
    },
    updateShopRarityPrice: async (id: number, data: IUpdateShopRarityPriceRequest) => {
        return axiosPrivate.put(`/shop-rarity-price/${id}`, data);
    },
};

export default shopRarityPriceService;
